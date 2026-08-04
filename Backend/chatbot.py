"""Grounded ADITI scheme assistant powered by LangChain and Groq."""

import json
import logging

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq

from config import GROQ_API_KEY, GROQ_MODEL
from data.schemes import SCHEMES

logger = logging.getLogger(__name__)

CATALOGUE = json.dumps(
    [
        {
            "id": scheme["id"],
            "name": scheme["name"],
            "category": scheme["category"],
            "description": scheme["description"],
            "benefit": scheme["benefit"],
            "eligibility": scheme["eligibility"],
            "how_to_apply": scheme["how_to_apply"],
            "source": scheme["source"],
        }
        for scheme in SCHEMES
    ],
    ensure_ascii=False,
)

PROMPT = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are ADITI, a helpful Indian government-scheme assistant. Answer only "
            "from the supplied catalogue. Be warm, accurate, and concise: use 2–4 short "
            "sentences. Never invent eligibility, documents, application links, or current "
            "rates. If the answer is absent, say so and point the user to the scheme source "
            "or matcher. Catalogue:\n{catalogue}",
        ),
        ("human", "{message}"),
    ]
)


def ai_reply(message: str) -> str:
    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY is not configured")
    agent = PROMPT | ChatGroq(groq_api_key=GROQ_API_KEY, model=GROQ_MODEL, temperature=0.3, max_tokens=300) | StrOutputParser()
    return agent.invoke({"catalogue": CATALOGUE, "message": message})


def fallback_reply(message: str) -> str:
    query = message.lower()
    matched = next((scheme for scheme in SCHEMES if scheme["id"] in query or scheme["name"].lower() in query), None)
    if matched:
        return f"{matched['name']}: {matched['description']} {matched['benefit']} For official guidance, start with {matched['source']}."
    names = ", ".join(scheme["name"] for scheme in SCHEMES)
    return f"I can help with these schemes: {names}. Ask about eligibility, benefits, or how to apply."


def bot_reply(message: str) -> tuple[str, str]:
    try:
        return ai_reply(message), "ai"
    except Exception:
        logger.exception("Groq agent failed; returning the catalogue fallback")
        return fallback_reply(message), "rule_based"
