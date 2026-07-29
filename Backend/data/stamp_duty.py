# data/stamp_duty.py
# State-wise Stamp Duty Rates (2026)
# Sources: State Revenue Department websites
# Verified: 2026-07-26

STAMP_DUTY_RATES = {
    "Delhi": {"men": 6.0, "women": 4.0, "concession": 2.0},
    "Uttar Pradesh": {"men": 7.0, "women": 6.0, "concession": 1.0},
    "Maharashtra": {"men": 5.0, "women": 4.0, "concession": 1.0},
    "Karnataka": {"men": 5.0, "women": 5.0, "concession": 0.0},
    "Tamil Nadu": {"men": 7.0, "women": 7.0, "concession": 0.0},
    "Haryana": {"men": 7.0, "women": 5.0, "concession": 2.0},
    "Rajasthan": {"men": 5.0, "women": 4.0, "concession": 1.0},
    "Gujarat": {"men": 4.9, "women": 4.9, "concession": 0.0},
    "Punjab": {"men": 6.0, "women": 5.0, "concession": 1.0},
    "Himachal Pradesh": {"men": 6.0, "women": 4.0, "concession": 2.0}
}

STAMP_DUTY_STATES = list(STAMP_DUTY_RATES.keys())

STAMP_DUTY_SOURCES = {
    "notes": "State-wise rates collected from respective state revenue departments",
    "verified": "2026-07-26"
}