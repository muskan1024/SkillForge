# SkillForge — Skill Development Platform

An MCA major project: full-stack web app that generates structured, week-by-week learning roadmaps using Google Gemini AI.

---

## Tech Stack

| Layer    | Technology                           |
| -------- | ------------------------------------ |
| Frontend | React 18, Tailwind CSS, Vite         |
| Backend  | Python FastAPI + Uvicorn             |
| Database | MongoDB (Motor async driver)         |
| AI       | Google Gemini 1.5 Flash (free tier)  |
| Auth     | JWT tokens + bcrypt password hashing |

---

## Key Features

- **5-step onboarding form** — skills, level, goal, timeline, then AI generates
- **AI roadmap generation** — Gemini 1.5 Flash creates 8–16 structured topics
- **"You are here" indicator** — highlights current topic in the roadmap
- **Topic completion** — check off topics, earn +10 XP per topic
- **Progress tracking** — visual progress bar, completed vs total
- **Daily streak system** — login streak tracked and displayed
- **Activity calendar** — 30-day heatmap of learning activity
- **Dashboard** — stats, active roadmap, all roadmaps summary
- **JWT auth** — secure register/login with bcrypt password hashing

---

## Algorithms Used

| Algorithm               | Where Used                                           |
| ----------------------- | ---------------------------------------------------- |
| Prompt Engineering      | ai_service.py — structured JSON prompt to Gemini     |
| Content-Based Filtering | Gemini matches resources to skill/level              |
| Prerequisite Ordering   | Gemini orders topics by difficulty progression       |
| Progress Analytics      | progress_percent = completed/total × 100             |
| Streak Calculation      | auth.py — date diff logic for consecutive login days |
| JWT (HS256)             | auth_utils.py — stateless session management         |
| bcrypt                  | auth_utils.py — password hashing with salt rounds    |

---

## API Endpoints

```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login, returns JWT
GET    /api/auth/me                Get current user

POST   /api/roadmaps/generate      Generate AI roadmap
GET    /api/roadmaps/              List user's roadmaps
GET    /api/roadmaps/{id}          Get single roadmap
DELETE /api/roadmaps/{id}          Delete roadmap

POST   /api/progress/topic         Mark topic complete/incomplete

GET    /api/dashboard/             Full dashboard data
```
