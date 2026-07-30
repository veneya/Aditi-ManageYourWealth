# backend/services/deadline.py

from datetime import datetime, date

# Static deadlines (YYYY-MM-DD)
STATIC_DEADLINES = [
    {
        "title": "ITR Filing Deadline (Non-Audit)",
        "date": "2026-07-31",
        "description": "Last day to file Income Tax Return for individuals without tax audit requirement."
    },
    {
        "title": "Advance Tax First Installment",
        "date": "2026-06-15",
        "description": "Deadline to pay 15% of estimated annual advance tax liability."
    },
    {
        "title": "Advance Tax Second Installment",
        "date": "2026-09-15",
        "description": "Deadline to pay 45% of estimated annual advance tax liability."
    },
    {
        "title": "Advance Tax Third Installment",
        "date": "2026-12-15",
        "description": "Deadline to pay 75% of estimated annual advance tax liability."
    },
    {
        "title": "Property Tax Early Payment Discount Deadline",
        "date": "2026-08-31",
        "description": "Last date to clear municipal property tax dues to claim early payment discounts."
    }
]

def check_upcoming_deadlines():
    """Checks for deadlines falling on 30 days, 7 days, or today."""
    today = date.today()
    reminders = []

    for item in STATIC_DEADLINES:
        deadline_date = datetime.strptime(item["date"], "%Y-%m-%d").date()
        days_remaining = (deadline_date - today).days

        if days_remaining in [30, 7, 0]:
            if days_remaining == 30:
                urgency = "⚠️ 30 Days Remaining"
            elif days_remaining == 7:
                urgency = "🚨 7 Days Remaining"
            else:
                urgency = "🔥 LAST DAY TODAY"

            reminders.append({
                "source": "ADITI Tax Alert",
                "title": f"[{urgency}] {item['title']}",
                "link": "https://www.incometaxindia.gov.in",
                "summary": f"{item['description']} (Deadline: {item['date']})",
                "hash": f"deadline_{item['title']}_{days_remaining}_{item['date']}"
            })

    return reminders