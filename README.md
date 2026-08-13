# ADITI  
**Aspire · Discover · Independence · Transform · Insights**

## 📌 What is ADITI?

**ADITI** is a financial empowerment platform for women in India. It helps users discover government schemes they qualify for, calculate financial benefits, track investments, and build financial literacy — all in plain English.

The platform addresses two critical moments in a woman’s financial journey:

- **Starting your first job** — understanding taxes, savings, and investments  
- **Starting over** — navigating financial independence after divorce, widowhood, or career breaks

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔐 **Firebase Authentication** | Email/Password + Google Sign-In for secure access |
| 🎯 **Match Maker** | 11-question quiz that matches users to 13+ government schemes |
| 💼 **Wealth Manager** | Track investments and calculate expected returns/profits |
| 🧮 **4 Calculators** | Tax Comparator, Stamp Duty Savings, PMAY Subsidy, FD Returns |
| 🧠 **Financial Literacy Quiz** | 8 questions with explanations for right/wrong answers |
| 💬 **AI Chatbot (Ask ADITI)** | Ask financial questions in plain English |
| 📰 **Live News Feed** | Auto-scrolling updates from PIB, RBI, and Finshots |
| 📬 **Email Subscription** | Weekly scheme updates and deadline reminders |

---

## 🔗 Live Demo

- **Frontend:** https://aditi-manage-your-wealth.vercel.app/

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Tailwind CSS |
| Backend | FastAPI (Python) |
| AI Engine | Groq API + Llama 3.3 70B |
| Authentication | Firebase Auth (Email/Password + Google) |
| Database | Supabase + SQLite |
| External Data | PIB / RBI / Finshots RSS Feeds |
| Package Manager | pnpm |
| Deployment | Vercel (Frontend), Render (Backend) |

---

## 📂 Repository Language Composition

- **Python:** 49.9%  
- **JavaScript:** 42.2%  
- **HTML:** 7.9%

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- pnpm or npm

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend
pnpm install  # or npm install
pnpm start    # or npm start
```

---

## 🌟 Vision

ADITI aims to bridge the financial knowledge gap by making government benefits, investment planning, and money management simple, accessible, and actionable for every woman.

---

## 🤝 Contributing

Contributions, ideas, and feature suggestions are welcome!  
Please open an issue or submit a pull request.

---

## 📄 License

Add your preferred license here (for example, MIT License).
