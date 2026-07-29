# backend/services/database.py

import sqlite3
import os
import requests
from datetime import datetime

# --------------------------------------------------
# 1. SUPABASE CONFIGURATION (Web Subscribers)
# --------------------------------------------------

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://auuxazllfvrjzitsczrp.supabase.co")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "sb_publishable_Ur1Xg64UMMrqkrYrWjBcew_32Swbp6q")
SUBSCRIBERS_ENDPOINT = f"{SUPABASE_URL}/rest/v1/subscribers"

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
        headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json"
        }
        params = {"select": "email"}

        response = requests.get(SUBSCRIBERS_ENDPOINT, headers=headers, params=params, timeout=10)

        if response.status_code == 200:
            rows = response.json()
            emails = [row["email"] for row in rows if row.get("email")]
            print(f"Retrieved {len(emails)} subscriber(s) from Supabase.")
            return emails
        else:
            print(f"❌ Failed to fetch subscribers. Status: {response.status_code}")
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
    except sqlite3.IntegrityError:
        pass
    conn.close()

# Initialize database on module load
init_db()