# backend/config.py
# Loads environment variables (from .env locally, or real env vars in prod).

import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).with_name(".env"))

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL") or "llama-3.3-70b-versatile"
