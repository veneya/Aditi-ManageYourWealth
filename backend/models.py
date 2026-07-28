# models.py
# Pydantic request/response models for the ADITI Scheme Matchmaker API

from pydantic import BaseModel, Field
from typing import List, Optional


class QuizAnswers(BaseModel):
    """
    Mirrors the answers collected by the quiz in script.js.
    All fields are the exact option strings shown to the user, so the
    frontend can POST its `answers` array almost as-is (see matching.py
    for how each field gets normalized).
    """
    gender: str = Field(..., examples=["Male", "Female", "Other / LGBTQ+"])
    age_group: str = Field(..., examples=["18–25 years", "26–35 years", "36–45 years", "46 and above"])
    marital_status: str = Field(..., examples=["Single", "Married", "Divorced", "Widow"])
    income_bracket: str = Field(..., examples=["Under ₹3 lakh", "₹3–6 lakh", "Above ₹6 lakh"])
    home_status: str = Field(..., examples=["Own house", "Renting", "No house"])
    employment: str = Field(..., examples=["Salaried", "Self-employed", "Homemaker"])
    state_region: str = Field(..., examples=["North India", "South India", "East India", "West India"])
    bank_status: str = Field(..., examples=["Yes, Aadhaar linked", "Yes, not linked", "No bank account"])
    category: str = Field(..., examples=["General / EWS", "OBC", "SC / ST"])
    has_daughter: str = Field(..., examples=["Yes", "No"])
    business_plan: str = Field(..., examples=["Yes, starting new", "Yes, expanding existing", "Not planning to"])


class JargonTerm(BaseModel):
    term: str
    meaning: str


class SchemeOut(BaseModel):
    id: str
    name: str
    category: str
    badge: str
    description: str
    benefit: str
    problem_solved: str
    jargon: List[JargonTerm]
    how_to_apply: List[str]
    source: str
    match_score: Optional[int] = None
    match_label: Optional[str] = None


class MatchResponse(BaseModel):
    count: int
    matches: List[SchemeOut]


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str
    source: str  # "ai" or "rule_based"


class ExplainRequest(BaseModel):
    scheme_id: str
    term: Optional[str] = None  # omit to get a plain-language summary of the whole scheme


class ExplainResponse(BaseModel):
    scheme_id: str
    term: Optional[str] = None
    explanation: str
    source: str  # "ai" or "fallback"
