# utils/tax_calculator.py

from data.tax_data import NEW_REGIME_SLABS, OLD_REGIME_SLABS, NEW_REGIME_DEDUCTIONS, OLD_REGIME_DEDUCTIONS

def calculate_tax(income, slabs):
    """
    Calculate tax based on income and slab rates.
    
    Args:
        income (float): Taxable income
        slabs (list): List of tuples (lower, upper, rate%)
    
    Returns:
        float: Total tax amount
    """
    tax = 0
    for lower, upper, rate in slabs:
        if income > lower:
            taxable = min(income, upper) - lower
            if taxable > 0:
                tax += taxable * rate / 100
    return tax

def calculate_tax_comparison(income, deduction_80c=0, deduction_80d=0, has_standard_deduction=True):
    """
    Calculate tax under both regimes and compare.
    
    Args:
        income (float): Annual income
        deduction_80c (float): 80C deductions (max 1.5L)
        deduction_80d (float): 80D deductions (health insurance)
        has_standard_deduction (bool): Whether standard deduction applies
    
    Returns:
        dict: {
            "old_regime_tax": float,
            "new_regime_tax": float,
            "savings": float,
            "recommendation": str,
            "old_taxable_income": float,
            "new_taxable_income": float
        }
    """
    # Old Regime Calculation
    old_income = income
    if has_standard_deduction:
        old_income -= OLD_REGIME_DEDUCTIONS["standard_deduction"]
    old_income -= deduction_80c
    old_income -= deduction_80d
    old_income = max(0, old_income)
    
    old_tax = calculate_tax(old_income, OLD_REGIME_SLABS)
    
    # Apply rebate for Old Regime
    if old_income <= OLD_REGIME_DEDUCTIONS["rebate_limit"]:
        old_tax = max(0, old_tax - OLD_REGIME_DEDUCTIONS["rebate_amount"])
    
    # New Regime Calculation
    new_income = income
    if has_standard_deduction:
        new_income -= NEW_REGIME_DEDUCTIONS["standard_deduction"]
    new_income = max(0, new_income)
    
    new_tax = calculate_tax(new_income, NEW_REGIME_SLABS)
    
    # Apply rebate for New Regime
    if new_income <= NEW_REGIME_DEDUCTIONS["rebate_limit"]:
        new_tax = max(0, new_tax - NEW_REGIME_DEDUCTIONS["rebate_amount"])
    
    # Determine recommendation
    savings = old_tax - new_tax
    if savings > 0:
        recommendation = "New Regime"
    elif savings < 0:
        recommendation = "Old Regime"
    else:
        recommendation = "Both Equal"
    
    return {
        "old_regime_tax": old_tax,
        "new_regime_tax": new_tax,
        "savings": abs(savings),
        "recommendation": recommendation,
        "old_taxable_income": old_income,
        "new_taxable_income": new_income
    }