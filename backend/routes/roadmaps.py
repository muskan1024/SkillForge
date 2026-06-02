from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from bson import ObjectId
from models import RoadmapRequest, Topic, Resource
from auth_utils import get_current_user
from ai_service import generate_roadmap
from database import get_db
import uuid

router = APIRouter()

def serialize_roadmap(r: dict) -> dict:
    r["id"] = str(r["_id"])
    del r["_id"]
    return r

@router.post("/generate")
async def generate(req: RoadmapRequest, current_user=Depends(get_current_user), db=Depends(get_db)):
    try:
        goal = req.custom_goal if req.custom_goal else req.learning_goal
        ai_data = await generate_roadmap(
            skills=req.skills,
            skill_level=req.skill_level.value,
            learning_goal=goal,
            timeline=req.timeline
        )
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))

    topics = []
    for i, t in enumerate(ai_data.get("topics", [])):
        resources = [
            Resource(
                title=r.get("title", "Resource"),
                url=r.get("url", "#"),
                type=r.get("type", "docs"),
                is_free=r.get("is_free", True)
            ).model_dump()
            for r in t.get("resources", [])
        ]
        topic = {
            "id": t.get("id", f"topic_{i+1}"),
            "name": t.get("name", f"Topic {i+1}"),
            "description": t.get("description", ""),
            "subtopics": t.get("subtopics", []),
            "resources": resources,
            "estimated_hours": t.get("estimated_hours", 2),
            "week": t.get("week", 1),
            "day_range": t.get("day_range", f"Day {i*3+1}-{i*3+3}"),
            "difficulty": t.get("difficulty", "Beginner"),
            "completed": False,
            "completed_at": None,
        }
        topics.append(topic)

    roadmap_doc = {
        "user_id": current_user["id"],
        "title": ai_data.get("title", f"{', '.join(req.skills)} Learning Path"),
        "skills": req.skills,
        "skill_level": req.skill_level.value,
        "learning_goal": goal,
        "timeline": req.timeline,
        "topics": topics,
        "total_topics": len(topics),
        "completed_topics": 0,
        "progress_percent": 0.0,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "is_active": True,
        "current_topic_index": 0,
    }

    result = await db.roadmaps.insert_one(roadmap_doc)
    roadmap_doc["id"] = str(result.inserted_id)
    roadmap_doc.pop("_id", None)
    return roadmap_doc

@router.get("/")
async def list_roadmaps(current_user=Depends(get_current_user), db=Depends(get_db)):
    user_id = current_user["id"]
    print(f"[DEBUG] Fetching roadmaps for user_id: '{user_id}'")

    # Count total roadmaps in collection
    total_in_db = await db.roadmaps.count_documents({})
    print(f"[DEBUG] Total roadmaps in collection: {total_in_db}")

    # Sample one doc to see what user_id format is stored
    sample = await db.roadmaps.find_one({})
    if sample:
        print(f"[DEBUG] Sample roadmap user_id in DB: '{sample.get('user_id')}' (type: {type(sample.get('user_id')).__name__})")

    cursor = db.roadmaps.find({"user_id": user_id}).sort("created_at", -1)
    roadmaps = []
    async for r in cursor:
        roadmaps.append(serialize_roadmap(r))
    print(f"[DEBUG] Roadmaps found for this user: {len(roadmaps)}")
    return roadmaps

@router.get("/{roadmap_id}")
async def get_roadmap(roadmap_id: str, current_user=Depends(get_current_user), db=Depends(get_db)):
    try:
        r = await db.roadmaps.find_one({"_id": ObjectId(roadmap_id), "user_id": current_user["id"]})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid roadmap ID")
    if not r:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    return serialize_roadmap(r)

@router.delete("/{roadmap_id}")
async def delete_roadmap(roadmap_id: str, current_user=Depends(get_current_user), db=Depends(get_db)):
    try:
        result = await db.roadmaps.delete_one({"_id": ObjectId(roadmap_id), "user_id": current_user["id"]})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid roadmap ID")
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    return {"message": "Roadmap deleted"}
