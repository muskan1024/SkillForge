from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any
from datetime import datetime
from enum import Enum

# Enums
class SkillLevel(str, Enum):
    beginner = "Beginner"
    intermediate = "Intermediate"
    advanced = "Advanced"

class Timeline(str, Enum):
    one_month = "1 Month"
    two_months = "2 Months"
    three_months = "3 Months"
    six_months = "6 Months"
    custom = "Custom"

# Auth Models
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

# Roadmap Generation Models
class RoadmapRequest(BaseModel):
    skills: List[str] = Field(..., min_length=1)
    skill_level: SkillLevel
    learning_goal: str
    timeline: str
    custom_goal: Optional[str] = None

class Resource(BaseModel):
    title: str
    url: str
    type: str  # youtube, docs, course, practice
    is_free: bool = True

class Topic(BaseModel):
    id: str
    name: str
    description: str
    subtopics: List[str]
    resources: List[Resource]
    estimated_hours: float
    week: int
    day_range: str
    difficulty: str
    completed: bool = False
    completed_at: Optional[datetime] = None

class Roadmap(BaseModel):
    id: Optional[str] = None
    user_id: str
    title: str
    skills: List[str]
    skill_level: str
    learning_goal: str
    timeline: str
    topics: List[Topic]
    total_topics: int
    completed_topics: int = 0
    progress_percent: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    current_topic_index: int = 0

# Progress Models
class TopicCompleteRequest(BaseModel):
    roadmap_id: str
    topic_id: str
    completed: bool

# User Profile
class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    created_at: datetime
    total_roadmaps: int = 0
    streak_days: int = 0
    last_active: Optional[datetime] = None
    xp_points: int = 0