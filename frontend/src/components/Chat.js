// frontend/src/components/Chat.js

import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function Chat() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I\'m ADITI. Ask me about any scheme eligibility, documents, or how to apply!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/api/chat`, { message: userMessage });
      if (response.data) {
        const source = response.data.source === 'ai' ? '🧠 AI' : '📚 Rule';
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response.data.reply,
          source: source
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: 'Sorry, I\'m having trouble connecting. Please try again later.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-warm p-4 grain relative">
      <h3 className="font-serif text-plum text-lg mb-3">💬 Ask ADITI</h3>
      <p className="text-xs text-muted-foreground mb-3">Your personal scheme assistant</p>
      
      <div className="space-y-2 max-h-80 overflow-y-auto mb-3 pr-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-plum text-cream' 
                : 'bg-cream border border-plum/10'
            }`}>
              <p className="text-sm">{msg.text}</p>
              {msg.source && (
                <span className="text-[10px] opacity-70 mt-1 block">{msg.source}</span>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-cream border border-plum/10 p-3 rounded-lg">
              <span className="text-sm text-muted-foreground">Typing...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about schemes..."
          className="flex-1 px-4 py-2 rounded-full border border-plum/10 bg-cream/50 focus:outline-none focus:ring-2 focus:ring-plum/30 text-sm"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-marigold px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;