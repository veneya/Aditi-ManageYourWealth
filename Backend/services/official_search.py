"""Small live-source lookup for time-sensitive Indian financial guidance."""

import html
import re
from urllib.parse import parse_qs, unquote, urlparse

import requests

TRUSTED_DOMAINS = ("rbi.org.in", "gov.in", "indiapost.gov.in", "sebi.gov.in", "amfiindia.com", "pfrda.org.in")
SEARCH_URL = "https://html.duckduckgo.com/html/"


def current_sources(query: str) -> list[dict]:
    """Find a few official pages; callers must treat snippets as evidence, not a rate database."""
    try:
        response = requests.get(SEARCH_URL, params={"q": f"{query} India official interest rate"}, headers={"User-Agent": "ADITI/1.0"}, timeout=8)
        links = re.findall(r'class="result__a"[^>]*href="([^"]+)"[^>]*>(.*?)</a>', response.text, re.S)
        results = []
        for href, title in links:
            parsed = urlparse(html.unescape(href))
            url = unquote(parse_qs(parsed.query).get("uddg", [href])[0])
            host = urlparse(url).hostname or ""
            if not any(host == domain or host.endswith(f".{domain}") for domain in TRUSTED_DOMAINS):
                continue
            results.append({"title": re.sub(r"<.*?>", "", html.unescape(title)).strip(), "url": url})
            if len(results) == 3:
                break
        return results
    except requests.RequestException:
        return []
