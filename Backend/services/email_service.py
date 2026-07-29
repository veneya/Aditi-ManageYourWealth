# backend/services/email_service.py

import sys
import os
from pathlib import Path

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.transport import fetch_and_parse_feeds
from services.deadline import check_upcoming_deadlines
from services.database import filter_new_articles, mark_as_sent, get_active_recipients
from services.mailer import send_email_digest

def fetch_news_for_email():
    """
    Fetches news and deadlines, filters duplicates, and sends email digest.
    Returns dict with status and count.
    """
    try:
        print("1. Fetching Dynamic RSS Feeds...")
        dynamic_articles = fetch_and_parse_feeds()

        print("2. Checking Static Deadline Reminders...")
        deadline_reminders = check_upcoming_deadlines()

        all_items = dynamic_articles + deadline_reminders
        print(f"Found {len(all_items)} total items (RSS + Reminders).")

        print("3. Checking database for duplicates...")
        fresh_items = filter_new_articles(all_items)
        print(f"Found {len(fresh_items)} NEW unseen items.")

        if fresh_items:
            print("4. Fetching active email subscribers from Supabase...")
            recipients = get_active_recipients()

            if not recipients:
                print("⚠️ No subscribers found.")
                return {"success": False, "count": 0, "message": "No subscribers"}

            print(f"5. Dispatching notification to {len(recipients)} subscriber(s)...")
            email_sent = send_email_digest(recipients, fresh_items)

            if email_sent:
                for item in fresh_items:
                    mark_as_sent(item["hash"], item["title"])
                print("6. Local database updated!")
                return {"success": True, "count": len(fresh_items), "recipients": len(recipients)}
            else:
                return {"success": False, "count": len(fresh_items), "message": "Email send failed"}
        else:
            print("Everything is up to date! No notification sent.")
            return {"success": True, "count": 0, "message": "No new items"}

    except Exception as e:
        print(f"❌ Error in email service: {e}")
        return {"success": False, "count": 0, "message": str(e)}