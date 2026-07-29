# backend/explain.py
# Plain-language explanations of scheme jargon/benefits via Groq, falling
# back to the canned `jargon` list (or description) in schemes.py if Groq
# is unavailable.

import sys
sys.path.append('..')

from groq_client import chat_completion

EXPLAIN_SYSTEM_PROMPT = (
    "You are ADITI, an assistant that explains Indian government welfare "
    "scheme jargon and benefits in extremely simple language, for someone "
    "applying to a scheme for the first time. No legal or financial jargon."
)


def explain_scheme(scheme: dict, term: str | None = None) -> tuple[str, str]:
    """Returns (explanation, source) where source is 'ai' or 'fallback'."""
    if term:
        user_prompt = (
            f"In one or two short, plain sentences, explain the term '{term}' "
            f"as used in the Indian government scheme '{scheme['name']}'."
        )
    else:
        user_prompt = (
            f"In 2-3 short, plain sentences for a first-time applicant, explain what "
            f"'{scheme['name']}' offers and why it matters. "
            f"Description: {scheme['description']} Benefit: {scheme['benefit']}"
        )

    try:
        explanation = chat_completion(
            [
                {"role": "system", "content": EXPLAIN_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
            max_tokens=200,
        )
        return explanation, "ai"
    except Exception:
        if term:
            for j in scheme.get("jargon", []):
                if j["term"].lower() == term.lower():
                    return j["meaning"], "fallback"
            return (
                f"'{term}' is a term related to {scheme['name']}. "
                f"Check the official source for full details.",
                "fallback",
            )
        return scheme.get("problem_solved", scheme.get("description", "")), "fallback"