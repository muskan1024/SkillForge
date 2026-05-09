from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from auth_utils import get_current_user
from database import get_db, get_settings
from bson import ObjectId
from datetime import datetime
from groq import Groq
import json, re

router = APIRouter()

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

The challenge MUST be directly related to "{current_topic}" so the learner can practice exactly what they are studying today.

Return ONLY valid JSON (no markdown):
{{
  "title": "Short challenge title related to {current_topic}",
  "difficulty": "Easy",
  "category": "{current_topic}",
  "description": "2-sentence description of what this challenge covers and why it matters for {current_topic}",
  "task": "The specific hands-on task the learner should complete today (be concrete and actionable)",
  "hints": ["specific hint 1 related to {current_topic}", "specific hint 2", "specific hint 3"],
  "example_input": "concrete example input if coding task, else empty string",
  "example_output": "expected output if coding task, else empty string",
  "learning_objective": "What the learner will understand after completing this challenge",
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
        {"id": "first_roadmap",   "name": "Pathfinder",        "icon": "🗺️", "desc": "Created your first roadmap"},
        {"id": "first_complete",  "name": "Topic Master",       "icon": "✅", "desc": "Completed your first topic"},
        {"id": "ten_topics",      "name": "Dedicated Learner",  "icon": "📚", "desc": "Completed 10 topics"},
        {"id": "fifty_topics",    "name": "Knowledge Seeker",   "icon": "🔥", "desc": "Completed 50 topics"},
        {"id": "roadmap_complete","name": "Roadmap Champion",   "icon": "🏆", "desc": "Finished a complete roadmap"},
        {"id": "streak_7",        "name": "Week Warrior",       "icon": "⚡", "desc": "7-day learning streak"},
        {"id": "streak_30",       "name": "Monthly Master",     "icon": "🌟", "desc": "30-day learning streak"},
        {"id": "xp_100",          "name": "XP Hunter",          "icon": "💎", "desc": "Earned 100 XP points"},
        {"id": "multi_skill",     "name": "Polymath",           "icon": "🧠", "desc": "Learning 3+ different skills"},
        {"id": "quiz_ace",        "name": "Quiz Ace",           "icon": "🎯", "desc": "Scored 100% on any quiz"},
        {"id": "speed_learner",   "name": "Speed Learner",      "icon": "🚀", "desc": "Completed 5 topics in one day"},
    ]
    earned_ids = {b["id"] for b in earned}
    return {
        "earned": earned,
        "all": [{**b, "earned": b["id"] in earned_ids} for b in all_badges]
    }

# # ── Daily Challenge Submit ────────────────────────────────────────
# class ChallengeSubmitRequest(BaseModel):
#     challenge_id: str
#     answer: str
#     task: str
#     title: str
#     category: Optional[str] = None

# @router.post("/daily-challenge/submit")
# async def submit_daily_challenge(req: ChallengeSubmitRequest, current_user=Depends(get_current_user), db=Depends(get_db)):
#     try:
#         # Idempotency: check if already submitted
#         existing = await db.daily_challenges.find_one({"_id": ObjectId(req.challenge_id), "user_id": current_user["id"]})
#         already_submitted = existing.get("submitted", False) if existing else False

#         client = get_groq()
#         prompt = f"""You are an expert programming tutor evaluating a learner's answer to a daily challenge.

# Challenge Title: {req.title}
# Category: {req.category or "Programming"}
# Task: {req.task}

# Learner's Answer:
# {req.answer}

# Evaluate whether the learner has correctly understood and answered the challenge. Be encouraging and constructive.

# Return ONLY valid JSON:
# {{
#   "correct": true or false,
#   "score": <integer 0-100>,
#   "feedback": "2-3 sentences of specific, constructive feedback on their answer",
#   "strengths": ["what they got right"],
#   "improvements": ["what could be better or what was missing"],
#   "xp_awarded": <20 if correct else 0>
# }}

# Be generous: if the answer shows good understanding (score >= 60), mark it as correct."""

#         resp = client.chat.completions.create(
#             model="llama-3.3-70b-versatile",
#             messages=[{"role": "user", "content": prompt}],
#             temperature=0.3, max_tokens=600
#         )
#         text = re.sub(r'^```(?:json)?\s*', '', resp.choices[0].message.content.strip())
#         text = re.sub(r'\s*```$', '', text)
#         result = json.loads(text)

#         # Award XP only if correct and not already submitted
#         xp_awarded = 0
#         if result.get("correct") and not already_submitted:
#             xp_awarded = 20
#             await db.users.update_one(
#                 {"_id": ObjectId(current_user["id"])},
#                 {"$inc": {"xp_points": xp_awarded}, "$set": {"last_active": datetime.utcnow()}}
#             )

#         # Always persist the answer + review so the UI can restore on refresh
#         try:
#             update_fields = {
#                 "submitted_answer": req.answer,
#                 "review_result": result,
#                 "submitted_at": datetime.utcnow(),
#             }
#             if result.get("correct") and not already_submitted:
#                 update_fields["submitted"] = True  # lock XP gate only on first correct

#             await db.daily_challenges.update_one(
#                 {"_id": ObjectId(req.challenge_id)},
#                 {"$set": update_fields}
#             )
#         except Exception:
#             pass

#         result["xp_awarded"] = xp_awarded
#         result["already_submitted"] = already_submitted
#         return result
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Answer evaluation failed: {str(e)}")


# ── Daily Challenge Answer Review ────────────────────────────────
class ChallengeAnswerRequest(BaseModel):
    challenge_id: str
    challenge_title: str
    task: str
    answer: str
    skill: str
    difficulty: str

@router.post("/daily-challenge/review")
async def review_challenge_answer(req: ChallengeAnswerRequest, current_user=Depends(get_current_user), db=Depends(get_db)):
    try:
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

        # Award XP if passed
        xp = result.get("xp_awarded", 0)
        if xp > 0:
            await db.users.update_one(
                {"_id": ObjectId(current_user["id"])},
                {"$inc": {"xp_points": xp}, "$set": {"last_active": datetime.utcnow()}}
            )
            # Mark challenge as answered
            try:
                await db.daily_challenges.update_one(
                    {"_id": ObjectId(req.challenge_id)},
                    {"$set": {"answered": True, "xp_awarded": xp, "answered_at": datetime.utcnow()}}
                )
            except Exception:
                pass

        result["xp_awarded"] = xp
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Review failed: {str(e)}")

# ── Code Review ───────────────────────────────────────────────────
class CodeReviewRequest(BaseModel):
    code: str
    language: str
    context: Optional[str] = None

@router.post("/code-review")
async def review_code(req: CodeReviewRequest, current_user=Depends(get_current_user)):
    try:
        client = get_groq()
        prompt = f"""You are an expert code reviewer. Review this {req.language} code:

```{req.language}
{req.code}
```
{f"Context: {req.context}" if req.context else ""}

Provide structured review:
## Overall Assessment
## ✅ What's Good
## ⚠️ Issues Found
## 🔧 Improved Code (show corrected version)
## 📚 Best Practices to Remember
## Score: X/10

Be constructive and educational."""
        resp = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4, max_tokens=2000
        )
        return {"review": resp.choices[0].message.content.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code review failed: {str(e)}")

# ── Interview Prep ────────────────────────────────────────────────
class InterviewRequest(BaseModel):
    skill: str
    level: str = "Beginner"
    question_type: str = "technical"

class InterviewAnswer(BaseModel):
    question: str
    answer: str
    skill: str
    level: str 

@router.post("/interview/question")
async def get_interview_question(req: InterviewRequest, current_user=Depends(get_current_user)):
    try:
        client = get_groq()
        prompt = f"""Generate ONE {req.question_type} interview question for a {req.level} {req.skill} developer.

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
async def evaluate_answer(req: InterviewAnswer, current_user=Depends(get_current_user)):
    try:
        client = get_groq()
        prompt = f"""You are a senior {req.skill} interviewer evaluating a {req.level} candidate.

Question: {req.question}
Answer: {req.answer}

Return ONLY valid JSON:
{{
  "score": 7,
  "verdict": "Good",
  "strengths": ["strength 1", "strength 2"],
  "gaps": ["gap 1", "gap 2"],
  "ideal_answer_points": ["key point 1", "key point 2", "key point 3"],
  "feedback": "2-3 sentence encouraging overall feedback",
  "tip": "One specific improvement tip"
}}"""
        resp = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4, max_tokens=700
        )
        text = re.sub(r'^```(?:json)?\s*', '', resp.choices[0].message.content.strip())
        text = re.sub(r'\s*```$', '', text)
        return json.loads(text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")


# ── Generate Lesson (with MongoDB caching) ────────────────────────
class LessonRequest(BaseModel):
    roadmap_id: str
    topic_index: int
    topic_name: str
    subtopics: List[str] = []
    difficulty: str = "Beginner"
    skill: str = "Programming"

LESSON_PROMPT = """You are an expert programming tutor creating a structured lesson for a student.

Topic: "{topic}"
Subtopics to cover: {subtopics}
Difficulty level: {difficulty}
Skill area: {skill}

Generate ONE lesson page for EACH subtopic listed above. Each page should deeply cover that single subtopic.

Return ONLY valid JSON in this exact structure (no markdown, no extra text):
{{
  "topic_name": "{topic}",
  "pages": [
    {{
      "subtopic": "Subtopic name",
      "concept_explanation": "A clear, beginner-friendly explanation (3-5 paragraphs). Use \\n\\n to separate paragraphs.",
      "key_points": [
        "Key point 1 — most important thing to remember",
        "Key point 2",
        "Key point 3",
        "Key point 4",
        "Key point 5"
      ],
      "real_world_example": "A practical, relatable example of how this is used in real industry projects (2-3 sentences).",
      "code_example": {{
        "is_code": true,
        "language": "python",
        "snippet": "# Working code snippet here\\nprint('hello world')",
        "explanation": "Line-by-line explanation of what each part does."
      }},
      "common_mistakes": [
        "Mistake 1: description of what beginners commonly do wrong",
        "Mistake 2: another common mistake",
        "Mistake 3: third common error"
      ],
      "quick_check": "One simple comprehension question the student should be able to answer after reading this page."
    }}
  ]
}}

Rules:
- Create exactly one page per subtopic
- For non-technical subtopics (theory, concepts, DevOps), set is_code=false and use a step-by-step process or diagram description in the snippet field
- Keep explanations beginner-friendly but thorough
- Make code examples complete and runnable
- quick_check should be a simple factual question, NOT a multiple-choice quiz
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
