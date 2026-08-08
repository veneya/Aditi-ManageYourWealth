"""Small, auditable wealth-planning agent. It never executes financial transactions."""

import json

from config import GROQ_API_KEY
from groq_client import chat_completion
from services.official_search import current_sources


SYSTEM = """You are ADITI Wealth, a cautious Indian wealth-planning assistant for women.
Give educational guidance only: never promise returns, execute trades, or claim tax eligibility.
Reply with JSON only: {"reply": string, "action": {"type": "add"|"none", "name": string, "amount": number, "category": string, "annual_rate_pct": number, "term_years": number}}.
Before tracking an investment, ask concise follow-up questions until you know the principal, expected annual return rate, and investment term. Use action type add only when all three are known and the user explicitly asks to track it; otherwise use none.
Mention that tax deductions and scheme eligibility must be confirmed with official sources or a tax professional."""


def plan(message: str, portfolio: list[dict], history: list[dict] | None = None) -> dict:
    """Return an LLM plan and an optional tracked proposal; never fake an AI response."""
    if not GROQ_API_KEY:
        return {"reply": "ADITI Wealth is not connected to an LLM yet. Add GROQ_API_KEY to Backend/.env and restart the API.", "action": {"type": "none"}, "source": "unavailable", "error": "LLM_NOT_CONFIGURED"}
    context = json.dumps(portfolio, ensure_ascii=False)
    conversation = json.dumps((history or [])[-12:], ensure_ascii=False)
    sources = current_sources(message) if any(word in message.lower() for word in ("rate", "interest", "latest", "current", "scheme", "tax")) else []
    try:
        raw = chat_completion([
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": f"Portfolio: {context}\nPrevious conversation: {conversation}\nOfficial web sources: {json.dumps(sources)}\nRequest: {message}\nUse only these sources for current rates and include their URLs in your answer."},
        ], temperature=0.2, max_tokens=450)
        result = json.loads(raw.removeprefix("```json").removeprefix("```").removesuffix("```").strip())
        action = result.get("action", {"type": "none"})
        if action.get("type") == "add":
            amount = float(action.get("amount", 0))
            rate = float(action.get("annual_rate_pct", 0))
            term = float(action.get("term_years", 0))
            if not action.get("name") or amount <= 0 or rate <= 0 or term <= 0:
                action = {"type": "none"}
            else:
                action["amount"] = amount
                action["annual_rate_pct"] = rate
                action["term_years"] = term
                action["expected_value"] = round(amount * (1 + rate / 100) ** term, 2)
        reply = str(result.get("reply", "I could not prepare a plan."))
        if sources and not any(source["url"] in reply for source in sources):
            reply += "\n\nSources: " + ", ".join(source["url"] for source in sources)
        return {"reply": reply, "action": action, "source": "ai", "sources": sources}
    except Exception:
        return {
            "reply": "I can help you compare a proposed allocation, tax-saving options, and relevant schemes. I will keep this as a planning record—not a bank or investment transaction. Please confirm tax eligibility with an official source or tax professional.",
            "action": {"type": "none"},
            "source": "unavailable",
            "error": "LLM_REQUEST_FAILED",
        }
