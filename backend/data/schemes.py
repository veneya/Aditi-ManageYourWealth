# data/schemes.py
# Government Schemes for Women
# Sources: PIB, Ministry websites, PMAY official portal
# Verified: 2026-07-26

SCHEMES = [
    {
        "id": "pmay",
        "name": "Pradhan Mantri Awas Yojana - Urban 2.0",
        "category": "Housing",
        "badge": "🏠",
        "description": "Interest subsidy on home loans for urban families.",
        "benefit": "4% interest subsidy up to ₹1,80,000",
        "eligibility": {
            "age_min": 18,
            "age_max": 65,
            "income_max": 900000,
            "no_house": True,
            "for_women": True
        },
        "problem_solved": "Home loans are expensive. PMAY-U 2.0 reduces your EMI through interest subsidy.",
        "jargon": [
            {"term": "ISS", "meaning": "Interest Subsidy Scheme. The government pays part of your home loan interest."},
            {"term": "EMI", "meaning": "The fixed monthly payment you make to the bank."}
        ],
        "how_to_apply": [
            "Check eligibility on pmay-urban.gov.in",
            "Visit a bank with Aadhaar and income proof.",
            "Fill loan application and mention ISS subsidy."
        ],
        "source": "Ministry of Housing and Urban Affairs, Government of India"
    },
    {
        "id": "mudra",
        "name": "Mudra Loan (PMMY)",
        "category": "Business",
        "badge": "💼",
        "description": "Collateral-free loans for micro-enterprises.",
        "benefit": "Loan up to ₹20,00,000 at low interest.",
        "eligibility": {
            "age_min": 18,
            "age_max": 65,
            "income_max": 600000,
            "wants_business": True
        },
        "problem_solved": "Starting a business requires capital. Mudra provides loans without demanding collateral.",
        "jargon": [
            {"term": "Collateral", "meaning": "An asset you pledge to the bank. Mudra loans don't need any collateral."}
        ],
        "how_to_apply": [
            "Visit your nearest bank branch.",
            "Fill out the Mudra loan application form.",
            "Submit your business plan and KYC documents."
        ],
        "source": "Ministry of Finance, Government of India"
    },
    {
        "id": "pmegp",
        "name": "PMEGP",
        "category": "Business",
        "badge": "🏭",
        "description": "Prime Minister's Employment Generation Programme.",
        "benefit": "35% subsidy for women entrepreneurs.",
        "eligibility": {
            "age_min": 18,
            "income_max": 600000,
            "wants_business": True,
            "for_women": True
        },
        "problem_solved": "New businesses need funding. PMEGP gives a subsidy to cover part of your project cost.",
        "jargon": [
            {"term": "Subsidy", "meaning": "Money given by the government to help you start your business."},
            {"term": "Margin Money", "meaning": "The part of the project cost you need to arrange yourself."}
        ],
        "how_to_apply": [
            "Visit the KVIC or DIC office near you.",
            "Submit your project proposal.",
            "Get your project approved and receive the subsidy."
        ],
        "source": "Ministry of MSME, Government of India"
    },
    {
        "id": "standup",
        "name": "Stand-Up India",
        "category": "Business",
        "badge": "🚀",
        "description": "Loans for SC/ST and women entrepreneurs.",
        "benefit": "Loan between ₹10,00,000 to ₹1,00,00,000.",
        "eligibility": {
            "age_min": 18,
            "age_max": 65,
            "wants_business": True,
            "for_women": True
        },
        "problem_solved": "Women entrepreneurs need big loans too. Stand-Up India provides loans up to ₹1 Crore.",
        "jargon": [
            {"term": "SC", "meaning": "Scheduled Caste."},
            {"term": "ST", "meaning": "Scheduled Tribe."},
            {"term": "Greenfield Project", "meaning": "A completely new business venture."}
        ],
        "how_to_apply": [
            "Apply through any bank branch.",
            "Submit your business plan and loan application.",
            "Get the loan sanctioned and start your business."
        ],
        "source": "Ministry of Finance, Government of India"
    },
    {
        "id": "sukanya",
        "name": "Sukanya Samriddhi Yojana",
        "category": "Savings",
        "badge": "👧",
        "description": "Savings scheme for daughters' education and marriage.",
        "benefit": "8.2% interest, completely tax-free.",
        "eligibility": {
            "age_min": 18,
            "age_max": 60,
            "has_daughter": True
        },
        "problem_solved": "Daughters' education is expensive. This scheme helps you save with high, tax-free interest.",
        "jargon": [
            {"term": "Tax-Free", "meaning": "You don't pay any tax on the interest you earn."},
            {"term": "Compounding", "meaning": "Interest earned on previous interest. Your money grows faster."}
        ],
        "how_to_apply": [
            "Visit any post office or bank branch.",
            "Open an account in your daughter's name.",
            "Start depositing money regularly (minimum ₹250/year)."
        ],
        "source": "India Post, Department of Posts"
    },
    {
        "id": "apy",
        "name": "Atal Pension Yojana",
        "category": "Pension",
        "badge": "👵",
        "description": "Pension scheme for unorganized workers.",
        "benefit": "₹1,000 to ₹5,000 monthly pension after 60.",
        "eligibility": {
            "age_min": 18,
            "age_max": 40,
            "income_max": 500000
        },
        "problem_solved": "No pension after retirement? This scheme gives you a guaranteed monthly income.",
        "jargon": [
            {"term": "Pension", "meaning": "Monthly income you get after you retire."},
            {"term": "Unorganized Workers", "meaning": "Workers without formal jobs or employer-provided benefits."}
        ],
        "how_to_apply": [
            "Visit any bank branch.",
            "Fill out the APY application form.",
            "Start making monthly contributions."
        ],
        "source": "PFRDA"
    },
    {
        "id": "pmjjby",
        "name": "PMJJBY (Life Insurance)",
        "category": "Insurance",
        "badge": "🛡️",
        "description": "Life insurance for individuals.",
        "benefit": "₹2,00,000 life insurance at just ₹436/year.",
        "eligibility": {
            "age_min": 18,
            "age_max": 50
        },
        "problem_solved": "Your family needs financial protection. PMJJBY gives life insurance at a very low cost.",
        "jargon": [
            {"term": "Premium", "meaning": "The amount you pay for insurance."},
            {"term": "Nominee", "meaning": "The person who gets the insurance money."}
        ],
        "how_to_apply": [
            "Visit any bank branch.",
            "Fill out the PMJJBY application form.",
            "The premium will be auto-debited from your bank account."
        ],
        "source": "IRDAI, Ministry of Finance"
    },
    {
        "id": "pmsby",
        "name": "PMSBY (Accident Insurance)",
        "category": "Insurance",
        "badge": "🛡️",
        "description": "Accident insurance for individuals.",
        "benefit": "₹2,00,000 accident insurance at just ₹20/year.",
        "eligibility": {
            "age_min": 18,
            "age_max": 70
        },
        "problem_solved": "Accidents can happen anytime. PMSBY gives accident insurance at a very low cost.",
        "jargon": [
            {"term": "Premium", "meaning": "The amount you pay for insurance."},
            {"term": "Nominee", "meaning": "The person who gets the insurance money."}
        ],
        "how_to_apply": [
            "Visit any bank branch.",
            "Fill out the PMSBY application form.",
            "The premium will be auto-debited from your bank account."
        ],
        "source": "IRDAI, Ministry of Finance"
    },
    {
        "id": "yashasvini",
        "name": "Yashasvini Campaign",
        "category": "Entrepreneurship",
        "badge": "💪",
        "description": "Campaign to empower women entrepreneurs.",
        "benefit": "Scheme awareness and support for women.",
        "eligibility": {
            "wants_business": True,
            "for_women": True
        },
        "problem_solved": "Women entrepreneurs don't know about available schemes. Yashasvini spreads awareness.",
        "jargon": [
            {"term": "Awareness", "meaning": "Knowing about something. Yashasvini helps women know about government schemes."}
        ],
        "how_to_apply": [
            "Visit the Yashasvini campaign website.",
            "Register to get updates about schemes.",
            "Attend workshops and training programs."
        ],
        "source": "Ministry of MSME, Government of India"
    },
    {
        "id": "state_scheme",
        "name": "State Scheme (e.g., Gruha Lakshmi)",
        "category": "Varies",
        "badge": "🏛️",
        "description": "State-specific welfare schemes for women.",
        "benefit": "Varies by state (direct cash transfer, subsidies, etc.)",
        "eligibility": {"is_woman": True},
        "problem_solved": "Every state has different schemes. ADITI helps you find them.",
        "jargon": [
            {"term": "State Scheme", "meaning": "A program run by your state government, not the central government."}
        ],
        "how_to_apply": [
            "Select your state from the dropdown.",
            "See all available schemes for your state.",
            "Apply directly through the official portal."
        ],
        "source": "Various state government websites"
    },
    {
        "id": "vishwakarma",
        "name": "PM Vishwakarma Yojana",
        "category": "Business",
        "badge": "🛠️",
        "description": "Support for traditional artisans and craftspeople across 18 family-based trades.",
        "benefit": "₹15,000 toolkit grant, ₹500/day training stipend, collateral-free loans up to ₹3 lakh at 5% interest.",
        "eligibility": {
            "age_min": 18,
            "wants_business": True
        },
        "problem_solved": "Traditional artisans and craftsmen — carpenters, blacksmiths, tailors, potters and others working with their hands — often lack capital and modern tools. PM Vishwakarma gives them recognition, training and affordable credit to grow.",
        "jargon": [
            {"term": "Collateral-free loan", "meaning": "A loan you can get without pledging any property or asset as security."},
            {"term": "Toolkit incentive", "meaning": "A one-time grant to help you buy modern tools for your trade."}
        ],
        "how_to_apply": [
            "Register at your nearest Common Service Centre (CSC).",
            "Complete skill verification for your trade.",
            "Receive your PM Vishwakarma certificate and ID card, then apply for training and loans."
        ],
        "source": "Ministry of Micro, Small and Medium Enterprises, Government of India"
    },
    {
        "id": "pmjay",
        "name": "Ayushman Bharat PM-JAY",
        "category": "Health",
        "badge": "🏥",
        "description": "Free, cashless health insurance for hospitalisation, covering the whole family.",
        "benefit": "₹5,00,000 cashless hospital coverage per family, per year, at empanelled hospitals.",
        "eligibility": {
            "age_min": 18,
            "income_max": 300000
        },
        "problem_solved": "A single hospitalisation can wipe out years of savings. PM-JAY removes that risk with free, cashless treatment at government and private hospitals nationwide.",
        "jargon": [
            {"term": "Cashless treatment", "meaning": "You don't pay the hospital directly — the government settles the bill with them."},
            {"term": "Empanelled hospital", "meaning": "A hospital officially registered to provide treatment under this scheme."}
        ],
        "how_to_apply": [
            "Check eligibility on the PM-JAY portal or Ayushman App using Aadhaar.",
            "Visit your nearest Common Service Centre or empanelled hospital's Ayushman kiosk.",
            "Complete e-KYC to get your Ayushman Card, then use it for cashless treatment."
        ],
        "source": "National Health Authority, Government of India"
    },
    {
        "id": "smile",
        "name": "SMILE Scheme (Garima Greh)",
        "category": "Welfare",
        "badge": "🏳️‍⚧️",
        "description": "Comprehensive rehabilitation, shelter, health, education and livelihood support for transgender persons.",
        "benefit": "Free shelter at Garima Greh homes, ₹5 lakh health cover for gender-affirming care under Ayushman Bharat TG Plus, scholarships, and skill training via PM-DAKSH.",
        "eligibility": {
            "age_min": 18,
            "for_transgender": True
        },
        "problem_solved": "Transgender persons often face family rejection, homelessness, and barriers to healthcare, education and jobs. SMILE brings shelter, medical care, schooling support and livelihood training together in one scheme.",
        "jargon": [
            {"term": "Garima Greh", "meaning": "A government-funded shelter home offering food, medical care and safety to transgender persons."},
            {"term": "Transgender Certificate", "meaning": "An official ID issued by the district magistrate confirming your transgender status — needed to access this scheme."}
        ],
        "how_to_apply": [
            "Obtain your Transgender Certificate and ID Card from the district magistrate's office (or via the National Portal for Transgender Persons).",
            "Locate your nearest Garima Greh or Implementing Agency through the SMILE portal.",
            "Register for the specific support you need — shelter, health cover, scholarship, or skill training."
        ],
        "source": "Ministry of Social Justice and Empowerment, Government of India"
    }
]

SCHEMES_SOURCES = {
    "url": "https://www.myscheme.gov.in",
    "verified": "2026-07-27"
}