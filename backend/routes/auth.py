from fastapi import APIRouter, HTTPException, Depends, status
from datetime import datetime
from bson import ObjectId
from models import UserRegister, UserLogin, TokenResponse
from auth_utils import hash_password, verify_password, create_token
from database import get_db

router = APIRouter()

@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserRegister, db=Depends(get_db)):
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_doc = {
        "name": user_data.name,
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

    return TokenResponse(
        access_token=token,
        user={
            "id": user_id,
            "name": user_data.name,
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
