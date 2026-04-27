from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from bson import ObjectId
from models import TopicCompleteRequest
from auth_utils import get_current_user
from database import get_db

router = APIRouter()

@router.post("/topic")
async def mark_topic(req: TopicCompleteRequest, current_user=Depends(get_current_user), db=Depends(get_db)):
    try:
        roadmap = await db.roadmaps.find_one(
            {"_id": ObjectId(req.roadmap_id), "user_id": current_user["id"]}
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid roadmap ID")

    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")

    topics = roadmap.get("topics", [])
    topic_found = False
    current_index = 0

    for i, topic in enumerate(topics):
        if topic["id"] == req.topic_id:
            topic_found = True
            topics[i]["completed"] = req.completed
            topics[i]["completed_at"] = datetime.utcnow() if req.completed else None
        if not topics[i]["completed"]:
            current_index = i
            break

    if not topic_found:
        raise HTTPException(status_code=404, detail="Topic not found")

    completed_count = sum(1 for t in topics if t["completed"])
    total = len(topics)
    progress = round((completed_count / total) * 100, 1) if total > 0 else 0

    # Find current topic index (first uncompleted)
    current_topic_index = 0
    for i, t in enumerate(topics):
        if not t["completed"]:
            current_topic_index = i
            break
    else:
        current_topic_index = total - 1

    # Award XP if completing
    xp_gain = 10 if req.completed else -10
    await db.users.update_one(
        {"_id": ObjectId(current_user["id"])},
        {"$inc": {"xp_points": max(0, xp_gain)}, "$set": {"last_active": datetime.utcnow()}}
    )

    await db.roadmaps.update_one(
        {"_id": ObjectId(req.roadmap_id)},
        {"$set": {
            "topics": topics,
            "completed_topics": completed_count,
            "progress_percent": progress,
            "current_topic_index": current_topic_index,
            "updated_at": datetime.utcnow(),
        }}
    )

    return {
        "success": True,
        "completed_topics": completed_count,
        "total_topics": total,
        "progress_percent": progress,
        "current_topic_index": current_topic_index,
    }
