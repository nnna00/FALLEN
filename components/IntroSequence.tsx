
import React, { useState } from 'react';
import { INTRO_QUESTIONS, INTRO_TEXTS, FACTIONS } from '../constants';
import { playSfx } from '../services/audioService';

interface IntroSequenceProps {
  onComplete: (factionId: string) => void;
}

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0); // 0-3: Texts, 4+: Questions
  const [opacity, setOpacity] = useState(1);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleAdvance = () => {
    if (isTransitioning) return;
    if (step >= INTRO_TEXTS.length) return; // Don't advance via click if we are in question mode
    
    playSfx('click');
    setIsTransitioning(true);
    setOpacity(0);
    
    setTimeout(() => {
        setStep(s => s + 1);
        setOpacity(1);
        setIsTransitioning(false);
    }, 800);
  };

  const handleOptionSelect = (points: Record<string, number>) => {
    if (isTransitioning) return;
    
    playSfx('click');
    const newScores = { ...scores };
    Object.entries(points).forEach(([faction, point]) => {
      newScores[faction] = (newScores[faction] || 0) + point;
    });
    setScores(newScores);

    setIsTransitioning(true);
    setOpacity(0);
    setTimeout(() => {
        setStep(s => s + 1);
        setOpacity(1);
        setIsTransitioning(false);
    }, 500);
  };

  const calculateResult = () => {
    let maxScore = -1;
    let selectedFaction = FACTIONS[0].id;
    
    Object.entries(scores).forEach(([faction, score]) => {
      const numScore = score as number;
      if (numScore > maxScore) {
        maxScore = numScore;
        selectedFaction = faction;
      }
    });
    return selectedFaction;
  };

  const currentQuestionIndex = step - INTRO_TEXTS.length;

  // Render Result
  if (currentQuestionIndex >= INTRO_QUESTIONS.length) {
    const resultFactionId = calculateResult();
    const faction = FACTIONS.find(f => f.id === resultFactionId)!;
    
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#050505] text-[#d4c5b0] p-8 animate-fade-in relative overflow-hidden">
        {/* Decorative Background Frame */}
        <div className="absolute inset-4 border-2 border-[#333] pointer-events-none"></div>
        <div className="absolute inset-6 border border-[#222] pointer-events-none"></div>

        <h2 className="text-2xl font-cinzel text-gray-500 mb-4 tracking-[0.3em] uppercase">命运裁定</h2>
        <div className="text-center max-w-lg z-10">
            <p className="text-lg text-gray-400 mb-2 italic font-serif">你的灵魂归属于...</p>
            <h1 className="text-5xl font-bold mb-6 tracking-widest text-transparent bg-clip-text bg-gradient-to-t from-[#888] to-[#fff]" style={{ textShadow: `0 0 20px ${faction.color}` }}>
                {faction.name}
            </h1>
            <div className="w-16 h-1 bg-gray-700 mx-auto mb-6"></div>
            <p className="italic text-[#a0a0a0] mb-12 font-serif text-xl leading-relaxed">"{faction.shortDesc}"</p>
            <button 
                onClick={() => onComplete(resultFactionId)}
                onMouseEnter={() => playSfx('hover')}
                className="px-10 py-4 border border-[#4a4a4a] bg-[#111] hover:bg-[#d4c5b0] hover:text-black hover:border-white transition-all duration-700 ease-out font-cinzel tracking-[0.2em] shadow-[0_0_15px_rgba(0,0,0,0.8)]"
            >
                进入世界
            </button>
        </div>
      </div>
    );
  }

  // Render Questions
  if (step >= INTRO_TEXTS.length) {
    const question = INTRO_QUESTIONS[currentQuestionIndex];
    return (
      <div className={`flex flex-col items-center justify-center h-screen bg-[#080808] text-[#d4c5b0] p-6 transition-opacity duration-700 ${opacity === 0 ? 'opacity-0' : 'opacity-100'}`}>
         {/* Cultist Sim Card Container Look */}
        <div className="max-w-2xl w-full bg-[#111] border border-[#333] p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
            {/* Card Corners */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#555]"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#555]"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#555]"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#555]"></div>

            <h3 className="text-xl md:text-2xl font-serif leading-relaxed mb-10 text-center text-[#eee]">
                {question.text}
            </h3>
            <div className="grid grid-cols-1 gap-4">
                {question.options.map((opt, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleOptionSelect(opt.factionPoints)}
                        onMouseEnter={() => playSfx('hover')}
                        className="p-5 border border-[#2a2a2a] bg-[#0c0c0c] hover:border-[#664444] hover:bg-[#1a1515] text-left transition-all duration-300 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-900/0 to-red-900/0 group-hover:from-red-900/10 group-hover:to-transparent transition-all duration-500"></div>
                        <span className="text-[#555] group-hover:text-red-400 mr-4 font-cinzel text-lg italic">{idx + 1}</span>
                        <span className="font-serif tracking-wide text-[#b0b0b0] group-hover:text-[#d4c5b0]">{opt.text}</span>
                    </button>
                ))}
            </div>
        </div>
      </div>
    );
  }

  // Render Intro Text
  return (
    <div 
        onClick={handleAdvance}
        className="flex items-center justify-center h-screen bg-black cursor-pointer select-none"
    >
      <div className="absolute bottom-10 text-gray-600 text-xs font-cinzel tracking-widest animate-pulse">
        [ 点击屏幕继续 ]
      </div>
      <h1 
        className={`text-2xl md:text-4xl font-serif text-[#e0e0e0] tracking-[0.15em] leading-relaxed transition-all duration-1000 text-center px-8 max-w-4xl`}
        style={{ opacity: opacity, textShadow: '0 0 10px rgba(255,255,255,0.2)' }}
      >
        {INTRO_TEXTS[step]}
      </h1>
    </div>
  );
};
