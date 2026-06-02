from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from auth_utils import get_current_user
from database import get_db, get_settings
from bson import ObjectId
from datetime import datetime
from groq import Groq
from routes.quiz import check_and_award_badges
import json, re, httpx

router = APIRouter()

# ── JDoodle Code Execution ────────────────────────────────────────
JDOODLE_URL = "https://api.jdoodle.com/v1/execute"

# JDoodle language slugs + version map
JDOODLE_LANG_MAP = {
    # ── Primary (shown as pills in UI) ────────────────────────────
    "python":     {"language": "python3",     "versionIndex": "4"},
    "javascript": {"language": "nodejs",      "versionIndex": "4"},
    "java":       {"language": "java",        "versionIndex": "4"},
    "c":          {"language": "c",           "versionIndex": "5"},
    "cpp":        {"language": "cpp17",       "versionIndex": "1"},
    "csharp":     {"language": "csharp",      "versionIndex": "4"},
    "go":         {"language": "go",          "versionIndex": "4"},
    "rust":       {"language": "rust",        "versionIndex": "4"},
    "typescript": {"language": "typescript",  "versionIndex": "4"},
    # ── Extra (shown in "More" dropdown in UI) ─────────────────────
    "kotlin":     {"language": "kotlin",      "versionIndex": "3"},
    "ruby":       {"language": "ruby",        "versionIndex": "4"},
    "php":        {"language": "php",         "versionIndex": "4"},
    "swift":      {"language": "swift",       "versionIndex": "4"},
    "scala":      {"language": "scala",       "versionIndex": "4"},
    "perl":       {"language": "perl",        "versionIndex": "4"},
    "haskell":    {"language": "haskell",     "versionIndex": "4"},
    "r":          {"language": "r",           "versionIndex": "4"},
    "bash":       {"language": "bash",        "versionIndex": "4"},
    "lua":        {"language": "lua",         "versionIndex": "2"},
    "dart":       {"language": "dart",        "versionIndex": "4"},
    "elixir":     {"language": "elixir",      "versionIndex": "4"},
}

class ExecuteCodeRequest(BaseModel):
    language: str
    code: str
    stdin: Optional[str] = ""

@router.post("/execute-code")
async def execute_code(req: ExecuteCodeRequest, current_user=Depends(get_current_user)):
    settings = get_settings()

    if not settings.jdoodle_client_id or not settings.jdoodle_client_secret:
        raise HTTPException(
            status_code=503,
            detail="Code execution service not configured. Add JDOODLE_CLIENT_ID and JDOODLE_CLIENT_SECRET to backend/.env"
        )

    lang_info = JDOODLE_LANG_MAP.get(req.language.lower())
    if not lang_info:
        raise HTTPException(status_code=400, detail=f"Unsupported language: {req.language}")

    payload = {
        "clientId":     settings.jdoodle_client_id,
        "clientSecret": settings.jdoodle_client_secret,
        "script":       req.code,
        "stdin":        req.stdin or "",
        "language":     lang_info["language"],
        "versionIndex": lang_info["versionIndex"],
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(JDOODLE_URL, json=payload)

        data = resp.json()

        # JDoodle returns statusCode 200 in body on success
        if resp.status_code != 200:
            raise HTTPException(status_code=502, detail=f"JDoodle error: {data.get('error', 'Unknown error')}")

        return {
            "output":      data.get("output", ""),
            "statusCode":  data.get("statusCode", 200),
            "memory":      data.get("memory", ""),
            "cpuTime":     data.get("cpuTime", ""),
        }

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Code execution timed out")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Execution failed: {str(e)}")

def get_groq():
    return Groq(api_key=get_settings().groq_api_key)

# ── Study Notes ──────────────────────────────────────────────────
class NotesRequest(BaseModel):
    roadmap_id: str
    topic_id: str
    roadmap_title: str
    topic_name: str
    subtopics: List[str] = []
    difficulty: str = "Beginner"

@router.post("/study-notes")
async def generate_study_notes(req: NotesRequest, current_user=Depends(get_current_user), db=Depends(get_db)):
    cache_key = {
        "user_id": current_user["id"],
        "roadmap_id": req.roadmap_id,
        "topic_id": req.topic_id
    }
    cached = await db.study_notes.find_one(cache_key)
    if cached:
        return {"notes": cached["notes"]}

    try:
        client = get_groq()
        prompt = f"""Create comprehensive study notes for the topic: "{req.topic_name}"
Subtopics: {", ".join(req.subtopics)}
Level: {req.difficulty}

Format as structured markdown:
# {req.topic_name} - {req.roadmap_title}
## Key Concepts
## Detailed Explanations (with examples)
## Code Examples (if applicable, use proper code blocks)
## Common Mistakes to Avoid
## Quick Summary / Cheat Sheet
## Practice Questions

Make it comprehensive but concise."""
        resp = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.6, max_tokens=3000
        )
        notes = resp.choices[0].message.content.strip()
        
        await db.study_notes.insert_one({
            **cache_key,
            "notes": notes,
            "created_at": datetime.utcnow()
        })
        return {"notes": notes}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Notes generation failed: {str(e)}")

# ── Daily Challenge (NO mark-as-done, topic-based) ───────────────
@router.get("/daily-challenge")
async def get_daily_challenge(current_user=Depends(get_current_user), db=Depends(get_db)):
    today = datetime.utcnow().date().isoformat()

    # Check if already generated today
    existing = await db.daily_challenges.find_one({"user_id": current_user["id"], "date": today})
    if existing:
        existing["id"] = str(existing["_id"]); existing.pop("_id", None)
        return existing

    # Get user's active roadmap + CURRENT topic for context
    roadmaps = [r async for r in db.roadmaps.find({"user_id": current_user["id"]}).sort("updated_at", -1).limit(3)]
    
    # Find the most recently active incomplete roadmap
    active_roadmap = None
    for r in roadmaps:
        if r.get("progress_percent", 0) < 100:
            active_roadmap = r
            break

    skill_context = "Programming"
    current_topic = "Programming Fundamentals"
    roadmap_title = None
    subtopics = []

    if active_roadmap:
        current_idx = active_roadmap.get("current_topic_index", 0)
        topics = active_roadmap.get("topics", [])
        skills = active_roadmap.get("skills", ["Programming"])
        skill_context = skills[0] if skills else "Programming"
        roadmap_title = active_roadmap.get("title", "")
        
        if topics and current_idx < len(topics):
            current_topic_obj = topics[current_idx]
            current_topic = current_topic_obj.get("name", "Programming Fundamentals")
            subtopics = current_topic_obj.get("subtopics", [])

    try:
        client = get_groq()
        prompt = f"""Generate ONE practical daily learning challenge for someone currently studying:
- Skill: {skill_context}
- Current Topic: "{current_topic}"
- Subtopics being covered: {", ".join(subtopics) if subtopics else "general concepts"}
{f"- Roadmap: {roadmap_title}" if roadmap_title else ""}

The challenge MUST be directly related to "{current_topic}".

IMPORTANT: Write all user-facing text (description, task, hints, learning_objective) speaking DIRECTLY to the user using "you" and "your". Never say "the learner" or use third-person language.

Return ONLY valid JSON (no markdown):
{{
  "title": "Short challenge title related to {current_topic}",
  "difficulty": "Easy",
  "category": "{current_topic}",
  "description": "2-sentence description speaking directly to the user (use 'you'). E.g. 'In this challenge, you will practice...'",
  "task": "The specific hands-on task written directly to the user. E.g. 'Your task is to write a function that...'",
  "hints": ["hint written to the user using you/your", "another hint", "another hint"],
  "example_input": "concrete example input if coding task, else empty string",
  "example_output": "expected output if coding task, else empty string",
  "learning_objective": "What you will understand after completing this challenge (start with 'You will...')",
  "related_topic": "{current_topic}"
}}"""

        resp = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.8, max_tokens=800
        )
        text = re.sub(r'^```(?:json)?\s*', '', resp.choices[0].message.content.strip())
        text = re.sub(r'\s*```$', '', text)
        challenge = json.loads(text)
        challenge.update({
            "user_id": current_user["id"],
            "date": today,
            "created_at": datetime.utcnow(),
            "roadmap_title": roadmap_title,
            "skill": skill_context,
        })
        result = await db.daily_challenges.insert_one(challenge)
        challenge["id"] = str(result.inserted_id)
        challenge.pop("_id", None)
        return challenge
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Challenge generation failed: {str(e)}")

# ── Badges ────────────────────────────────────────────────────────
@router.get("/badges")
async def get_badges(current_user=Depends(get_current_user), db=Depends(get_db)):
    user = await db.users.find_one({"_id": ObjectId(current_user["id"])})
    earned = user.get("badges", [])
    all_badges = [
        {"id": "first_roadmap", "name": "Pathfinder", "icon": "Map", "desc": "Created your first roadmap"},
        {"id": "first_complete", "name": "Topic Master", "icon": "CheckCircle", "desc": "Completed your first topic"},
        {"id": "ten_topics", "name": "Dedicated Learner", "icon": "BookOpen", "desc": "Completed 10 topics"},
        {"id": "fifty_topics", "name": "Knowledge Seeker", "icon": "Flame", "desc": "Completed 50 topics"},
        {"id": "roadmap_complete", "name": "Roadmap Champion", "icon": "Trophy", "desc": "Finished a complete roadmap"},
        {"id": "streak_3", "name": "Consistent", "icon": "CalendarClock", "desc": "3-day learning streak"},
        {"id": "streak_7", "name": "Week Warrior", "icon": "Zap", "desc": "7-day learning streak"},
        {"id": "streak_30", "name": "Monthly Master", "icon": "Star", "desc": "30-day learning streak"},
        {"id": "xp_100", "name": "XP Hunter", "icon": "Gem", "desc": "Earned 100 XP points"},
        {"id": "xp_500", "name": "XP Collector", "icon": "Crown", "desc": "Earned 500 XP points"},
        {"id": "xp_1000", "name": "XP Legend", "icon": "Diamond", "desc": "Earned 1000 XP points"},
        {"id": "multi_skill", "name": "Polymath", "icon": "Brain", "desc": "Learning 3+ different skills"},
        {"id": "interview_ready", "name": "Interview Ready", "icon": "Mic", "desc": "Completed first interview practice"},
        {"id": "interview_pro", "name": "Interview Pro", "icon": "MessagesSquare", "desc": "Completed 5 interview practices"},
        {"id": "academic_ace", "name": "Academic Ace", "icon": "Award", "desc": "Scored a perfect 100% on any topic quiz"},
        {"id": "elite_craftsman", "name": "Elite Craftsman", "icon": "Code2", "desc": "AI Code Audit score of 9/10 or higher"},
        {"id": "silver_tongue", "name": "Silver Tongue", "icon": "PartyPopper", "desc": "Excellent verdict (9/10+) in Mock Interview"},
        {"id": "daily_disciplinarian", "name": "Daily Disciplinarian", "icon": "CalendarDays", "desc": "Solved 5 dynamic Daily Challenges"},
        {"id": "archivist", "name": "Archivist", "icon": "BookMarked", "desc": "Generated 5 Study Notes booklets"},
        {"id": "curious_mind", "name": "Curious Mind", "icon": "MessageSquareQuote", "desc": "Sent 20+ messages to your AI Tutor"},
        {"id": "night_owl", "name": "Night Owl", "icon": "Moon", "desc": "Learned or practiced between 12:00 AM & 4:00 AM"},
    ]
    earned_ids = {b["id"] for b in earned}
    return {
        "earned": earned,
        "all": [{**b, "earned": b["id"] in earned_ids} for b in all_badges]
    }

# ── Daily Challenge Answer Review ────────────────────────────────
class ChallengeAnswerRequest(BaseModel):
    challenge_id: str
    challenge_title: str
    task: str
    answer: str
    skill: str
    difficulty: str

@router.post("/daily-challenge/submit")
async def review_challenge_answer(req: ChallengeAnswerRequest, current_user=Depends(get_current_user), db=Depends(get_db)):
    try:
        # ── Idempotency: check if already answered ──────────────────
        existing_doc = await db.daily_challenges.find_one({"_id": ObjectId(req.challenge_id)})
        already_answered = existing_doc.get("answered", False) if existing_doc else False

        client = get_groq()
        prompt = f"""You are a friendly senior developer reviewing a student's answer. Talk directly TO them using "you/your", never say "the learner" or "the student".

Challenge: "{req.challenge_title}"
Task given: {req.task}
Skill: {req.skill}
Difficulty: {req.difficulty}

Their answer:
---
{req.answer}
---

Analyze their SPECIFIC answer above. Reference exactly what they wrote — quote specific parts, point out specific lines, mention specific words they used. Do NOT give generic feedback that could apply to anyone.

Return ONLY valid JSON:
{{
  "passed": true or false,
  "score": 78,
  "verdict": "Excellent" or "Good" or "Partial" or "Incorrect",
  "feedback": "2 sentences MAX. Talk directly to them. Reference something SPECIFIC from their answer. Example: 'Your explanation of CI/CD as... is spot on. You nailed the core idea.' NOT 'The answer demonstrates understanding.'",
  "strengths": ["Specific strength referencing their actual words/code", "Another specific strength"],
  "improvements": ["One precise thing missing or wrong in their answer", "Another specific gap if any"],
  "xp_awarded": 20 or 10 or 0
}}

Scoring rules:
- passed = true if they genuinely understand the concept (not just listed keywords without understanding)
- score: 90-100 = nailed it, 70-89 = solid with minor gaps, 40-69 = partial, 0-39 = missed the point
- xp_awarded: 20 if score >= 70, 10 if score 40-69, 0 if score < 40
- verdict matches score range: Excellent/Good/Partial/Incorrect
- strengths: reference their EXACT words/code, not generic praise
- improvements: be specific about what exactly is missing from THEIR answer, not general advice
- Keep everything short and punchy — no corporate language, no "the learner", no passive voice"""

        resp = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3, max_tokens=500
        )
        import re as re2
        text = re2.sub(r'^```(?:json)?\s*', '', resp.choices[0].message.content.strip())
        text = re2.sub(r'\s*```$', '', text)
        result = json.loads(text)

        # ── Award XP only on first submission ──────────────────────
        xp = result.get("xp_awarded", 0)
        if xp > 0 and not already_answered:
            await db.users.update_one(
                {"_id": ObjectId(current_user["id"])},
                {"$inc": {"xp_points": xp}, "$set": {"last_active": datetime.utcnow()}}
            )
        elif already_answered:
            xp = 0  # no double XP

        # ── Always persist answer + review so UI can restore on reload ──
        try:
            update_data = {
                "submitted_answer": req.answer,
                "review_result": result,
                "xp_awarded": xp,
                "answered_at": datetime.utcnow(),
            }
            # Only mark it definitively answered if they pass
            if result.get("passed", False) or result.get("score", 0) >= 60:
                update_data["answered"] = True
                
            await db.daily_challenges.update_one(
                {"_id": ObjectId(req.challenge_id)},
                {"$set": update_data}
            )
            # ── Check and award badges ─────────────────────────────
            await check_and_award_badges(current_user["id"], db)
        except Exception:
            pass

        result["xp_awarded"] = xp
        result["already_answered"] = already_answered
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Review failed: {str(e)}")


# ── Code Review ───────────────────────────────────────────────────
class CodeReviewRequest(BaseModel):
    code: str
    language: str
    context: Optional[str] = None

@router.post("/code-review")
async def review_code(req: CodeReviewRequest, current_user=Depends(get_current_user), db=Depends(get_db)):
    try:
        client = get_groq()
        system_prompt = """You are a senior, world-class developer conducting a strict, helpful, and highly detailed code review.
Your review style:
- Speak DIRECTLY to the developer using "you" and "your" throughout.
- NEVER refer to the author in the third person (e.g., do NOT say "the developer", "the student", "the user", "the programmer", or "the author").
- NEVER use third-person descriptions or passive voice.
- Evaluate the code strictly and objectively based on the rubric. Most code is not perfect — award high scores (9 or 10) ONLY for truly exceptional production-grade code.
"""
        user_prompt = f"""Please review my {req.language} code.

Here is my code:
```{req.language}
{req.code}
```
{f"Context: {req.context}" if req.context else ""}

SCORING RUBRIC (Be strict, realistic, and objective — most code is NOT a perfect 10):
- 9-10/10: Exceptional. Elegant, perfectly optimized, includes robust error handling, edge-case management, clean architecture, and best practices.
- 7-8/10: Good. Functional and correct, but has areas for optimization, minor redundant logic, or could improve naming/comment styling.
- 5-6/10: Average. Works for basic cases but has zero error handling, minor logic gaps, potential security issues, or messy naming.
- 3-4/10: Poor. Major structural issues, extremely inefficient logic, contains clear bugs, or doesn't fully solve the task.
- 1-2/10: Non-functional. Broken, highly incomplete, off-topic, or fails to execute.

Provide your structured review in this exact markdown format:
## Overall Assessment
## ✅ What You Did Well
## ⚠️ Issues in Your Code
## 🔧 Improved Version
## 📚 Best Practices to Remember
## Score: X/10

Be direct, honest, and reference specific parts of my code."""

        resp = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7, max_tokens=2000
        )
        review_text = resp.choices[0].message.content.strip()

        # ── Parse Code Review Score ──────────────────────────────
        score_match = re.search(r"Score:\s*(\d+(?:\.\d+)?)\s*/\s*10", review_text, re.IGNORECASE)
        score_val = 0
        if score_match:
            try:
                score_val = float(score_match.group(1))
            except ValueError:
                pass

        # ── Save to Database & Check Badges ──────────────────────
        try:
            await db.code_reviews.insert_one({
                "user_id": current_user["id"],
                "language": req.language,
                "code": req.code,
                "review": review_text,
                "score": score_val,
                "created_at": datetime.utcnow()
            })
            await check_and_award_badges(current_user["id"], db)
        except Exception:
            pass

        return {"review": review_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code review failed: {str(e)}")

# ── Interview Prep ────────────────────────────────────────────────
class InterviewRequest(BaseModel):
    skill: str
    level: str = "Beginner"
    question_type: str = "conceptual"

class InterviewAnswer(BaseModel):
    # question context
    question: str
    question_type: str = "conceptual"
    what_interviewer_looks_for: Optional[str] = None
    follow_up: Optional[str] = None
    # answer
    answer: str
    skill: str
    level: str

@router.post("/interview/question")
async def get_interview_question(req: InterviewRequest, current_user=Depends(get_current_user)):
    try:
        client = get_groq()
        # Map question_type to clear AI instructions
        type_instructions = {
            "conceptual": (
                "a CONCEPTUAL / THEORETICAL interview question. "
                "The question must test the candidate's understanding of concepts, definitions, and theory — "
                "NO code writing required. Example styles: 'What is X?', 'Explain the difference between X and Y', "
                "'How does X work under the hood?', 'Why would you use X over Y?'"
            ),
            "coding": (
                "a CODING / PROBLEM-SOLVING interview question. "
                "The question must require the candidate to write actual code or an algorithm. "
                "Example styles: 'Write a function that...', 'Implement...', 'Given an array, find...', "
                "'Optimize this code snippet...'. Include a concrete problem statement."
            ),
            "behavioral": (
                "a BEHAVIORAL interview question. "
                "The question must explore the candidate's past experiences, soft skills, and working style. "
                "Example styles: 'Tell me about a time when...', 'How do you handle...', "
                "'Describe a situation where...', 'What would you do if...'"
            ),
        }
        type_desc = type_instructions.get(
            req.question_type,
            f"a {req.question_type} interview question"
        )

        prompt = f"""Generate ONE {type_desc} for a {req.level} {req.skill} developer.

Return ONLY valid JSON:
{{
  "question": "The interview question",
  "type": "{req.question_type}",
  "difficulty": "{req.level}",
  "what_interviewer_looks_for": "2-3 key points a good answer should cover",
  "follow_up": "A likely follow-up question the interviewer might ask"
}}"""
        resp = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.9, max_tokens=500
        )
        text = re.sub(r'^```(?:json)?\s*', '', resp.choices[0].message.content.strip())
        text = re.sub(r'\s*```$', '', text)
        return json.loads(text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Question generation failed: {str(e)}")

@router.post("/interview/evaluate")
async def evaluate_answer(req: InterviewAnswer, current_user=Depends(get_current_user), db=Depends(get_db)):
    try:
        client = get_groq()
        prompt = f"""You are a strict but fair senior {req.skill} interviewer evaluating a {req.level} candidate's answer.

Interview Question:
{req.question}

Candidate's Answer:
---
{req.answer}
---

Carefully read the answer above and evaluate it honestly.

SCORING RULES (be strict and realistic — most answers are NOT perfect):
- 9-10: Exceptional. Covers all key concepts, shows deep understanding, uses precise terminology, includes edge cases or examples.
- 7-8: Good. Covers the main concepts correctly with minor gaps or imprecision.
- 5-6: Average. Gets the general idea but misses important concepts or has notable inaccuracies.
- 3-4: Poor. Shows only surface-level understanding, significant gaps or errors.
- 1-2: Very poor. Mostly wrong, off-topic, or a one-liner with no real understanding shown.

VERDICT RULES (follow strictly):
- "Excellent" ONLY for score 9-10
- "Good" ONLY for score 7-8
- "Needs Improvement" for score 4-6
- "Poor" for score 1-3

WRITING RULES (critical):
- Speak DIRECTLY to the candidate using "you" and "your". NEVER say "the candidate", "the student", or "they".
- Reference SPECIFIC things from their actual answer — quote or paraphrase what they actually wrote.
- Do NOT give generic praise. If their answer is weak, say so honestly.
- Do NOT always give 7. Base the score purely on the scoring rubric above.

Return ONLY valid JSON, no markdown, no extra text:
{{
  "score": <integer 1-10 based strictly on the rubric>,
  "verdict": "<Excellent|Good|Needs Improvement|Poor>",
  "strengths": ["Specific strength quoting or referencing what they actually wrote"],
  "gaps": ["Specific concept or detail they missed or got wrong in their answer"],
  "ideal_answer_points": ["Key concept a strong answer must include", "Another key point", "Another key point"],
  "feedback": "2-3 sentences directly to them using you/your. Reference something specific from their answer. Be honest, not generically encouraging.",
  "tip": "One concrete actionable tip specific to the gaps in their answer"
}}"""
        resp = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3, max_tokens=700
        )
        text = re.sub(r'^```(?:json)?\s*', '', resp.choices[0].message.content.strip())
        text = re.sub(r'\s*```$', '', text)
        evaluation = json.loads(text)

        # ── Persist the full session to interview_history ──────────
        try:
            await db.interview_history.insert_one({
                "user_id": current_user["id"],
                "skill": req.skill,
                "level": req.level,
                "question_type": req.question_type,
                "question": req.question,
                "what_interviewer_looks_for": req.what_interviewer_looks_for,
                "follow_up": req.follow_up,
                "answer": req.answer,
                "evaluation": evaluation,
                "practiced_at": datetime.utcnow(),
            })
            
            # Check for interview badges
            await check_and_award_badges(current_user["id"], db)
            
        except Exception:
            pass  # Don't fail the response if save fails

        return evaluation
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")


@router.get("/interview/history")
async def get_interview_history(current_user=Depends(get_current_user), db=Depends(get_db)):
    """Return all past interview practice sessions for the current user, newest first."""
    try:
        cursor = db.interview_history.find(
            {"user_id": current_user["id"]}
        ).sort("practiced_at", -1).limit(100)
        history = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            doc.pop("_id", None)
            history.append(doc)
        return {"history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch history: {str(e)}")


# ── Generate Lesson (with MongoDB caching) ────────────────────────
class LessonRequest(BaseModel):
    roadmap_id: str
    topic_index: int
    topic_name: str
    subtopics: List[str] = []
    difficulty: str = "Beginner"
    skill: str = "Programming"

LESSON_PROMPT = """You are an expert programming tutor creating a structured lesson.

Topic: "{topic}"
Subtopics to cover: {subtopics}
Difficulty level: {difficulty}
Skill area: {skill}

Generate ONE lesson page for EACH subtopic listed above. Each page should deeply cover that single subtopic.

CRITICAL WRITING RULES:
- Write concept_explanation, real_world_example, and quick_check speaking DIRECTLY to the reader using "you" and "your".
- NEVER say "the student", "the learner", or use third-person language in any user-facing text field.
- Example: "You will learn how X works..." NOT "The student will learn..."
- common_mistakes should address the reader directly: "You might forget to..." NOT "Beginners often forget..."

Return ONLY valid JSON in this exact structure (no markdown, no extra text):
{{
  "topic_name": "{topic}",
  "pages": [
    {{
      "subtopic": "Subtopic name",
      "concept_explanation": "A clear explanation written directly to the reader using you/your (3-5 paragraphs). Use \\n\\n to separate paragraphs.",
      "key_points": [
        "Key point 1 — most important thing to remember",
        "Key point 2",
        "Key point 3",
        "Key point 4",
        "Key point 5"
      ],
      "real_world_example": "A practical, relatable example written directly to the reader. E.g. 'When you build a REST API, you will use this to...'",
      "code_example": {{
        "is_code": true,
        "language": "python",
        "snippet": "# Working code snippet here\\nprint('hello world')",
        "explanation": "Line-by-line explanation of what each part does."
      }},
      "common_mistakes": [
        "Mistake 1: written to the reader — e.g. 'You might forget to close the connection...'",
        "Mistake 2: another common mistake addressed to the reader",
        "Mistake 3: third common error addressed to the reader"
      ],
      "quick_check": "One simple comprehension question addressed to the reader. E.g. 'Can you explain what happens when you call X?'"
    }}
  ]
}}

Rules:
- Create exactly one page per subtopic
- For non-technical subtopics (theory, concepts, DevOps), set is_code=false and use a step-by-step process or diagram description in the snippet field
- Keep explanations beginner-friendly but thorough
- Make code examples complete and runnable
- quick_check must NOT be multiple-choice; it should be an open reflection question directed at the reader
"""

@router.post("/generate-lesson")
async def generate_lesson(req: LessonRequest, current_user=Depends(get_current_user), db=Depends(get_db)):
    # Check cache first
    cache_key = {
        "user_id": current_user["id"],
        "roadmap_id": req.roadmap_id,
        "topic_index": req.topic_index,
    }
    cached = await db.lessons.find_one(cache_key)
    if cached:
        cached["id"] = str(cached["_id"])
        cached.pop("_id", None)
        return cached

    try:
        client = get_groq()
        subtopics_str = ", ".join(req.subtopics) if req.subtopics else req.topic_name
        prompt = LESSON_PROMPT.format(
            topic=req.topic_name,
            subtopics=subtopics_str,
            difficulty=req.difficulty,
            skill=req.skill
        )
        resp = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
            max_tokens=6000
        )
        text = resp.choices[0].message.content.strip()
        text = re.sub(r'^```(?:json)?\s*', '', text)
        text = re.sub(r'\s*```$', '', text)
        lesson = json.loads(text)

        # Save to cache
        doc = {
            **cache_key,
            "topic_name": req.topic_name,
            "lesson": lesson,
            "created_at": datetime.utcnow(),
        }
        result = await db.lessons.insert_one(doc)
        return {**doc, "id": str(result.inserted_id), "_id": None}
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Lesson JSON parse failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lesson generation failed: {str(e)}")


# ── Generate Topic Quiz (for lesson flow, one-at-a-time) ──────────
class LessonQuizRequest(BaseModel):
    roadmap_id: str
    topic_index: int
    topic_name: str
    subtopics: List[str] = []
    difficulty: str = "Beginner"

LESSON_QUIZ_PROMPT = """Generate exactly 5 multiple choice questions that comprehensively test understanding of:

Topic: "{topic}"
All subtopics: {subtopics}
Difficulty: {difficulty}

Return ONLY a JSON array, no markdown, no extra text:
[
  {{
    "question": "Clear question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Why this answer is correct and the others are not."
  }}
]
Rules:
- correct is the 0-based index of the correct option
- Cover different subtopics across the 5 questions
- Make distractors plausible
- Test understanding, not just memorization"""

@router.post("/generate-lesson-quiz")
async def generate_lesson_quiz(req: LessonQuizRequest, current_user=Depends(get_current_user), db=Depends(get_db)):
    # Check cache
    cache_key = {
        "user_id": current_user["id"],
        "roadmap_id": req.roadmap_id,
        "topic_index": req.topic_index,
        "type": "lesson_quiz",
    }
    cached = await db.lesson_quizzes.find_one(cache_key)
    if cached:
        cached.pop("_id", None)
        return {"questions": cached["questions"]}

    try:
        client = get_groq()
        subtopics_str = ", ".join(req.subtopics) if req.subtopics else req.topic_name
        prompt = LESSON_QUIZ_PROMPT.format(
            topic=req.topic_name,
            subtopics=subtopics_str,
            difficulty=req.difficulty
        )
        resp = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7, max_tokens=2000
        )
        text = resp.choices[0].message.content.strip()
        text = re.sub(r'^```(?:json)?\s*', '', text)
        text = re.sub(r'\s*```$', '', text)
        questions = json.loads(text)

        # Cache it
        await db.lesson_quizzes.insert_one({**cache_key, "questions": questions, "created_at": datetime.utcnow()})
        return {"questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quiz generation failed: {str(e)}")
