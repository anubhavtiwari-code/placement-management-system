import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AIBot = ({ isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am the NexusPlace AI Assistant. How can I help you today? You can ask me about applying to jobs, updating your profile, or navigating the platform.' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getResponse = (query) => {
    const q = query.toLowerCase();
    if (q.includes('apply') || q.includes('jobs')) {
      return "To apply to jobs, make sure you are logged in as a student. Navigate to your Student Dashboard, search for available Job Drives, and click 'Apply'.";
    }
    if (q.includes('profile') || q.includes('resume')) {
      return "You can update your profile and resume by going to your Student Profile from the navbar. Ensure your details are up to date for better skill matching!";
    }
    if (q.includes('company') || q.includes('admin')) {
      return "Companies can post job drives and filter students. Admins manage the platform. If you have any specific query regarding this, please reach out to admin support.";
    }
    if (q.includes('hello') || q.includes('hi')) {
      return "Hello there! How can I assist you with NexusPlace today?";
    }
    return "I am still an MVP and might not understand complex queries. Could you try asking about jobs, profile, or platform usage in simpler terms?";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    
    // Simulate AI thinking and response
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: getResponse(input) }]);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="absolute right-4 top-16 w-80 sm:w-96 bg-slate-900 border border-brand-500/30 rounded-xl shadow-2xl flex flex-col overflow-hidden z-50 text-base"
        >
          {/* Header */}
          <div className="flex justify-between items-center bg-slate-950 p-4 border-b border-brand-500/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-lg">🤖</div>
              <h3 className="text-white font-bold font-heading">Nexus AI Bot</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto max-h-80 flex flex-col gap-3 bg-slate-900">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`max-w-[85%] p-3 rounded-lg text-sm ${
                  msg.sender === 'user' 
                  ? 'bg-brand-600 text-white self-end rounded-tr-none' 
                  : 'bg-slate-800 text-slate-200 self-start rounded-tl-none border border-slate-700'
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-slate-950 border-t border-brand-500/20 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me something..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500"
            />
            <button
              onClick={handleSend}
              className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors"
            >
              Send
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIBot;
