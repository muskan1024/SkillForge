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

# ── Study Notes ─────────────────────────────────────────────────
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

Format as structured markdown with:
# {req.topic_name} - Study Notes
## Key Concepts
## Detailed Explanations (with examples)
## Code Examples (if applicable)
## Common Mistakes to Avoid
## Quick Summary / Cheat Sheet
## Practice Questions

Make it comprehensive but concise. Use bullet points, code blocks, and clear headings."""
        resp = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.6, max_tokens=3000
        )
        return {"notes": resp.choices[0].message.content.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Notes generation failed: {str(e)}")

# ── Daily Challenge ──────────────────────────────────────────────
@router.get("/daily-challenge")
async def get_daily_challenge(current_user=Depends(get_current_user), db=Depends(get_db)):
    today = datetime.utcnow().date().isoformat()
    existing = await db.daily_challenges.find_one({"user_id": current_user["id"], "date": today})
    if existing:
        existing["id"] = str(existing["_id"]); existing.pop("_id", None)
        return existing

    # Get user's active roadmap skills for context
    roadmaps = [r async for r in db.roadmaps.find({"user_id": current_user["id"]}).sort("updated_at", -1).limit(1)]
    skill_context = roadmaps[0]["skills"][0] if roadmaps and roadmaps[0].get("skills") else "Programming"
    current_idx = roadmaps[0].get("current_topic_index", 0) if roadmaps else 0
    topics = roadmaps[0].get("topics", []) if roadmaps else []
    current_topic = topics[current_idx]["name"] if topics else skill_context

    try:
        client = get_groq()
        prompt = f"""Generate a daily coding/learning challenge for someone learning {current_topic} ({skill_context}).

Return ONLY valid JSON:
{{
  "title": "Challenge title",
  "difficulty": "Easy|Medium|Hard",
  "category": "topic category",
  "description": "Clear problem description in 2-3 sentences",
  "task": "Specific task the learner should do",
  "hints": ["hint 1", "hint 2", "hint 3"],
  "example_input": "example if applicable, else empty string",
  "example_output": "expected output if applicable, else empty string",
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
        challenge.update({"user_id": current_user["id"], "date": today,
                          "completed": False, "created_at": datetime.utcnow()})
        result = await db.daily_challenges.insert_one(challenge)
        challenge["id"] = str(result.inserted_id); challenge.pop("_id", None)
        return challenge
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Challenge generation failed: {str(e)}")

@router.post("/daily-challenge/{challenge_id}/complete")
async def complete_challenge(challenge_id: str, current_user=Depends(get_current_user), db=Depends(get_db)):
    try:
        await db.daily_challenges.update_one(
            {"_id": ObjectId(challenge_id), "user_id": current_user["id"]},
            {"$set": {"completed": True, "completed_at": datetime.utcnow()}}
        )
        await db.users.update_one({"_id": ObjectId(current_user["id"])}, {"$inc": {"xp_points": 20}})
        return {"success": True, "xp_gained": 20}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ── Badges ───────────────────────────────────────────────────────
@router.get("/badges")
async def get_badges(current_user=Depends(get_current_user), db=Depends(get_db)):
    user = await db.users.find_one({"_id": ObjectId(current_user["id"])})
    earned = user.get("badges", [])
    all_badges = [
        {"id": "first_roadmap", "name": "Pathfinder", "icon": "🗺️", "desc": "Created your first roadmap"},
        {"id": "first_complete", "name": "Topic Master", "icon": "✅", "desc": "Completed your first topic"},
        {"id": "ten_topics", "name": "Dedicated Learner", "icon": "📚", "desc": "Completed 10 topics"},
        {"id": "fifty_topics", "name": "Knowledge Seeker", "icon": "🔥", "desc": "Completed 50 topics"},
        {"id": "roadmap_complete", "name": "Roadmap Champion", "icon": "🏆", "desc": "Finished a complete roadmap"},
        {"id": "streak_7", "name": "Week Warrior", "icon": "⚡", "desc": "7-day learning streak"},
        {"id": "streak_30", "name": "Monthly Master", "icon": "🌟", "desc": "30-day learning streak"},
        {"id": "xp_100", "name": "XP Hunter", "icon": "💎", "desc": "Earned 100 XP points"},
        {"id": "multi_skill", "name": "Polymath", "icon": "🧠", "desc": "Learning 3+ different skills"},
    ]
    earned_ids = {b["id"] for b in earned}
    return {"earned": earned, "all": [{**b, "earned": b["id"] in earned_ids} for b in all_badges]}

# ── Code Review ──────────────────────────────────────────────────
class CodeReviewRequest(BaseModel):
    code: str
    language: str
    context: Optional[str] = None

@router.post("/code-review")
async def review_code(req: CodeReviewRequest, current_user=Depends(get_current_user)):
    try:
        client = get_groq()
        prompt = f"""You are an expert code reviewer. Review the following {req.language} code:

```{req.language}
{req.code}
```
{f"Context: {req.context}" if req.context else ""}

Provide a structured review with:
## Overall Assessment
## ✅ What's Good
## ⚠️ Issues Found (with line references if possible)
## 🔧 Suggested Improvements (with corrected code snippets)
## 📚 Best Practices to Remember
## Score: X/10

Be constructive, educational, and encouraging. Focus on helping the learner improve."""
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
    question_type: str = "technical"  # technical, behavioral, coding

class InterviewAnswer(BaseModel):
    question: str
    answer: str
    skill: str
    level: str

@router.post("/interview/question")
async def get_interview_question(req: InterviewRequest, current_user=Depends(get_current_user)):
    try:
        client = get_groq()
        prompt = f"""Generate ONE {req.question_type} interview question for a {req.level} {req.skill} developer position.

Return ONLY valid JSON:
{{
  "question": "The interview question",
  "type": "{req.question_type}",
  "difficulty": "{req.level}",
  "what_interviewer_looks_for": "What a good answer should include (2-3 points)",
  "follow_up": "A likely follow-up question"
}}"""
        resp = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.9, max_tokens=600
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
        prompt = f"""You are a senior {req.skill} interviewer evaluating a {req.level} candidate's answer.

Question: {req.question}
Candidate's Answer: {req.answer}

Evaluate and return JSON:
{{
  "score": 7,
  "verdict": "Good|Excellent|Needs Improvement|Poor",
  "strengths": ["strength 1", "strength 2"],
  "gaps": ["gap 1", "gap 2"],
  "ideal_answer_points": ["key point 1", "key point 2", "key point 3"],
  "feedback": "Encouraging 2-3 sentence overall feedback",
  "tip": "One specific tip to improve this type of answer"
}}"""
        resp = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4, max_tokens=800
        )
        text = re.sub(r'^```(?:json)?\s*', '', resp.choices[0].message.content.strip())
        text = re.sub(r'\s*```$', '', text)
        return json.loads(text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")