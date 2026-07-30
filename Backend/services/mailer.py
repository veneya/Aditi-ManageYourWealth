# backend/services/mailer.py

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

SENDER_EMAIL = os.environ.get("ADITI_EMAIL", "aditi.manageyourwealth@gmail.com")
SENDER_PASSWORD = os.environ.get("ADITI_EMAIL_PASSWORD", "")

def create_email_html(articles):
    """Generates HTML email content from articles."""
    
    if not articles:
        return "<p>No new updates available.</p>"
    
    items_html = ""
    for article in articles:
        items_html += f"""
        <div style="border-bottom: 1px solid #e2e8f0; padding: 15px 0;">
            <span style="background: #dbeafe; color: #1e40af; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                {article['source']}
            </span>
            <h3 style="margin: 10px 0 5px 0; color: #0f172a;">
                <a href="{article['link']}" style="color: #2563eb; text-decoration: none;">{article['title']}</a>
            </h3>
            <p style="color: #475569; font-size: 14px; margin: 0;">{article['summary']}</p>
        </div>
        """

    return f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 25px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <div style="text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px;">
                <h1 style="color: #2563eb; margin: 0; font-size: 28px; letter-spacing: 1px;">🌺 ADITI</h1>
                <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Financial & Tax Notifications</p>
            </div>
            
            <p style="color: #0f172a; font-size: 14px;">Hello! Here are your latest updates:</p>
            
            {items_html}
            
            <div style="margin-top: 25px; text-align: center; color: #94a3b8; font-size: 12px;">
                <p>© ADITI Notifications. All rights reserved.</p>
                <p>Unsubscribe: <a href="#" style="color: #2563eb;">Click here</a></p>
            </div>
        </div>
    </body>
    </html>
    """

def send_email_digest(recipient_emails, articles):
    """Sends email digest to recipients."""
    if not articles:
        print("No new updates to send.")
        return False

    if isinstance(recipient_emails, str):
        recipients_list = [recipient_emails]
    else:
        recipients_list = recipient_emails

    if not recipients_list:
        print("No recipients found.")
        return False

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"🔔 ADITI: {len(articles)} New Updates & Reminders"
    msg["From"] = f"ADITI <{SENDER_EMAIL}>"
    msg["To"] = ", ".join(recipients_list)

    html_content = create_email_html(articles)
    msg.attach(MIMEText(html_content, "html"))

    try:
        if not SENDER_PASSWORD:
            print("❌ Email password not set. Add ADITI_EMAIL_PASSWORD to .env")
            return False
            
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, recipients_list, msg.as_string())

        print(f"✅ ADITI notification sent to {len(recipients_list)} subscriber(s)!")
        return True
    except Exception as e:
        print(f"❌ Failed to send notification: {e}")
        return False