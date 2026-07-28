# backend/main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import your existing utilities
import sys
sys.path.append('..')  # Add parent directory to path
from utils.scheme_matcher import match_schemes
from utils.groq_helper import explain_jargon_with_groq, generate_match_summary
from utils.rss_fetcher import fetch_rss_news

app = FastAPI(title="ADITI API", description="Financial Empowerment Platform")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# REQUEST/RESPONSE MODELS
# ============================================

class UserProfile(BaseModel):
    age: int
    marital_status: str
    income: float
    has_house: bool
    wants_business: bool
    has_daughter: bool
    is_woman: bool = True

class JargonRequest(BaseModel):
    term: str

# ============================================
# ENDPOINTS
# ============================================

@app.get("/")
def root():
    return {"message": "🌺 ADITI API is running"}

@app.post("/api/match")
def match_user_schemes(profile: UserProfile):
    """Match user profile to eligible schemes"""
    try:
        matched = match_schemes(profile.dict())
        
        # Generate AI summary
        summary = generate_match_summary(profile.dict(), matched)
        
        return {
            "success": True,
            "matched_schemes": matched,
            "count": len(matched),
            "summary": summary
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/api/explain")
def explain_term(request: JargonRequest):
    """Explain a financial term using Groq AI"""
    try:
        explanation = explain_jargon_with_groq(request.term)
        return {"success": True, "term": request.term, "explanation": explanation}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/api/news")
def get_news():
    """Fetch latest news from PIB RSS"""
    try:
        news = fetch_rss_news()
        return {"success": True, "news": news}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/api/schemes")
def get_all_schemes():
    """Get all schemes (for admin/debug)"""
    from data.schemes import SCHEMES
    return {"schemes": SCHEMES}

# ============================================
# RUN
# ============================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)