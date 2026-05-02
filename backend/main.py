from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import connect_db, close_db
from routes import auth, roadmaps, progress, dashboard, chat, quiz, features, notes

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()

app = FastAPI(title="SkillForge API", version="2.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

app.include_router(auth.router,      prefix="/api/auth",      tags=["Auth"])
app.include_router(roadmaps.router,  prefix="/api/roadmaps",  tags=["Roadmaps"])
app.include_router(progress.router,  prefix="/api/progress",  tags=["Progress"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(chat.router,      prefix="/api/chat",      tags=["Chat"])
app.include_router(quiz.router,      prefix="/api/quiz",      tags=["Quiz"])
app.include_router(features.router,  prefix="/api/features",  tags=["Features"])
app.include_router(notes.router,     prefix="/api/notes",     tags=["Notes"])

@app.get("/")
async def root(): return {"message": "SkillForge API v2.0"}
