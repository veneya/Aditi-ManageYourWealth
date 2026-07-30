# backend/routes.py
# All API endpoints for the ADITI Scheme Matchmaker.

from fastapi import APIRouter, HTTPException, status

from .data.schemes import SCHEMES, SCHEMES_SOURCES
from .models import (
    QuizAnswers,
    MatchResponse,
    ChatRequest,
    ChatResponse,
    ExplainRequest,
    ExplainResponse,
    SubscriptionRequest,
)
from .matching import match_schemes
from .chatbot import bot_reply
from .explain import explain_scheme
from .services.database import (
    SupabaseConfigurationError,
    SupabaseRequestError,
    subscribe_email,
)

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


@router.post("/subscribe")
def subscribe(payload: SubscriptionRequest):
    """Store an email address for future scheme-update digests."""
    try:
        created = subscribe_email(str(payload.email))
    except SupabaseConfigurationError as error:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(error)) from error
    except SupabaseRequestError as error:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(error)) from error
    return {"success": True, "created": created}


@router.get("/news")
def get_news():
    """Fetch the latest items from the configured financial RSS feeds."""
    try:
        from .services.transport import fetch_and_parse_feeds

        news = fetch_and_parse_feeds()
        return {"success": True, "news": news}
    except Exception as e:
        return {"success": False, "error": str(e), "news": []}
