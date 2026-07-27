# routes.py
# All API endpoints for the ADITI Scheme Matchmaker.

from fastapi import APIRouter, HTTPException

from data.schemes import SCHEMES, SCHEMES_SOURCES
from models import (
    QuizAnswers,
    MatchResponse,
    ChatRequest,
    ChatResponse,
    ExplainRequest,
    ExplainResponse,
)
from matching import match_schemes
from chatbot import bot_reply
from explain import explain_scheme

router = APIRouter(prefix="/api")


@router.get("/schemes")
def list_schemes():
    """Return every scheme in the catalogue, with its source metadata."""
    return {"sources": SCHEMES_SOURCES, "schemes": SCHEMES}


@router.get("/schemes/{scheme_id}")
def get_scheme(scheme_id: str):
    for s in SCHEMES:
        if s["id"] == scheme_id:
            return s
    raise HTTPException(status_code=404, detail=f"Scheme '{scheme_id}' not found")


@router.post("/match", response_model=MatchResponse)
def match(answers: QuizAnswers):
    """Score the quiz answers against every scheme and return the eligible, ranked list."""
    matches = match_schemes(answers)
    return {"count": len(matches), "matches": matches}


@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest):
    """Ask ADITI — Groq-powered reply, falls back to rule-based logic if Groq fails."""
    if not payload.message.strip():
        raise HTTPException(status_code=400, detail="message cannot be empty")
    reply, source = bot_reply(payload.message)
    return {"reply": reply, "source": source}


@router.post("/explain", response_model=ExplainResponse)
def explain(payload: ExplainRequest):
    """Plain-language explanation of a scheme, or one jargon term within it."""
    scheme = next((s for s in SCHEMES if s["id"] == payload.scheme_id), None)
    if not scheme:
        raise HTTPException(status_code=404, detail=f"Scheme '{payload.scheme_id}' not found")
    explanation, source = explain_scheme(scheme, payload.term)
    return {
        "scheme_id": payload.scheme_id,
        "term": payload.term,
        "explanation": explanation,
        "source": source,
    }
