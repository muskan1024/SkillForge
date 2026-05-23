import httpx
import json
import re
from database import get_settings
from typing import List

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
        settings = get_settings()
        if not settings.groq_api_key:
            raise ValueError("GROQ_API_KEY is not set in environment variables.")

        skills_str = ", ".join(skills)
        prompt = ROADMAP_PROMPT.format(
            skills=skills_str,
            skill_level=skill_level,
            learning_goal=learning_goal,
            timeline=timeline
        )

        headers = {
            "Authorization": f"Bearer {settings.groq_api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.5,
            "response_format": {"type": "json_object"}
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers=headers,
                json=payload,
                timeout=60.0
            )

            if response.status_code != 200:
                raise ValueError(f"Groq API returned an error: {response.text}")

            data = response.json()
            text = data["choices"][0]["message"]["content"].strip()
            
            # Strip markdown code blocks if present
            text = re.sub(r'^```(?:json)?\s*', '', text)
            text = re.sub(r'\s*```$', '', text)
            return json.loads(text)
    except json.JSONDecodeError as e:
        raise ValueError(f"AI returned invalid JSON: {e}")
    except Exception as e:
        raise ValueError(f"AI generation failed: {e}")
