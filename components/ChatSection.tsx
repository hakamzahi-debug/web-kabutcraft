
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAI } from '../services/geminiService';
import { Message } from '../types';

export const ChatSection: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      const response = await chatWithAI(history, input);
      setMessages(prev => [...prev, { role: 'model', text: response || 'No response' }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: 'Error connecting to the AI Crew. Try again later!' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 border-2 border-black bg-white mb-4"
      >
        {messages.length === 0 && (
          <p className="text-gray-500 italic text-center">Start a chat with the AI!</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[80%] p-3 border-2 border-black font-bold
              ${m.role === 'user' ? 'bg-[#7ae0ff] neobrutalism-shadow' : 'bg-[#a3ffcc] neobrutalism-shadow'}
            `}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-black font-bold animate-pulse italic">Thinking...</div>}
      </div>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Say something..."
          className="flex-1 p-3 border-2 border-black font-bold focus:outline-none"
        />
        <button 
          onClick={handleSend}
          className="bg-black text-white px-6 font-bold border-2 border-black hover:bg-gray-800"
        >
          Send
        </button>
      </div>
    </div>
  );
};
