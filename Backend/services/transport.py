# backend/services/transport.py

import feedparser
import requests
import hashlib

# Updated, reliable RSS Feed URLs
FEEDS = {
    "PIB": "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3",
    "RBI": "https://rbi.org.in/rss/PressReleases.xml",
    "Finshots": "https://finshots.in/rss/"
}

NEWS_LIMIT = 8

# Relevance terms: finance, startups, women empowerment, policy & regulations,
# and finance-market trends. Keeps trader-centric noise out by design.
RELEVANT_TERMS = [
    # English — finance & economy
    "loan", "loans", "bank", "banking", "rupay", "upi", "interest", "subsidy",
    "tax", "taxation", "insurance", "pension", "mutual fund", "savings",
    "deposit", "credit", "finance", "financial", "economy", "economic",
    "investment", "investing", "capital market", "stock market", "market trend",
    "market trends", "sebi", "gst", "budget", "monetary", "ficci",
    # English — startups, MSME, women, jobs
    "startup", "startups", "msme", "women", "entrepreneur", "entrepreneurship",
    "udyam", "mudra", "stand-up india", "nivesh", "ipo", "venture capital",
    "funding", "angel investor", "business", "gig economy", "employment", "job",
    "skill", "kisan",
    # Hindi — finance & economy (note: avoid bare "कर" — it also means "to do")
    "वित्त", "आर्थिक", "बैंक", "ऋण", "सब्सिडी", "आयकर", "जीएसटी", "बीमा",
    "पेंशन", "निवेश", "नीति", "विनियमन", "बजट", "व्यापार",
    # Hindi — startups, MSME, women, jobs
    "योजना", "महिला", "स्टार्टअप", "एमएसएमई", "उद्यम", "रोजगार", "कौशल",
    "किसान",
]

# Out-of-scope noise: general press releases, drugs/health campaigns, sports, etc.
IRRELEVANT_TERMS = [
    "nasha", "narcotic", "drug", "cannabis", "pokemon", "brics", "thermal power",
    "power plant", "cricket", "sports", "movie", "film", "summit", "यात्रा",
    "नशा", "मादक", "नार्कोटिक", "तापीय", "विद्युतीकरण",
]


def generate_hash(title, link):
    """Generates a unique SHA-256 hash for deduplication."""
    content = f"{title}{link}"
    return hashlib.sha256(content.encode('utf-8')).hexdigest()


def is_relevant(article):
    """Score an article by topic terms; keep only finance/startup/policy items."""
    text = f"{article['title']} {article['summary']}".lower()
    if any(term in text for term in IRRELEVANT_TERMS):
        return False, 0
    hits = sum(1 for term in RELEVANT_TERMS if term in text)
    return hits >= 1, hits


def rank_articles(articles, limit=NEWS_LIMIT):
    """Filter to relevant topics and rank by keyword density, capped at `limit`."""
    scored = []
    for article in articles:
        relevant, hits = is_relevant(article)
        if relevant:
            scored.append((hits, article))
    scored.sort(key=lambda pair: pair[0], reverse=True)
    return [article for _, article in scored[:limit]]


def fetch_and_parse_feeds():
    all_articles = []

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }

    seen = set()

    for source_name, feed_url in FEEDS.items():
        print(f"Fetching RSS feed from: {source_name} ({feed_url})...")
        try:
            response = requests.get(feed_url, headers=headers, timeout=10)
            feed = feedparser.parse(response.content)

            if feed.entries:
                for entry in feed.entries[:15]:
                    title = entry.get('title', 'No Title')
                    link = entry.get('link', '#')
                    summary = entry.get('summary', entry.get('description', 'No summary available.'))[:200]
                    published = entry.get('published', entry.get('updated', ''))
                    digest = generate_hash(title, link)
                    if digest in seen:
                        continue
                    seen.add(digest)
                    all_articles.append({
                        'source': source_name,
                        'title': title,
                        'link': link,
                        'summary': summary,
                        'published': published,
                        'hash': digest,
                    })
            else:
                print(f"Warning: Failed to parse feed for {source_name}")

        except Exception as e:
            print(f"Error fetching {source_name}: {e}")

    return rank_articles(all_articles)
