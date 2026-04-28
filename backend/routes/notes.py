from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from auth_utils import get_current_user
from database import get_db
from bson import ObjectId
from datetime import datetime

router = APIRouter()

class NoteUpsert(BaseModel):
    roadmap_id: str
    topic_id: str
    content: str

@router.post("/")
async def save_note(req: NoteUpsert, current_user=Depends(get_current_user), db=Depends(get_db)):
    await db.notes.update_one(
        {"user_id": current_user["id"], "roadmap_id": req.roadmap_id, "topic_id": req.topic_id},
        {"$set": {"content": req.content, "updated_at": datetime.utcnow()}},
        upsert=True
    )
    return {"success": True}

@router.get("/{roadmap_id}/{topic_id}")
async def get_note(roadmap_id: str, topic_id: str, current_user=Depends(get_current_user), db=Depends(get_db)):
    note = await db.notes.find_one({"user_id": current_user["id"], "roadmap_id": roadmap_id, "topic_id": topic_id})
    if not note:
        return {"content": ""}
    return {"content": note.get("content", "")}