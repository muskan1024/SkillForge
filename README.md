# SkillForge — AI-Driven Personalized Learning Path Generator

An MCA major project: full-stack web app that generates structured, week-by-week learning roadmaps using Google Gemini AI.

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Tailwind CSS, Vite            |
| Backend    | Python FastAPI + Uvicorn                |
| Database   | MongoDB (Motor async driver)            |
| AI         | Google Gemini 1.5 Flash (free tier)     |
| Auth       | JWT tokens + bcrypt password hashing    |

---

## Project Structure

```
skillforge/
├── backend/
│   ├── main.py              ← FastAPI app entry
│   ├── database.py          ← MongoDB connection + settings
│   ├── models.py            ← Pydantic schemas
│   ├── auth_utils.py        ← JWT + bcrypt helpers
│   ├── ai_service.py        ← Gemini AI prompt + roadmap gen
│   ├── requirements.txt
│   ├── .env.example
│   └── routes/
│       ├── auth.py          ← /api/auth (register, login, me)
│       ├── roadmaps.py      ← /api/roadmaps (generate, list, get, delete)
│       ├── progress.py      ← /api/progress/topic (mark complete)
│       └── dashboard.py     ← /api/dashboard (stats, streaks, active roadmap)
│
└── frontend/
    ├── src/
    │   ├── App.jsx            ← Router
    │   ├── main.jsx           ← Entry
    │   ├── index.css          ← Global styles + Tailwind
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── utils/
    │   │   └── api.js         ← Axios instance
    │   ├── components/
    │   │   └── AppLayout.jsx  ← Sidebar layout
    │   └── pages/
    │       ├── Landing.jsx
    │       ├── Login.jsx
    │       ├── Register.jsx
    │       ├── Dashboard.jsx  ← Stats, streak calendar, active roadmap
    │       ├── Onboarding.jsx ← 5-step form to generate roadmap
    │       ├── RoadmapView.jsx← Full roadmap with "You are here"
    │       └── MyRoadmaps.jsx ← List all roadmaps
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── index.html
```

---

## Setup Instructions

### 1. Get a free Gemini API key

1. Go to https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key (it's free — Gemini 1.5 Flash has a generous free tier)

---

### 2. Start MongoDB

Make sure MongoDB is running locally:
```bash
# macOS with Homebrew
brew services start mongodb-community

# Ubuntu / WSL
sudo systemctl start mongod

# Or use MongoDB Atlas (cloud) — just change MONGODB_URL in .env
```

---

### 3. Backend setup

```bash
cd skillforge/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Now open .env and fill in your GEMINI_API_KEY

# Start the backend
uvicorn main:app --reload --port 8000
```

The API will be live at: http://localhost:8000
API docs (auto-generated): http://localhost:8000/docs

---

### 4. Frontend setup

```bash
cd skillforge/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be live at: http://localhost:5173

---

### 5. Open the app

Visit http://localhost:5173 → Register → Generate your first roadmap!

---

## Environment Variables (backend/.env)

```env
MONGODB_URL=mongodb://localhost:27017
DB_NAME=skillforge
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=10080
GEMINI_API_KEY=your-gemini-api-key-here
```

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
