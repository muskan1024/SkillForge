from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from auth_utils import get_current_user
from database import get_db, get_settings
from bson import ObjectId
from datetime import datetime
from groq import Groq
import json, re

router = APIRouter()

class QuizRequest(BaseModel):
    roadmap_id: str
    topic_id: str
    topic_name: str
    subtopics: List[str] = []
    difficulty: str = "Beginner"

class QuizSubmit(BaseModel):
    roadmap_id: str
    topic_id: str
    answers: List[int]
    questions: List[dict]

def get_groq():
    return Groq(api_key=get_settings().groq_api_key)

QUIZ_PROMPT = """Generate exactly 5 multiple choice questions for the topic: "{topic}"
Subtopics covered: {subtopics}
Difficulty level: {difficulty}

Return ONLY a JSON array, no markdown, no explanation:
[
  {{
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Brief explanation of why this answer is correct"
  }}
]
Rules:
- correct is the index (0-3) of the correct option
- Questions must test understanding, not just memorization
- Make distractors plausible but clearly wrong
- Keep questions concise and clear"""

@router.post("/generate")
async def generate_quiz(req: QuizRequest, current_user=Depends(get_current_user)):
    try:
        client = get_groq()
        prompt = QUIZ_PROMPT.format(
            topic=req.topic_name,
            subtopics=", ".join(req.subtopics) if req.subtopics else req.topic_name,
            difficulty=req.difficulty
        )
        resp = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7, max_tokens=1500
        )
        text = resp.choices[0].message.content.strip()
        text = re.sub(r'^```(?:json)?\s*', '', text)
        text = re.sub(r'\s*```$', '', text)
        questions = json.loads(text)
        return {"questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quiz generation failed: {str(e)}")

@router.post("/submit")
async def submit_quiz(req: QuizSubmit, current_user=Depends(get_current_user), db=Depends(get_db)):
    correct = sum(1 for i, q in enumerate(req.questions) if i < len(req.answers) and req.answers[i] == q.get("correct"))
    total = len(req.questions)
    score = round((correct / total) * 100)
    passed = score >= 60

    result = {
        "score": score, "correct": correct, "total": total,
        "passed": passed, "answers": req.answers,
        "questions": req.questions, "submitted_at": datetime.utcnow()
    }

    if passed:
        # Auto-complete the topic
        try:
            roadmap = await db.roadmaps.find_one({"_id": ObjectId(req.roadmap_id), "user_id": current_user["id"]})
            if roadmap:
                topics = roadmap.get("topics", [])
                for i, t in enumerate(topics):
                    if t["id"] == req.topic_id:
                        topics[i]["completed"] = True
                        topics[i]["completed_at"] = datetime.utcnow()
                        topics[i]["quiz_score"] = score
                        break
                completed_count = sum(1 for t in topics if t["completed"])
                total_topics = len(topics)
                progress = round((completed_count / total_topics) * 100, 1) if total_topics > 0 else 0
                current_topic_index = next((i for i, t in enumerate(topics) if not t["completed"]), total_topics - 1)
                await db.roadmaps.update_one(
                    {"_id": ObjectId(req.roadmap_id)},
                    {"$set": {"topics": topics, "completed_topics": completed_count,
                              "progress_percent": progress, "current_topic_index": current_topic_index,
                              "updated_at": datetime.utcnow()}}
                )
                await db.users.update_one(
                    {"_id": ObjectId(current_user["id"])},
                    {"$inc": {"xp_points": 15}, "$set": {"last_active": datetime.utcnow()}}
                )
                result["completed_topics"] = completed_count
                result["progress_percent"] = progress
                result["current_topic_index"] = current_topic_index
        except Exception as e:
            pass

    # Check and award badges
    await check_and_award_badges(current_user["id"], db)
    return result

async def check_and_award_badges(user_id: str, db):
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        roadmaps_cursor = db.roadmaps.find({"user_id": user_id})
        roadmaps = [r async for r in roadmaps_cursor]
        existing_badges = [b["id"] for b in user.get("badges", [])]
        new_badges = []
        total_completed = sum(r.get("completed_topics", 0) for r in roadmaps)
        total_roadmaps = len(roadmaps)
        completed_roadmaps = sum(1 for r in roadmaps if r.get("progress_percent", 0) >= 100)
        streak = user.get("streak_days", 0)
        xp = user.get("xp_points", 0)

        total_interviews = await db.interview_history.count_documents({"user_id": user_id})

        badge_rules = [
            {"id": "first_roadmap", "name": "Pathfinder", "icon": "Map", "desc": "Created your first roadmap", "condition": total_roadmaps >= 1},
            {"id": "first_complete", "name": "Topic Master", "icon": "CheckCircle", "desc": "Completed your first topic", "condition": total_completed >= 1},
            {"id": "ten_topics", "name": "Dedicated Learner", "icon": "BookOpen", "desc": "Completed 10 topics", "condition": total_completed >= 10},
            {"id": "fifty_topics", "name": "Knowledge Seeker", "icon": "Flame", "desc": "Completed 50 topics", "condition": total_completed >= 50},
            {"id": "roadmap_complete", "name": "Roadmap Champion", "icon": "Trophy", "desc": "Finished a complete roadmap", "condition": completed_roadmaps >= 1},
            {"id": "streak_3", "name": "Consistent", "icon": "CalendarClock", "desc": "3-day learning streak", "condition": streak >= 3},
            {"id": "streak_7", "name": "Week Warrior", "icon": "Zap", "desc": "7-day learning streak", "condition": streak >= 7},
            {"id": "streak_30", "name": "Monthly Master", "icon": "Star", "desc": "30-day learning streak", "condition": streak >= 30},
            {"id": "xp_100", "name": "XP Hunter", "icon": "Gem", "desc": "Earned 100 XP points", "condition": xp >= 100},
            {"id": "xp_500", "name": "XP Collector", "icon": "Crown", "desc": "Earned 500 XP points", "condition": xp >= 500},
            {"id": "xp_1000", "name": "XP Legend", "icon": "Diamond", "desc": "Earned 1000 XP points", "condition": xp >= 1000},
            {"id": "multi_skill", "name": "Polymath", "icon": "Brain", "desc": "Learning 3+ different skills", "condition": total_roadmaps >= 3},
            {"id": "interview_ready", "name": "Interview Ready", "icon": "Mic", "desc": "Completed first interview practice", "condition": total_interviews >= 1},
            {"id": "interview_pro", "name": "Interview Pro", "icon": "MessagesSquare", "desc": "Completed 5 interview practices", "condition": total_interviews >= 5},
        ]

        for badge in badge_rules:
            if badge["condition"] and badge["id"] not in existing_badges:
                new_badges.append({"id": badge["id"], "name": badge["name"], "icon": badge["icon"],
                                   "desc": badge["desc"], "earned_at": datetime.utcnow()})

        if new_badges:
            await db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$push": {"badges": {"$each": new_badges}}}
            )
        return new_badges
    except Exception:
        return []
