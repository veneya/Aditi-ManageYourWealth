# backend/chatbot.py
# "Ask ADITI" replies. Tries the Groq API first (grounded in the scheme
# catalogue); falls back to the original keyword-based logic if Groq is
# unavailable (no API key, rate limit, network error, etc).

import json
import sys
sys.path.append('..')

from backend.data.schemes import SCHEMES
from groq_client import chat_completion

_SCHEMES_JSON = json.dumps(
    [
        {
            "id": s["id"],
            "name": s["name"],
            "category": s["category"],
            "description": s["description"],
            "benefit": s["benefit"],
            "eligibility": s["eligibility"],
            "how_to_apply": s["how_to_apply"],
        }
        for s in SCHEMES
    ],
    ensure_ascii=False,
)

SYSTEM_PROMPT = f"""You are ADITI, a friendly assistant on an Indian government welfare scheme
matchmaking website. You only answer questions about the schemes in this catalogue
(JSON below) — their eligibility, required documents, and how to apply.

Rules:
- Keep answers to 2-4 short, plain-language sentences. No legal jargon.
- If asked about a scheme not in the catalogue, say you don't have information on it.
- If the question is unrelated to these schemes, gently steer back to what you can help with.
- If eligibility is unclear from the question, suggest they take the quiz on the site.

SCHEMES CATALOGUE:
{_SCHEMES_JSON}
"""


def ai_reply(message: str) -> str:
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": message},
    ]
    return chat_completion(messages, temperature=0.4, max_tokens=300)


# ---- Rule-based fallback (used if Groq is unavailable) ----

SCHEME_KEYWORDS = {
    "pmay": ["pmay", "housing", "home loan"],
    "mudra": ["mudra"],
    "standup": ["stand-up", "stand up", "standup"],
    "sukanya": ["sukanya", "ssy", "daughter"],
}


def _matches_any(text: str, words: list[str]) -> bool:
    return any(w in text for w in words)


def _scheme_from_text(text: str) -> str | None:
    for scheme_id, keywords in SCHEME_KEYWORDS.items():
        if _matches_any(text, keywords):
            return scheme_id
    return None


DOCUMENTS = {
    "pmay": "For PMAY you'll need: Aadhaar card, income certificate, address proof, a declaration that you don't own another pucca house, bank passbook, and a passport photo. Apply through pmay-urban.gov.in or a partner bank.",
    "mudra": "For a Mudra Loan you'll need: Aadhaar, PAN, a simple business plan, address proof, 6 months of bank statements, and a passport photo. You can apply at any nationalised bank, RRB, or MFI.",
    "standup": "For Stand-Up India you'll need: Aadhaar, PAN, a caste certificate if you're SC/ST, a project report, address proof, and bank account details. Apply through any public sector bank branch.",
    "sukanya": "For Sukanya Samriddhi Yojana you'll need: your daughter's birth certificate, the parent or guardian's Aadhaar, address proof, and a passport photo. Open the account at any post office or authorised bank.",
}

APPLY_INFO = {
    "pmay": "You can apply for PMAY at pmay-urban.gov.in, or through any bank or housing finance company offering the interest subsidy.",
    "mudra": "Apply for a Mudra Loan at any nationalised bank, regional rural bank, or microfinance institution.",
    "standup": "Apply for Stand-Up India through any public sector bank branch.",
    "sukanya": "Open a Sukanya Samriddhi account at your nearest post office or an authorised bank.",
}

ELIGIBILITY_INFO = {
    "sukanya": "Sukanya Samriddhi Yojana is open to any parent or legal guardian of a girl child. One account per girl child, up to two per family.",
    "pmay": "PMAY-U 2.0 generally suits families earning under ₹9 lakh a year who don't already own a pucca house. Take the quiz above for a precise match.",
    "mudra": "Mudra Loans are open to any small business owner or aspiring entrepreneur needing funding up to ₹20 lakh.",
    "standup": "Stand-Up India is for women entrepreneurs and SC/ST entrepreneurs starting a new greenfield venture.",
}


def rule_based_reply(raw: str) -> str:
    text = raw.lower()

    if _matches_any(text, ["document", "papers", "documents needed", "kyc"]):
        scheme = _scheme_from_text(text)
        if scheme:
            return DOCUMENTS[scheme]
        return "Tell me which scheme you're asking about — PMAY, Mudra Loan, Stand-Up India, or Sukanya Samriddhi Yojana — and I'll list the exact documents you'll need."

    if _matches_any(text, ["apply", "portal", "website", "how do i", "link"]):
        scheme = _scheme_from_text(text)
        if scheme:
            return APPLY_INFO[scheme]
        return "Take the eligibility quiz above and I'll match you to the right scheme with a direct link to its official application portal."

    if _matches_any(text, ["eligible", "eligibility", "qualify"]):
        scheme = _scheme_from_text(text)
        if scheme:
            return ELIGIBILITY_INFO[scheme]
        return "Eligibility depends on your income, housing status, employment, and a few other factors. The quickest way to check is the quiz above — want me to scroll you there?"

    if _matches_any(text, ["hi", "hello", "hey"]):
        return "Hello! I can help with eligibility, required documents, or how to apply for any scheme on this page. What would you like to know?"

    if "thank" in text:
        return "You're welcome! Good luck with your application — I'm here if you have more questions."

    return "I can help with eligibility, documents, or application steps for PMAY, Mudra Loan, Stand-Up India, and Sukanya Samriddhi Yojana. Could you tell me which scheme you mean?"


def bot_reply(message: str) -> tuple[str, str]:
    """Returns (reply, source) where source is 'ai' or 'rule_based'."""
    try:
        return ai_reply(message), "ai"
    except Exception:
        return rule_based_reply(message), "rule_based"