"""Weekly scheduler for the subscriber email digest."""

import os
from zoneinfo import ZoneInfo

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

from .email_service import fetch_news_for_email

_scheduler = None


def start_email_scheduler():
    """Start the singleton weekly digest scheduler for this API process."""
    global _scheduler
    if _scheduler is not None:
        return _scheduler
    if os.environ.get("EMAIL_DIGEST_ENABLED", "true").lower() != "true":
        return None

    timezone_name = os.environ.get("EMAIL_DIGEST_TIMEZONE", "Asia/Kolkata")
    cron_expression = os.environ.get("EMAIL_DIGEST_CRON", "0 9 * * 1")
    timezone = ZoneInfo(timezone_name)
    _scheduler = BackgroundScheduler(timezone=timezone)
    _scheduler.add_job(
        fetch_news_for_email,
        CronTrigger.from_crontab(cron_expression, timezone=timezone),
        id="weekly_email_digest",
        replace_existing=True,
        max_instances=1,
        coalesce=True,
    )
    _scheduler.start()
    print(f"Weekly email digest scheduled: {cron_expression} ({timezone_name}).")
    return _scheduler


def stop_email_scheduler():
    """Stop the in-process scheduler during application shutdown."""
    global _scheduler
    if _scheduler is not None:
        _scheduler.shutdown(wait=False)
        _scheduler = None
