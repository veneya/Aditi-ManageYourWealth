"""Create and deliver subscriber email digests through Gmail SMTP."""

import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr, make_msgid
from html import escape
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

SENDER_EMAIL = os.environ.get("ADITI_EMAIL", "aditi.manageyourwealth@gmail.com")
SENDER_PASSWORD = os.environ.get("ADITI_EMAIL_PASSWORD", "")
SENDER_NAME = os.environ.get("ADITI_SENDER_NAME", "ADITI Updates")


def create_email_html(articles):
    """Generate the HTML version of a digest without trusting article markup."""
    if not articles:
        return "<p>No new updates available.</p>"

    items_html = ""
    for article in articles:
        items_html += f"""
        <div style="border-bottom:1px solid #e2e8f0;padding:15px 0">
          <p style="margin:0;color:#1e40af;font-size:12px;font-weight:bold">{escape(article['source'])}</p>
          <h3 style="margin:10px 0 5px;color:#0f172a"><a href="{escape(article['link'], quote=True)}" style="color:#2563eb">{escape(article['title'])}</a></h3>
          <p style="margin:0;color:#475569;font-size:14px">{escape(article['summary'])}</p>
        </div>"""

    return f"""<!doctype html>
<html><body style="font-family:Arial,sans-serif;background:#f8fafc;padding:20px">
  <main style="max-width:600px;margin:auto;background:#fff;padding:25px;border:1px solid #e2e8f0;border-radius:8px">
    <h1 style="color:#2563eb;margin:0">ADITI</h1>
    <p style="color:#64748b">Financial and tax notifications</p>
    <p>Here are your latest updates:</p>
    {items_html}
    <footer style="margin-top:25px;color:#64748b;font-size:12px">To stop receiving these emails, reply with “unsubscribe”.</footer>
  </main>
</body></html>"""


def create_email_text(articles):
    """Create a plain-text alternative for mail clients and spam filters."""
    lines = ["ADITI financial and tax updates", "", "Here are your latest updates:", ""]
    for article in articles:
        lines.extend([
            f"[{article['source']}] {article['title']}",
            article["summary"],
            article["link"],
            "",
        ])
    lines.extend(["To stop receiving these emails, reply with 'unsubscribe'.", ""])
    return "\n".join(lines)


def _build_digest_message(recipient, articles):
    """Build a private multipart email for a single recipient."""
    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"ADITI weekly update: {len(articles)} new item(s)"
    msg["From"] = formataddr((SENDER_NAME, SENDER_EMAIL))
    msg["To"] = recipient
    msg["Reply-To"] = SENDER_EMAIL
    msg["Message-ID"] = make_msgid(domain=SENDER_EMAIL.split("@")[-1])
    msg["List-Unsubscribe"] = f"<mailto:{SENDER_EMAIL}?subject=unsubscribe>"
    msg.attach(MIMEText(create_email_text(articles), "plain", "utf-8"))
    msg.attach(MIMEText(create_email_html(articles), "html", "utf-8"))
    return msg


def send_email_digest(recipient_emails, articles):
    """Send a private digest to each recipient over one authenticated SMTP connection."""
    if not articles:
        print("No new updates to send.")
        return False

    recipients_list = [recipient_emails] if isinstance(recipient_emails, str) else recipient_emails
    if not recipients_list:
        print("No recipients found.")
        return False
    if not SENDER_PASSWORD:
        print("Email password not set. Add ADITI_EMAIL_PASSWORD to .env")
        return False

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            for recipient in recipients_list:
                server.sendmail(SENDER_EMAIL, [recipient], _build_digest_message(recipient, articles).as_string())
        print(f"ADITI notification sent to {len(recipients_list)} subscriber(s).")
        return True
    except Exception as error:
        print(f"Failed to send notification: {error}")
        return False
