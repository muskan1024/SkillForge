from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    mongodb_url: str = "mongodb://localhost:27017"
    db_name: str = "skillforge"
    jwt_secret: str = "change-this-secret"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 10080
    gemini_api_key: str = ""
    groq_api_key: str = ""
    jdoodle_client_id: str = ""
    jdoodle_client_secret: str = ""
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str = "shaikhmuskan1024@gmail.com"
    smtp_password: str = "kogfgdwysrttsbsf"
    smtp_from: str = "SkillForge <noreply@skillforge.com>"

    class Config:
        env_file = ".env"
        extra = "ignore"

@lru_cache()
def get_settings():
    return Settings()

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_db():
    settings = get_settings()
    db_instance.client = AsyncIOMotorClient(settings.mongodb_url)
    db_instance.db = db_instance.client[settings.db_name]
    print(f"Connected to MongoDB: {settings.db_name}")

    # TTL index: auto-delete daily_challenge docs after 5 days (432000 seconds)
    await db_instance.db.daily_challenges.create_index(
        "created_at",
        expireAfterSeconds=432000,
        name="daily_challenges_ttl_5d"
    )
    print("TTL index ensured on daily_challenges (5 days)")


async def close_db():
    if db_instance.client:
        db_instance.client.close()
        print("MongoDB connection closed")

def get_db():
    return db_instance.db
