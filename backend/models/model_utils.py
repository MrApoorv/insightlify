import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv('GEMINI_API_KEY')
client = genai.Client(api_key=API_KEY)


async def analyze_text_with_gemini(text: str) -> dict:
    prompt = f"""
    You are a social media analysis assistant. 
    Analyze the given text and respond ONLY in valid JSON. 
    Do not include explanations or markdown. 
    Follow this exact JSON structure striclty dont send it as a string if sending as a string dont use any spaces or whitespace character do this striclty
    {{
   "sentiment": "<Positive/Negative/Neutral>",
   "emotions": ["<list of detected emotions>"],
   "topics": ["<list of main themes>"],
   "engagement_score": "<1-10 rating of how engaging this text is>",
   "suggestions": ["<3 short improvements for engagement>"],
   "audience": "<best-fit target audience>",
   "hashtags": ["<list of suggested hashtags>"],
   "rewrites": {{
    "friendly": "<casual Instagram-style rewrite>",
    "professional": "<LinkedIn-style rewrite>",
    "concise": "<short Twitter/X-style rewrite>",
    }},
    "summary": "<1-2 sentence summary of the post>"
    }}

    text : '{text}'
    """
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            thinking_config=types.ThinkingConfig(thinking_budget=0)
        ),
    )
    # print(response.text)
    return response.text
