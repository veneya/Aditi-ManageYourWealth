from email import message_from_string
from unittest.mock import Mock

from Backend.services import mailer


def test_send_email_digest_sends_new_items_to_subscribers(monkeypatch):
    """The Gmail connection is mocked, so this test never sends a real email."""
    smtp_server = Mock()
    smtp_connection = Mock()
    smtp_connection.__enter__ = Mock(return_value=smtp_server)
    smtp_connection.__exit__ = Mock(return_value=False)

    monkeypatch.setattr(mailer, "SENDER_EMAIL", "notifications@example.com")
    monkeypatch.setattr(mailer, "SENDER_PASSWORD", "test-app-password")
    monkeypatch.setattr(mailer.smtplib, "SMTP_SSL", Mock(return_value=smtp_connection))

    articles = [
        {
            "source": "Example Source",
            "title": "A new scheme update",
            "link": "https://example.com/scheme-update",
            "summary": "A short update for subscribers.",
        }
    ]
    recipients = ["first@example.com", "second@example.com"]

    assert mailer.send_email_digest(recipients, articles) is True

    mailer.smtplib.SMTP_SSL.assert_called_once_with("smtp.gmail.com", 465)
    smtp_server.login.assert_called_once_with("notifications@example.com", "test-app-password")
    assert smtp_server.sendmail.call_count == len(recipients)

    for call, recipient in zip(smtp_server.sendmail.call_args_list, recipients):
        sender, actual_recipients, raw_message = call.args
        assert sender == "notifications@example.com"
        assert actual_recipients == [recipient]
        parsed_message = message_from_string(raw_message)
        assert parsed_message["To"] == recipient
        assert parsed_message["List-Unsubscribe"]
        plain_body = parsed_message.get_payload()[0].get_payload(decode=True).decode("utf-8")
        html_body = parsed_message.get_payload()[1].get_payload(decode=True).decode("utf-8")
        assert "A new scheme update" in plain_body
        assert "A new scheme update" in html_body
