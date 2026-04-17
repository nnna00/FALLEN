
import React, { useState } from 'react';
import { Sparkles, Send, X } from 'lucide-react';
import { consultOracle } from '../services/geminiService';
import { playSfx } from '../services/audioService';

interface OracleChatProps {
  userFactionId: string | null;
}

export const OracleChat: React.FC<OracleChatProps> = ({ userFactionId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([
    { role: 'ai', text: "虚空在注视着你。有什么想问的吗，迷途的灵魂？" }
  ]);

  const toggleChat = () => {
      playSfx('click');
      setIsOpen(!isOpen);
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    playSfx('click');
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const answer = await consultOracle(userMsg, userFactionId);
    
    playSfx('hover'); // Sound on receive
    setMessages(prev => [...prev, { role: 'ai', text: answer }]);
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={toggleChat}
        onMouseEnter={() => playSfx('hover')}
        className="absolute bottom-6 right-6 z-40 bg-black/80 border border-purple-900/50 text-purple-300 p-4 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:bg-purple-900/20 hover:scale-105 transition-all group flex items-center gap-2"
      >
        <Sparkles size={20} className="group-hover:animate-pulse" />
        <span className="font-serif text-sm tracking-widest hidden md:inline">聆听低语</span>
      </button>
    );
  }

  return (
    <div className="absolute bottom-6 right-6 z-40 w-80 md:w-96 bg-black/95 border border-purple-900/30 rounded-lg shadow-2xl flex flex-col max-h-[500px] overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="p-3 border-b border-gray-800 flex justify-between items-center bg-[#0a0a0a]">
        <div className="flex items-center gap-2 text-purple-400">
            <Sparkles size={16} />
            <h3 className="text-sm font-cinzel tracking-widest">Oracle of the Void</h3>
        </div>
        <button onClick={toggleChat} className="text-gray-500 hover:text-white">
            <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]">
        {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] text-sm font-serif leading-relaxed p-3 rounded-sm ${
                    msg.role === 'user' 
                    ? 'bg-gray-800 text-gray-200 border border-gray-700' 
                    : 'bg-purple-900/10 text-purple-200 border border-purple-900/30 shadow-[0_0_10px_rgba(168,85,247,0.1)]'
                }`}>
                    {msg.text}
                </div>
            </div>
        ))}
        {loading && (
             <div className="flex justify-start">
                <div className="bg-purple-900/10 text-purple-300 p-3 text-xs italic">
                    低语正在传来...
                </div>
             </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-800 bg-[#0a0a0a] flex gap-2">
        <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="向虚空提问..."
            className="flex-grow bg-black border border-gray-800 text-gray-300 text-sm px-3 py-2 focus:outline-none focus:border-purple-800 font-serif"
        />
        <button 
            onClick={handleSend}
            disabled={loading}
            className="text-gray-400 hover:text-purple-400 disabled:opacity-50"
        >
            <Send size={18} />
        </button>
      </div>
    </div>
  );
};
