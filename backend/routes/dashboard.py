from fastapi import APIRouter, Depends
from bson import ObjectId
from auth_utils import get_current_user
from database import get_db

router = APIRouter()

@router.get("/")
async def get_dashboard(current_user=Depends(get_current_user), db=Depends(get_db)):
    user_id = current_user["id"]

    # Get all roadmaps
    roadmaps = []
    cursor = db.roadmaps.find({"user_id": user_id}).sort("updated_at", -1)
    async for r in cursor:
        r["id"] = str(r["_id"])
        del r["_id"]
        roadmaps.append(r)

    active_roadmap = None
    for r in roadmaps:
        if r.get("progress_percent", 0) < 100:
            active_roadmap = r
            break

    # Streak dates for heatmap (last 30 days)
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    # Return full year of streak dates for GitHub-style graph
    streak_dates = user.get("streak_dates", [])

    total_completed_topics = sum(r.get("completed_topics", 0) for r in roadmaps)
    total_topics = sum(r.get("total_topics", 0) for r in roadmaps)

    return {
        "user": {
            "id": user_id,
            "name": current_user["name"],
            "email": current_user["email"],
            "streak_days": user.get("streak_days", 0),
            "xp_points": user.get("xp_points", 0),
            "member_since": user.get("created_at"),
        },
        "stats": {
            "total_roadmaps": len(roadmaps),
            "completed_roadmaps": sum(1 for r in roadmaps if r.get("progress_percent", 0) >= 100),
            "total_topics_completed": total_completed_topics,
            "total_topics": total_topics,
            "overall_progress": round((total_completed_topics / total_topics * 100), 1) if total_topics > 0 else 0,
        },
        "active_roadmap": active_roadmap,
        "all_roadmaps": roadmaps,
        "streak_dates": streak_dates,
    }
