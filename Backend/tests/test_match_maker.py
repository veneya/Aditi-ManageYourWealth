from Backend.models import QuizAnswers
from Backend.matching import match_schemes


def test_match_schemes_returns_ranked_results():
    answers = QuizAnswers(
        gender="Female", age_group="26–35 years", marital_status="Single",
        income_bracket="Under ₹3 lakh", home_status="No house", employment="Salaried",
        state_region="North India", bank_status="Yes, Aadhaar linked", category="General / EWS",
        has_daughter="No", business_plan="Not planning to",
    )
    matches = match_schemes(answers)
    assert matches
    assert matches == sorted(matches, key=lambda scheme: scheme["match_score"], reverse=True)
