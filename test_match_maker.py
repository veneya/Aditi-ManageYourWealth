# test_match_maker.py

from data.schemes import SCHEMES
from utils.scheme_matcher import match_schemes

# Test profiles
test_users = [
    {
        "name": "Young Professional",
        "age": 25,
        "income": 450000,
        "has_house": False,
        "wants_business": False,
        "has_daughter": False,
        "is_woman": True,
        "marital_status": "Single"
    },
    {
        "name": "Single Mother",
        "age": 32,
        "income": 350000,
        "has_house": False,
        "wants_business": True,
        "has_daughter": True,
        "is_woman": True,
        "marital_status": "Divorced"
    },
    {
        "name": "Woman Entrepreneur",
        "age": 40,
        "income": 500000,
        "has_house": True,
        "wants_business": True,
        "has_daughter": False,
        "is_woman": True,
        "marital_status": "Married"
    },
    {
        "name": "Senior Citizen",
        "age": 62,
        "income": 200000,
        "has_house": True,
        "wants_business": False,
        "has_daughter": False,
        "is_woman": True,
        "marital_status": "Widowed"
    }
]

print("=" * 60)
print("🔍 ADITI Match Maker Test")
print("=" * 60)

for user in test_users:
    print(f"\n📋 Profile: {user['name']}")
    print(f"   Age: {user['age']}, Income: ₹{user['income']:,}")
    print(f"   Has House: {user['has_house']}, Wants Business: {user['wants_business']}")
    print(f"   Has Daughter: {user['has_daughter']}")
    
    matched = match_schemes(user)
    
    if matched:
        print(f"   ✅ Matched {len(matched)} schemes:")
        for scheme in matched:
            print(f"      - {scheme['badge']} {scheme['name']}")
            print(f"        💰 {scheme['benefit']}")
    else:
        print("   ❌ No schemes matched")
    
    print("-" * 40)