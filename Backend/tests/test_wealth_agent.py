from wealth_agent import plan


def test_plan_without_key_is_explicit(monkeypatch):
    monkeypatch.setattr("wealth_agent.GROQ_API_KEY", None)
    result = plan("Help with tax", [])
    assert result["action"]["type"] == "none"
    assert result["error"] == "LLM_NOT_CONFIGURED"
