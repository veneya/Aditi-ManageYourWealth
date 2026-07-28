# utils/scheme_matcher.py

from data.schemes import SCHEMES

def match_schemes(user_profile):
    """
    Match user profile to eligible schemes.
    
    Args:
        user_profile (dict): {
            "age": int,
            "income": float,
            "has_house": bool,
            "wants_business": bool,
            "has_daughter": bool,
            "is_woman": bool,
            "marital_status": str
        }
    
    Returns:
        list: List of matched scheme dictionaries
    """
    matched = []
    
    for scheme in SCHEMES:
        eligibility = scheme["eligibility"]
        is_eligible = True
        
        # Check age
        if "age_min" in eligibility and user_profile.get("age", 0) < eligibility["age_min"]:
            is_eligible = False
        if "age_max" in eligibility and user_profile.get("age", 0) > eligibility["age_max"]:
            is_eligible = False
        
        # Check income
        if "income_max" in eligibility and user_profile.get("income", 9999999) > eligibility["income_max"]:
            is_eligible = False
        
        # Check house ownership
        if eligibility.get("no_house") and user_profile.get("has_house", True):
            is_eligible = False
        
        # Check business interest
        if eligibility.get("wants_business") and not user_profile.get("wants_business", False):
            is_eligible = False
        
        # Check daughter
        if eligibility.get("has_daughter") and not user_profile.get("has_daughter", False):
            is_eligible = False
        
        # Check if for women
        if eligibility.get("for_women") and not user_profile.get("is_woman", True):
            is_eligible = False
        
        if is_eligible:
            matched.append(scheme)
    
    return matched

def get_scheme_by_id(scheme_id):
    """Get scheme details by ID."""
    for scheme in SCHEMES:
        if scheme["id"] == scheme_id:
            return scheme
    return None

def get_schemes_by_category(category):
    """Get all schemes in a category."""
    return [s for s in SCHEMES if s["category"] == category]

def get_all_categories():
    """Get all unique scheme categories."""
    return list(set([s["category"] for s in SCHEMES]))