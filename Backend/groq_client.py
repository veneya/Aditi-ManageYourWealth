# backend/groq_client.py
# Thin wrapper around the Groq SDK (the "SchemeMatchmaker" app on Groq).
# Every caller should catch exceptions and fall back to a non-AI response —
# this keeps the API usable even if GROQ_API_KEY is missing or Groq is down.

import os
from groq import Groq
from config import GROQ_API_KEY, GROQ_MODEL

_client: Groq | None = None


def get_client() -> Groq:
    global _client
    if _client is None:
        if not GROQ_API_KEY:
            raise RuntimeError(
                "GROQ_API_KEY is not set. Add it to a .env file or your environment."
            )
        _client = Groq(api_key=GROQ_API_KEY)
    return _client


def chat_completion(messages: list[dict], temperature: float = 0.4, max_tokens: int = 400) -> str:
    """
    messages: list of {"role": "system"|"user"|"assistant", "content": str}
    Raises on any failure — callers are expected to catch and fall back.
    """
    client = get_client()
    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=messages,
        temperature=temperature,
        max_tokens=max_tokens,
    )
    return response.choices[0].message.content.strip()
