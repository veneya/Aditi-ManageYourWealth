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

def generate_hash(title, link):
    """Generates a unique SHA-256 hash for deduplication."""
    content = f"{title}{link}"
    return hashlib.sha256(content.encode('utf-8')).hexdigest()

def fetch_and_parse_feeds():
    all_articles = []
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }

    for source_name, feed_url in FEEDS.items():
        print(f"Fetching RSS feed from: {source_name} ({feed_url})...")
        try:
            response = requests.get(feed_url, headers=headers, timeout=10)
            feed = feedparser.parse(response.content)

            if feed.entries:
                for entry in feed.entries[:5]:
                    title = entry.get('title', 'No Title')
                    link = entry.get('link', '#')
                    summary = entry.get('summary', entry.get('description', 'No summary available.'))
                    
                    all_articles.append({
                        'source': source_name,
                        'title': title,
                        'link': link,
                        'summary': summary[:200],
                        'hash': generate_hash(title, link)
                    })
            else:
                print(f"Warning: Failed to parse feed for {source_name}")

        except Exception as e:
            print(f"Error fetching {source_name}: {e}")

    return all_articles
