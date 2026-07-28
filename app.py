# app.py

import streamlit as st
from data.schemes import SCHEMES
from utils.scheme_matcher import match_schemes

# ============================================
# PAGE CONFIGURATION
# ============================================

st.set_page_config(
    page_title="ADITI - Match Maker",
    page_icon="🌺",
    layout="wide"
)

# ============================================
# HEADER
# ============================================

st.markdown("""
<div style="text-align: center; padding: 20px 0;">
    <h1 style="color: #8B1A4A; font-size: 3rem;">🌺 ADITI</h1>
    <p style="color: #4a4a4a; font-size: 1.2rem;">Find government schemes you qualify for</p>
    <hr style="border: 1px solid #8B1A4A; width: 50%; margin: 0 auto;">
</div>
""", unsafe_allow_html=True)

# ============================================
# DISCLAIMER
# ============================================

st.sidebar.markdown("""
---
⚠️ **Prototype Disclaimer**

This is a prototype built for demonstration.
All calculations are estimates. Consult official
sources for actual eligibility.
""")

# ============================================
# MATCH MAKER FORM
# ============================================

st.markdown("### 📝 Tell us about yourself")

with st.form("match_maker_form"):
    col1, col2 = st.columns(2)
    
    with col1:
        age = st.selectbox(
            "Your Age",
            ["18-25", "26-35", "36-45", "46-55", "56-65", "65+"]
        )
        marital_status = st.selectbox(
            "Marital Status",
            ["Single", "Married", "Divorced", "Widowed"]
        )
        income = st.selectbox(
            "Annual Household Income",
            ["Under ₹3L", "₹3-6L", "₹6-12L", "Above ₹12L"]
        )
    
    with col2:
        has_house = st.radio(
            "Do you own a house?",
            ["Yes", "No"]
        )
        wants_business = st.radio(
            "Planning to start a business?",
            ["Yes", "No"]
        )
        has_daughter = st.radio(
            "Have a daughter below 10 years?",
            ["Yes", "No"]
        )
    
    submitted = st.form_submit_button("🔍 Find Schemes for Me", use_container_width=True)

# ============================================
# RESULTS
# ============================================

if submitted:
    # Parse user answers
    age_map = {
        "18-25": 22,
        "26-35": 30,
        "36-45": 40,
        "46-55": 50,
        "56-65": 60,
        "65+": 70
    }
    
    income_map = {
        "Under ₹3L": 300000,
        "₹3-6L": 450000,
        "₹6-12L": 900000,
        "Above ₹12L": 1500000
    }
    
    user_profile = {
        "age": age_map[age],
        "marital_status": marital_status,
        "income": income_map[income],
        "has_house": has_house == "Yes",
        "wants_business": wants_business == "Yes",
        "has_daughter": has_daughter == "Yes",
        "is_woman": True
    }
    
    # Match schemes
    matched_schemes = match_schemes(user_profile)
    
    st.markdown("---")
    
    if matched_schemes:
        st.success(f"🎉 Great news! You qualify for {len(matched_schemes)} government schemes!")
        st.info(f"💡 Based on your profile, you're eligible for these schemes. Click each one to learn more.")
        
        st.markdown("---")
        
        # Display matched schemes as expandable cards
        for scheme in matched_schemes:
            with st.expander(f"{scheme['badge']} {scheme['name']}", expanded=False):
                # Category & Description
                st.markdown(f"**Category:** {scheme['category']}")
                st.markdown(f"**Description:** {scheme['description']}")
                
                # Benefit (Highlighted)
                st.markdown("---")
                st.success(f"💰 **Benefit:** {scheme['benefit']}")
                
                # What Problem Does This Solve?
                st.markdown("---")
                st.markdown("### 📖 What Problem Does This Solve?")
                st.markdown(f"*{scheme['problem_solved']}*")
                
                # Key Terms (Jargon Buster)
                if 'jargon' in scheme and scheme['jargon']:
                    st.markdown("---")
                    st.markdown("### 🔑 Key Terms Explained")
                    for term in scheme['jargon']:
                        st.markdown(f"**{term['term']}:** {term['meaning']}")
                
                # How to Apply
                if 'how_to_apply' in scheme:
                    st.markdown("---")
                    st.markdown("### 📋 How to Apply")
                    for step in scheme['how_to_apply']:
                        st.markdown(f"- {step}")
                
                # Source
                if 'source' in scheme:
                    st.markdown("---")
                    st.caption(f"📌 Source: {scheme['source']}")
    
    else:
        st.info("🤔 We didn't find any schemes matching your profile right now.")
        
        st.markdown("""
        ### 💡 Here are some schemes to explore:
        """)
        
        for scheme in SCHEMES[:4]:
            st.markdown(f"- {scheme['badge']} **{scheme['name']}** — {scheme['description'][:80]}...")

# ============================================
# FOOTER
# ============================================

st.markdown("---")
st.markdown("""
<div style="text-align: center; color: #777; font-size: 12px; padding: 20px 0;">
    🌺 ADITI — Find government schemes, understand them, and take action.<br>
    Built for the Women's Hackathon 2026
</div>
""", unsafe_allow_html=True)