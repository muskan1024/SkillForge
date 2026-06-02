from fastapi import APIRouter, HTTPException, Depends, status, BackgroundTasks
from datetime import datetime
from bson import ObjectId
from models import UserRegister, UserLogin, TokenResponse
from auth_utils import hash_password, verify_password, create_token
from database import get_db
from pydantic import BaseModel, EmailStr

router = APIRouter()

@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserRegister, background_tasks: BackgroundTasks, db=Depends(get_db)):
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Resolve display name
    first = (user_data.first_name or "").strip()
    last  = (user_data.last_name  or "").strip()
    full_name = user_data.name.strip() if user_data.name else f"{first} {last}".strip() or "User"

    user_doc = {
        "first_name": first,
        "last_name":  last,
        "name": full_name,
        "email": user_data.email,
        "password": hash_password(user_data.password),
        "created_at": datetime.utcnow(),
        "streak_days": 0,
        "last_active": datetime.utcnow(),
        "xp_points": 0,
        "streak_dates": [],
    }
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    token = create_token({"sub": user_id})

    # Trigger welcome email asynchronously in background thread
    try:
        from email_service import send_welcome_email
        background_tasks.add_task(send_welcome_email, user_data.email, user_data.name)
    except Exception as e:
        print(f"[EMAIL SERVICE WARNING] Failed to add background welcome email task: {e}")

    return TokenResponse(
        access_token=token,
        user={
            "id": user_id,
            "name": full_name,
            "email": user_data.email,
            "streak_days": 0,
            "xp_points": 0,
        }
    )

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db=Depends(get_db)):
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user_id = str(user["_id"])

    # Update streak logic
    today = datetime.utcnow().date()
    last_active = user.get("last_active")
    streak = user.get("streak_days", 0)
    streak_dates = user.get("streak_dates", [])

    if last_active:
        last_date = last_active.date() if isinstance(last_active, datetime) else last_active
        if (today - last_date).days == 1:
            streak += 1
        elif (today - last_date).days > 1:
            streak = 1
        # same day: no change
    else:
        streak = 1

    today_str = today.isoformat()
    if today_str not in streak_dates:
        streak_dates.append(today_str)

    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_active": datetime.utcnow(), "streak_days": streak, "streak_dates": streak_dates}}
    )

    token = create_token({"sub": user_id})
    return TokenResponse(
        access_token=token,
        user={
            "id": user_id,
            "name": user["name"],
            "email": user["email"],
            "streak_days": streak,
            "xp_points": user.get("xp_points", 0),
        }
    )

@router.get("/me")
async def get_me(db=Depends(get_db), current_user=Depends(__import__('auth_utils').get_current_user)):
    return {
        "id": current_user["id"],
        "name": current_user["name"],
        "email": current_user["email"],
        "streak_days": current_user.get("streak_days", 0),
        "xp_points": current_user.get("xp_points", 0),
        "created_at": current_user.get("created_at"),
    }

class SubscribeRequest(BaseModel):
    email: EmailStr

@router.post("/subscribe")
async def subscribe(req: SubscribeRequest, background_tasks: BackgroundTasks, db=Depends(get_db)):
    try:
        await db.subscribers.update_one(
            {"email": req.email},
            {"$set": {"subscribed_at": datetime.utcnow()}},
            upsert=True
        )
        
        # Trigger pre-launch list confirmation email asynchronously in background thread
        try:
            from email_service import send_subscription_email
            background_tasks.add_task(send_subscription_email, req.email)
        except Exception as e:
            print(f"[EMAIL SERVICE WARNING] Failed to add background pre-launch email task: {e}")
            
        return {"status": "success", "message": "Successfully subscribed to pricing notifications."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Subscription failed: {str(e)}")
