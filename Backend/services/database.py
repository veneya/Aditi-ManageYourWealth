# backend/services/database.py

import sqlite3
import os
import requests
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path

# Load the backend's local environment file without committing credentials.
load_dotenv(Path(__file__).resolve().parents[1] / ".env")

# --------------------------------------------------
# 1. SUPABASE CONFIGURATION (Web Subscribers)
# --------------------------------------------------

# Read from environment variables (NOT hardcoded!)
SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "")


class SupabaseConfigurationError(RuntimeError):
    """Raised when required Supabase credentials are not configured."""


class SupabaseRequestError(RuntimeError):
    """Raised when Supabase rejects or cannot process a request."""


def _supabase_headers() -> dict[str, str]:
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        raise SupabaseConfigurationError(
            "SUPABASE_URL and SUPABASE_ANON_KEY must be set in Backend/.env."
        )
    return {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json",
    }


def _subscribers_endpoint() -> str:
    _supabase_headers()
    return f"{SUPABASE_URL}/rest/v1/subscribers"


def subscribe_email(email: str) -> bool:
    """Insert an email address into Supabase; duplicate subscriptions are harmless."""
    headers = _supabase_headers()
    headers["Prefer"] = "resolution=ignore-duplicates,return=representation"
    try:
        response = requests.post(
            _subscribers_endpoint(),
            params={"on_conflict": "email"},
            headers=headers,
            json={"email": email.lower()},
            timeout=10,
        )
        response.raise_for_status()
    except requests.RequestException as error:
        raise SupabaseRequestError("Unable to save the subscription right now.") from error
    return bool(response.json())

# --------------------------------------------------
# 2. LOCAL SQLITE CONFIGURATION (Deduplication)
# --------------------------------------------------

DB_NAME = "aditi_history.db"

def init_db():
    """Initializes the local SQLite database to store sent emails."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sent_emails (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            article_hash TEXT UNIQUE,
            title TEXT,
            sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

def get_active_recipients():
    """Fetches subscriber emails from Supabase 'subscribers' table."""
    try:
        if not SUPABASE_URL or not SUPABASE_ANON_KEY:
            print("⚠️ Supabase credentials not configured. Please check .env file.")
            return []
            
        headers = _supabase_headers()
        params = {"select": "email"}

        response = requests.get(_subscribers_endpoint(), headers=headers, params=params, timeout=10)

        if response.status_code == 200:
            rows = response.json()
            emails = [row["email"] for row in rows if row.get("email")]
            print(f"✅ Retrieved {len(emails)} subscriber(s) from Supabase.")
            return emails
        else:
            print(f"❌ Failed to fetch subscribers. Status: {response.status_code}")
            print(f"   Response: {response.text}")
            return []

    except Exception as e:
        print(f"❌ Error fetching users from Supabase: {e}")
        return []

def filter_new_articles(articles):
    """Filters out articles that have already been sent."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    new_articles = []
    for article in articles:
        cursor.execute("SELECT 1 FROM sent_emails WHERE article_hash = ?", (article["hash"],))
        if not cursor.fetchone():
            new_articles.append(article)
    
    conn.close()
    return new_articles

def mark_as_sent(article_hash, title):
    """Logs sent articles into local SQLite history."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO sent_emails (article_hash, title) VALUES (?, ?)",
            (article_hash, title)
        )
        conn.commit()
        print(f"✅ Marked as sent: {title}")
    except sqlite3.IntegrityError:
        pass  # Already exists
    conn.close()

# Initialize database on module load
init_db()
