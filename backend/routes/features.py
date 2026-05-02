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
    topic_name: str
    subtopics: List[str] = []
    difficulty: str = "Beginner"

@router.post("/study-notes")
async def generate_study_notes(req: NotesRequest, current_user=Depends(get_current_user)):
    try:
        client = get_groq()
        prompt = f"""Create comprehensive study notes for the topic: "{req.topic_name}"
Subtopics: {", ".join(req.subtopics)}
Level: {req.difficulty}

Format as structured markdown:
# {req.topic_name} - Study Notes
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
        return {"notes": resp.choices[0].message.content.strip()}
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
