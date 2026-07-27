# main.py
# Entry point for the ADITI Scheme Matchmaker API.
# Run locally with: uvicorn main:app --reload

# --- Third-party ---
from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from groq import Groq
from dotenv import load_dotenv

# --- Standard library ---
import os
import json

# --- Local: config & Groq wrapper ---
from config import GROQ_API_KEY, GROQ_MODEL
from groq_client import get_client, chat_completion

# --- Local: data ---
from data.schemes import SCHEMES, SCHEMES_SOURCES

# --- Local: request/response schemas ---
from models import (
    QuizAnswers,
    JargonTerm,
    SchemeOut,
    MatchResponse,
    ChatRequest,
    ChatResponse,
    ExplainRequest,
    ExplainResponse,
)

# --- Local: business logic ---
from matching import match_schemes, normalize, is_eligible, score_scheme, label_for_rank
from chatbot import bot_reply, ai_reply, rule_based_reply
from explain import explain_scheme

# --- Local: routes (registers all /api endpoints on this app) ---
from routes import router

app = FastAPI(
    title="ADITI Scheme Matchmaker API",
    description="Matches quiz answers to eligible government welfare schemes.",
    version="1.0.0",
)

# Loosen this to your actual frontend origin(s) before deploying.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def root():
    return {"status": "ok", "service": "ADITI Scheme Matchmaker API"}
