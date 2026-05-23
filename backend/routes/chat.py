from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from auth_utils import get_current_user
from database import get_db, get_settings
from bson import ObjectId
from datetime import datetime
from groq import Groq

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []
    roadmap_id: Optional[str] = None
    session_id: Optional[str] = None

class NewSessionRequest(BaseModel):
    roadmap_id: Optional[str] = None
    title: Optional[str] = None

SYSTEM_PROMPT = """You are SkillForge AI, an expert learning assistant built into the SkillForge platform.
You help people learn programming, technology, and other technical skills.

Your personality:
- Friendly, encouraging, and patient — like a senior developer mentor talking directly to you
- Always speak in second person: use "you" and "your" throughout. NEVER say "the user", "the student", "the learner", or refer to the person in third person.
- Give clear, structured answers with examples when helpful
- Use simple language but don't avoid technical accuracy
- When explaining code, use proper formatting with markdown code blocks
- Suggest free resources (freeCodeCamp, MDN, official docs, YouTube) when relevant
- Keep answers focused and not overly long unless the question needs depth

Always be motivating — learning to code is hard, and you need encouragement to push through.
If you share your roadmap context, use it to give more personalized answers.
"""

def get_groq_client():
    settings = get_settings()
    return Groq(api_key=settings.groq_api_key)

@router.post("/session/new")
async def create_session(req: NewSessionRequest, current_user=Depends(get_current_user), db=Depends(get_db)):
    """Create a new chat session, optionally linked to a roadmap."""
    session = {
        "user_id": current_user["id"],
        "roadmap_id": req.roadmap_id or None,
        "title": req.title or "New Chat",
        "messages": [],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    # If roadmap linked, fetch its title for folder grouping
    if req.roadmap_id:
        try:
            roadmap = await db.roadmaps.find_one({"_id": ObjectId(req.roadmap_id), "user_id": current_user["id"]})
            if roadmap:
                session["roadmap_title"] = roadmap["title"]
                session["title"] = f"Chat about {roadmap['title'][:30]}"
        except Exception:
            pass

    result = await db.chat_sessions.insert_one(session)
    session["id"] = str(result.inserted_id)
    session.pop("_id", None)
    return session

@router.get("/sessions")
async def list_sessions(current_user=Depends(get_current_user), db=Depends(get_db)):
    """List all chat sessions for the user, grouped by roadmap."""
    cursor = db.chat_sessions.find({"user_id": current_user["id"]}).sort("updated_at", -1)
    sessions = []
    async for s in cursor:
        s["id"] = str(s["_id"])
        s.pop("_id", None)
        # Return only last message preview, not full history
        msgs = s.get("messages", [])
        s["message_count"] = len(msgs)
        s["last_message"] = msgs[-1]["content"][:60] + "…" if msgs else ""
        s.pop("messages", None)
        sessions.append(s)
    return sessions

@router.get("/session/{session_id}")
async def get_session(session_id: str, current_user=Depends(get_current_user), db=Depends(get_db)):
    """Get full messages of a session."""
    try:
        s = await db.chat_sessions.find_one({"_id": ObjectId(session_id), "user_id": current_user["id"]})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid session ID")
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
    s["id"] = str(s["_id"])
    s.pop("_id", None)
    return s

@router.delete("/session/{session_id}")
async def delete_session(session_id: str, current_user=Depends(get_current_user), db=Depends(get_db)):
    try:
        await db.chat_sessions.delete_one({"_id": ObjectId(session_id), "user_id": current_user["id"]})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid session ID")
    return {"message": "Session deleted"}

@router.post("/message")
async def chat(req: ChatRequest, current_user=Depends(get_current_user), db=Depends(get_db)):
    try:
        client = get_groq_client()

        user_message = req.message
        roadmap_title = None

        # Enrich with roadmap context
        if req.roadmap_id:
            try:
                roadmap = await db.roadmaps.find_one({"_id": ObjectId(req.roadmap_id), "user_id": current_user["id"]})
                if roadmap:
                    roadmap_title = roadmap["title"]
                    current_idx = roadmap.get("current_topic_index", 0)
                    topics = roadmap.get("topics", [])
                    current_topic = topics[current_idx]["name"] if topics else "Unknown"
                    completed = roadmap.get("completed_topics", 0)
                    total = roadmap.get("total_topics", 0)
                    user_message = (
                        f"[Context: I'm following the '{roadmap['title']}' roadmap. "
                        f"Currently on topic: '{current_topic}'. "
                        f"Progress: {completed}/{total} topics done.]\n\n{req.message}"
                    )
            except Exception:
                pass

        # Build messages for Groq
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        for msg in req.history[-12:]:
            messages.append({
                "role": "user" if msg.role == "user" else "assistant",
                "content": msg.content
            })
        messages.append({"role": "user", "content": user_message})

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
            max_tokens=2048,
        )
        reply = response.choices[0].message.content.strip()

        # Save to session if session_id provided
        if req.session_id:
            try:
                # Auto-title session from first user message
                session = await db.chat_sessions.find_one({"_id": ObjectId(req.session_id)})
                update_fields = {
                    "updated_at": datetime.utcnow(),
                }
                if session and session.get("title") in ["New Chat", f"Chat about {roadmap_title[:30] if roadmap_title else ''}"] and not session.get("messages"):
                    # Set title from first message
                    auto_title = req.message[:45] + ("…" if len(req.message) > 45 else "")
                    update_fields["title"] = auto_title

                await db.chat_sessions.update_one(
                    {"_id": ObjectId(req.session_id)},
                    {"$push": {
                        "messages": {"$each": [
                            {"role": "user", "content": req.message, "ts": datetime.utcnow()},
                            {"role": "assistant", "content": reply, "ts": datetime.utcnow()}
                        ]}
                    }, "$set": update_fields}
                )
            except Exception:
                pass

        return {"reply": reply}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

# Legacy endpoints kept for backward compatibility
@router.get("/history")
async def get_history(current_user=Depends(get_current_user), db=Depends(get_db)):
    return {"messages": []}

@router.delete("/history")
async def clear_history(current_user=Depends(get_current_user), db=Depends(get_db)):
    return {"message": "Use session-based API"}
