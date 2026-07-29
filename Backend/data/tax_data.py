# data/tax_data.py
# FY 2026-27 Tax Slabs (Assessment Year 2027-28)
# Source: Income Tax Department, Government of India | Finance Act 2025
# Verified: 2026-07-26

# ============================================
# NEW TAX REGIME (Section 115BAC) - Default
# ============================================

NEW_REGIME_SLABS = [
    (0, 400000, 0),      # (Lower, Upper, Rate%)
    (400000, 800000, 5),
    (800000, 1200000, 10),
    (1200000, 1600000, 15),
    (1600000, 2000000, 20),
    (2000000, 2400000, 25),
    (2400000, float('inf'), 30)
]

NEW_REGIME_DEDUCTIONS = {
    "standard_deduction": 75000,
    "rebate_limit": 1200000,
    "rebate_amount": 60000,      # UPDATED: ₹60,000 (not ₹25,000)
    "notes": "Rebate under Section 87A. Income up to ₹12L effectively tax-free."
}

# ============================================
# OLD TAX REGIME (With Deductions)
# ============================================

OLD_REGIME_SLABS = [
    (0, 250000, 0),
    (250000, 500000, 5),
    (500000, 1000000, 20),
    (1000000, float('inf'), 30)
]

OLD_REGIME_DEDUCTIONS = {
    "standard_deduction": 50000,
    "section_80c": 150000,
    "section_80d": 25000,
    "section_80d_senior": 50000,
    "rebate_limit": 500000,
    "rebate_amount": 25000,
    "notes": "Old regime allows multiple deductions."
}

# ============================================
# SUMMARY (For Display)
# ============================================

TAX_SUMMARY = {
    "new_regime": {
        "name": "New Tax Regime",
        "description": "Lower rates, fewer deductions. Default regime.",
        "key_benefits": [
            "₹75,000 standard deduction for salaried",
            "₹12L rebate limit → ₹60,000 rebate → effectively tax-free up to ₹12L",
            "No need to track investment proofs"
        ]
    },
    "old_regime": {
        "name": "Old Tax Regime",
        "description": "Higher rates, but many deductions available.",
        "key_benefits": [
            "₹50,000 standard deduction for salaried",
            "Section 80C: Up to ₹1.5L deduction",
            "Section 80D: Up to ₹25K (self/family), ₹50K (senior citizen parents)"
        ]
    }
}

TAX_SOURCES = {
    "url": "https://incometaxindia.gov.in",
    "document": "Finance Act 2025",
    "verified": "2026-07-26"
}