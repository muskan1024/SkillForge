import google.generativeai as genai
import json
import re
from database import get_settings
from typing import List

def init_gemini():
    settings = get_settings()
    genai.configure(api_key=settings.gemini_api_key)
    return genai.GenerativeModel("gemini-2.0-flash")

ROADMAP_PROMPT = """You are SkillForge, an expert learning path designer. Generate a detailed, structured learning roadmap.

USER PROFILE:
- Skills to learn: {skills}
- Current level: {skill_level}
- Learning goal: {learning_goal}
- Timeline: {timeline}

Generate a complete learning roadmap as a JSON object. Follow this EXACT structure:

{{
  "title": "Roadmap title (e.g. Python for Job-Ready Beginners)",
  "topics": [
    {{
      "id": "topic_1",
      "name": "Topic Name",
      "description": "2-sentence description of what this covers",
      "subtopics": ["Subtopic 1", "Subtopic 2", "Subtopic 3"],
      "resources": [
        {{
          "title": "Resource name",
          "url": "https://actual-real-url.com",
          "type": "youtube|docs|course|practice",
          "is_free": true
        }}
      ],
      "estimated_hours": 4,
      "week": 1,
      "day_range": "Day 1-3",
      "difficulty": "Beginner|Intermediate|Advanced",
      "completed": false
    }}
  ]
}}

RULES:
1. Generate 8-16 topics based on timeline (longer = more topics)
2. Progress difficulty from beginner → intermediate → advanced
3. Resources must be REAL URLs: use official docs, freecodecamp.org, youtube.com, w3schools.com, leetcode.com, replit.com, kaggle.com, developer.mozilla.org etc.
4. Each topic must have 2-4 resources, all free
5. week field: distribute topics across weeks based on timeline
6. day_range: e.g. "Day 1-3", "Day 4-6"
7. For {skill_level} level, adjust starting point appropriately
8. Return ONLY the JSON object, no markdown, no explanation"""

async def generate_roadmap(skills: List[str], skill_level: str, learning_goal: str, timeline: str) -> dict:
    try:
        model = init_gemini()
        skills_str = ", ".join(skills)
        prompt = ROADMAP_PROMPT.format(
            skills=skills_str,
            skill_level=skill_level,
            learning_goal=learning_goal,
            timeline=timeline
        )
        response = model.generate_content(prompt)
        text = response.text.strip()
        # Strip markdown code blocks if present
        text = re.sub(r'^```(?:json)?\s*', '', text)
        text = re.sub(r'\s*```$', '', text)
        data = json.loads(text)
        return data
    except json.JSONDecodeError as e:
        raise ValueError(f"AI returned invalid JSON: {e}")
    except Exception as e:
        raise ValueError(f"AI generation failed: {e}")
