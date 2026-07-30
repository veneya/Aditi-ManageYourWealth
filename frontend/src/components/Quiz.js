// frontend/src/components/Quiz.js

import React, { useState } from 'react';
import toast from 'react-hot-toast';

const questions = [
  {
    id: 1,
    question: 'What does EMI stand for?',
    options: ['Equated Monthly Installment', 'Expected Monthly Income', 'Easy Money Installment'],
    correct: 0,
    explanation: 'EMI stands for Equated Monthly Installment — the fixed amount you pay to the bank every month until your loan is fully repaid.'
  },
  {
    id: 2,
    question: 'Which tax regime has lower rates but no deductions?',
    options: ['Old Regime', 'New Regime', 'Both are same'],
    correct: 1,
    explanation: 'The New Tax Regime has lower tax rates but does not allow most deductions (like 80C, 80D). The Old Regime has higher rates but allows deductions.'
  },
  {
    id: 3,
    question: 'What is the maximum deduction under Section 80C?',
    options: ['₹50,000', '₹1,00,000', '₹1,50,000'],
    correct: 2,
    explanation: 'Section 80C allows a maximum deduction of ₹1,50,000 per year for investments like PPF, ELSS, life insurance, and home loan principal repayment.'
  },
  {
    id: 4,
    question: 'Which scheme offers tax-free interest for daughters\' education?',
    options: ['PMAY', 'Sukanya Samriddhi', 'Atal Pension'],
    correct: 1,
    explanation: 'Sukanya Samriddhi Yojana is a government savings scheme for girl children. It offers high interest rates (8.2%) that are completely tax-free.'
  },
  {
    id: 5,
    question: 'What is stamp duty?',
    options: ['Tax on property registration', 'Tax on income', 'Tax on investments'],
    correct: 0,
    explanation: 'Stamp duty is a tax paid to the government when registering a property. Women get a 1-2% concession in many Indian states.'
  },
  {
    id: 6,
    question: 'What is CLSS?',
    options: ['Credit Linked Subsidy Scheme', 'Central Loan Support System', 'Cash Loan Security Scheme'],
    correct: 0,
    explanation: 'CLSS stands for Credit Linked Subsidy Scheme. Under PMAY, the government pays part of your home loan interest to reduce your EMI.'
  },
  {
    id: 7,
    question: 'Who is a nominee?',
    options: ['The person who gets your money if something happens to you', 'The bank manager', 'The tax officer'],
    correct: 0,
    explanation: 'A nominee is the trusted person who receives your money, property, or insurance if something happens to you. Always update your nominee after major life changes.'
  },
  {
    id: 8,
    question: 'What is the interest rate on Sukanya Samriddhi Yojana?',
    options: ['6.5%', '8.2%', '10%'],
    correct: 1,
    explanation: 'Sukanya Samriddhi Yojana currently offers 8.2% interest per year, compounded annually. The interest is completely tax-free under Section 80C.'
  },
];

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanations, setShowExplanations] = useState(false);

  const handleAnswer = (questionId, optionIndex) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionIndex });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correct) correct++;
    });
    setScore(correct);
    setShowResults(true);
    setShowExplanations(true);
    toast.success(`You scored ${correct} out of ${questions.length}!`);
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentQuestion(0);
    setShowResults(false);
    setShowExplanations(false);
    setScore(0);
  };

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Your Results</h2>
          <div className="text-6xl font-bold text-teal-600 mb-2">{score}/{questions.length}</div>
          <p className="text-gray-600">
            {score === questions.length ? '🌟 Perfect score! You\'re a financial literacy champion!' :
             score >= questions.length / 2 ? '👍 Good job! Keep learning with ADITI.' :
             '📚 Keep exploring ADITI to improve your financial knowledge!'}
          </p>
          <button onClick={handleRestart} className="btn-primary mt-6">
            🔄 Retake Quiz
          </button>
        </div>

        {/* Detailed Results with Explanations */}
        {showExplanations && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 text-lg">📝 Detailed Review</h3>
            {questions.map((q, idx) => {
              const selected = selectedAnswers[q.id];
              const isCorrect = selected === q.correct;
              return (
                <div key={q.id} className={`card p-4 border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                  <div className="flex items-start gap-3">
                    <span className={`text-lg ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                      {isCorrect ? '✅' : '❌'}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Q{idx + 1}: {q.question}</p>
                      <div className="mt-1 text-sm">
                        <span className="text-gray-500">Your answer: </span>
                        <span className={isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                          {selected !== undefined ? q.options[selected] : 'Not answered'}
                        </span>
                        {!isCorrect && (
                          <span className="text-gray-500 ml-2">
                            Correct: <span className="text-green-600 font-medium">{q.options[q.correct]}</span>
                          </span>
                        )}
                      </div>
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                        <span className="font-medium text-gray-700">💡 Explanation:</span> {q.explanation}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const q = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">🧠 Financial Literacy Quiz</h2>
      <p className="text-gray-500 mb-6">Test your knowledge of financial terms and schemes.</p>

      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">Question {currentQuestion + 1} of {questions.length}</span>
          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>

        <h3 className="text-lg font-medium text-gray-900 mb-4">{q.question}</h3>

        <div className="space-y-3">
          {q.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(q.id, idx)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                selectedAnswers[q.id] === idx
                  ? 'border-teal-500 bg-teal-50 text-teal-700'
                  : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50/50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="btn-outline disabled:opacity-50"
          >
            ← Previous
          </button>
          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="btn-primary"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn-primary"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quiz;