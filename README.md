# SkillForge — AI-Driven Personalized Learning Path Generator

An MCA major project: full-stack web app that generates structured, week-by-week learning roadmaps using Google Gemini AI.

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Tailwind CSS, Vite            |
| Backend    | Python FastAPI + Uvicorn                |
| Database   | MongoDB (Motor async driver)            |

---

## Algorithms Used

| Algorithm | Where Used |
|-----------|-----------|
| Prompt Engineering | ai_service.py — structured JSON prompt to Gemini |
| Content-Based Filtering | Gemini matches resources to skill/level |
| Prerequisite Ordering | Gemini orders topics by difficulty progression |
| Progress Analytics | progress_percent = completed/total × 100 |
| Streak Calculation | auth.py — date diff logic for consecutive login days |
| JWT (HS256) | auth_utils.py — stateless session management |
| bcrypt | auth_utils.py — password hashing with salt rounds |

---
DELETE /api/roadmaps/{id}          Delete roadmap

POST   /api/progress/topic         Mark topic complete/incomplete

GET    /api/dashboard/             Full dashboard data
```
