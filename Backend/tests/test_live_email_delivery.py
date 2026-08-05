"""Opt-in integration test for delivering a real email to all subscribers."""

import os

import pytest

from Backend.services.database import get_active_recipients
from Backend.services.mailer import send_email_digest


def test_deliver_real_test_email_to_all_subscribers():
    """Send only when the caller has explicitly enabled this live test."""
    if os.environ.get("RUN_LIVE_EMAIL_TEST") != "1":
        pytest.skip("Set RUN_LIVE_EMAIL_TEST=1 to send a real email to every subscriber.")

    recipients = get_active_recipients()
    if not recipients:
        pytest.skip("No subscribers are available to receive the live test email.")

    sent = send_email_digest(
        recipients,
        [
            {
                "source": "ADITI test",
                "title": "Test notification — please ignore",
                "link": "https://example.com/aditi-email-test",
                "summary": "This is a delivery test for the ADITI subscriber email service.",
            }
        ],
    )

    assert sent is True
