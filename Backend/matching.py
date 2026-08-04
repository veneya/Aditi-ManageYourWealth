# backend/matching.py
# Turns raw quiz answers into a normalized profile, then scores every
# scheme in data/schemes.py against that profile's eligibility fields.

from data.schemes import SCHEMES
from models import QuizAnswers

AGE_MIDPOINT = {
    "18–25 years": 22,
    "26–35 years": 30,
    "36–45 years": 40,
    "46 and above": 50,
}

INCOME_CEILING = {
    "Under ₹3 lakh": 250_000,
    "₹3–6 lakh": 450_000,
    "Above ₹6 lakh": 900_000,
}


def normalize(answers: QuizAnswers) -> dict:
    """Convert the quiz's option strings into the flags schemes.py checks against."""
    return {
        "age": AGE_MIDPOINT.get(answers.age_group, 30),
        "income": INCOME_CEILING.get(answers.income_bracket, 500_000),
        "no_house": answers.home_status == "No house",
        "for_women": answers.gender == "Female",
        "is_woman": answers.gender == "Female",
        "for_transgender": answers.gender == "Other / LGBTQ+",
        "wants_business": answers.business_plan.startswith("Yes"),
        "has_daughter": answers.has_daughter == "Yes",
        "gender": answers.gender,
        "category": answers.category,
        "self_employed": answers.employment == "Self-employed",
        "homemaker": answers.employment == "Homemaker",
    }


def is_eligible(scheme: dict, profile: dict) -> bool:
    e = scheme.get("eligibility", {})

    if "age_min" in e and profile["age"] < e["age_min"]:
        return False
    if "age_max" in e and profile["age"] > e["age_max"]:
        return False
    if "income_max" in e and profile["income"] > e["income_max"]:
        return False
    if e.get("no_house") and not profile["no_house"]:
        return False
    if e.get("has_daughter") and not profile["has_daughter"]:
        return False
    if e.get("wants_business") and not profile["wants_business"]:
        return False
    if e.get("for_women") and profile["gender"] != "Female":
        return False
    if e.get("is_woman") and profile["gender"] != "Female":
        return False
    if e.get("for_transgender") and not profile["for_transgender"]:
        return False

    return True


def score_scheme(scheme: dict, profile: dict) -> int:
    """Simple relevance score for ranking eligible schemes (0-100)."""
    e = scheme.get("eligibility", {})
    score = 50

    if e.get("wants_business") and profile["wants_business"]:
        score += 20
        if profile["self_employed"]:
            score += 10
    if e.get("has_daughter") and profile["has_daughter"]:
        score += 30
    if e.get("no_house") and profile["no_house"]:
        score += 20
    if e.get("for_women") or e.get("is_woman"):
        score += 10 if profile["gender"] == "Female" else 0
    if e.get("for_transgender") and profile["for_transgender"]:
        score += 40
    if profile["category"] == "SC / ST" and scheme["id"] == "standup":
        score += 15
    if profile["homemaker"] and scheme["id"] == "sukanya":
        score += 5

    return min(96, score)


def label_for_rank(index: int) -> str:
    if index == 0:
        return "Most appropriate"
    if index == 1:
        return "Moderately appropriate"
    return "Least appropriate"


def match_schemes(answers: QuizAnswers, limit: int = 5) -> list[dict]:
    """Match schemes to user answers and return ranked list."""
    profile = normalize(answers)
    eligible = [s for s in SCHEMES if is_eligible(s, profile)]

    scored = sorted(
        ({**s, "match_score": score_scheme(s, profile)} for s in eligible),
        key=lambda s: s["match_score"],
        reverse=True,
    )[:limit]

    for i, s in enumerate(scored):
        s["match_label"] = label_for_rank(i)

    return scored
