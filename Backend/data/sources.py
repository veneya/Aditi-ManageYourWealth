# data/sources.py
# Data Source Documentation
# All sources verified and cited for transparency

DATA_SOURCES = {
    "tax_slabs": {
        "source": "Income Tax Department, Government of India",
        "url": "https://incometaxindia.gov.in",
        "document": "Finance Act 2025",
        "verified_date": "2026-07-26"
    },
    "stamp_duty": {
        "source": "State Revenue Departments",
        "url": "https://www.stampregistration.gov.in",
        "verified_date": "2026-07-26"
    },
    "pmay": {
        "source": "Ministry of Housing and Urban Affairs",
        "url": "https://pmay-urban.gov.in",
        "document": "PMAY-U 2.0 Operational Guidelines",
        "verified_date": "2026-07-26"
    },
    "schemes": {
        "source": "PIB, Ministry websites",
        "url": "https://www.myscheme.gov.in",
        "verified_date": "2026-07-26"
    }
}

def get_all_sources():
    return DATA_SOURCES