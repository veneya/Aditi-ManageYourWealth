# backend/main.py
# Entry point for the ADITI Scheme Matchmaker API.
# Run locally from the repository root with:
# uvicorn Backend.main:app --reload

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import routes
from .routes import router
from .data.schemes import SCHEMES

app = FastAPI(
    title="ADITI Scheme Matchmaker API",
    description="Matches quiz answers to eligible government welfare schemes.",
    version="1.0.0",
)

# CORS - allow all origins for hackathon (no cookie-based auth, so
# credentials aren't needed and a plain wildcard is safe + simplest)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routes
app.include_router(router)


@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "ADITI Scheme Matchmaker API",
        "schemes_count": len(SCHEMES),
        "endpoints": {
            "/api/match": "POST - Match user to schemes",
            "/api/chat": "POST - Ask ADITI chatbot",
            "/api/explain": "POST - Explain scheme jargon",
            "/api/subscribe": "POST - Subscribe to updates",
            "/api/schemes": "GET - List all schemes",
            "/api/schemes/{id}": "GET - Get scheme by ID",
            "/api/news": "GET - Latest financial news"
        }
    }


# Run with: uvicorn Backend.main:app --reload --host 0.0.0.0 --port 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
