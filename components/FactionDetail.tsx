
import React, { useState, useEffect } from 'react';
import { Faction, Character } from '../types';
import { X, Crown, Camera, Edit2, BookOpen, Quote, Sword, Brain, Activity, Tag as TagIcon, Key, EyeOff, Plus } from 'lucide-react';
import { fileToBase64 } from '../services/dataService';
import { playSfx } from '../services/audioService';

interface FactionDetailProps {
  faction: Faction;
  isEditMode: boolean;
  onClose: () => void;
  onUpdate: (updatedFaction: Faction) => void;
}

export const FactionDetail: React.FC<FactionDetailProps> = ({ faction, isEditMode, onClose, onUpdate }) => {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  // -- Event Handlers --

  const handleSelectCharacter = (id: string) => {
      playSfx('click');
      setSelectedCharacterId(id);
  };

  const handleCloseModal = () => {
      playSfx('click');
      setSelectedCharacterId(null);
  }

  // -- Edit Handlers --
  
  const handleTextEdit = (field: keyof Faction, value: string) => {
    if (!isEditMode) return;
    onUpdate({ ...faction, [field]: value });
    playSfx('type');
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(!isEditMode) return;
      onUpdate({ ...faction, color: e.target.value });
  }

  const handleAddCharacter = () => {
      if(!isEditMode) return;
      playSfx('click');
      const newChar: Character = {
          id: `char_${Date.now()}`,
          name: '新角色',
          title: '未知身份',
          description: '点击编辑角色背景...',
          imageSeed: Math.floor(Math.random() * 1000),
          stats: { might: 50, scheme: 50, sanity: 50 },
          tags: ['新人'],
          relics: [],
          secret: '这个角色隐藏着什么秘密？'
      };
      onUpdate({ ...faction, characters: [...faction.characters, newChar] });
  };

  const handleCharacterUpdate = (updatedChar: Character) => {
      const updatedChars = faction.characters.map(c => c.id === updatedChar.id ? updatedChar : c);
      onUpdate({ ...faction, characters: updatedChars });
  }

  const EditableText = ({ 
    value, 
    onSave, 
    className, 
    tag = 'div' 
  }: { value: string, onSave: (val: string) => void, className?: string, tag?: 'h1'|'h2'|'h3'|'p'|'div'|'blockquote'|'span' }) => {
    const Tag = tag as any;
    return (
        <Tag
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e: any) => onSave(e.target.innerText)}
            onMouseDown={(e: any) => e.stopPropagation()}
            className={`${className} ${isEditMode ? 'border-b border-dashed border-yellow-600/50 hover:bg-white/5 cursor-text focus:outline-none focus:bg-white/10 transition-colors' : ''}`}
        >
            {value}
        </Tag>
    )
  }

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-0 md:p-4 animate-fade-in overflow-hidden">
      
      {/* Container */}
      <div className="w-full h-full md:max-w-6xl md:h-[85vh] bg-[#0a0a0a] border-none md:border border-[#333] shadow-[0_0_50px_rgba(0,0,0,0.8)] relative flex flex-col md:flex-row overflow-hidden md:rounded-xl">
        
        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-10 h-10 md:w-12 md:h-12 bg-black/50 hover:bg-red-900 border border-white/10 hover:border-red-500 rounded-full flex items-center justify-center shadow-lg transition-all group backdrop-blur-md"
        >
            <X size={20} className="text-gray-400 group-hover:text-white" />
        </button>

        {/* --- LEFT PANEL: Lore --- */}
        <div className="w-full md:w-5/12 bg-[#050505] flex flex-col relative overflow-y-auto custom-scrollbar h-1/2 md:h-full border-b md:border-b-0 md:border-r border-[#222]">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_top_left,_#222_0%,_transparent_70%)]"></div>
            
            <div className="p-8 md:p-12 pb-0 relative z-10">
                {/* Faction Header */}
                <div className="flex items-center gap-4 mb-6 relative">
                    {/* Color Bar / Picker */}
                    <div className="relative group">
                         <div className="w-1 h-12 shadow-[0_0_15px_currentColor]" style={{backgroundColor: faction.color, color: faction.color}}></div>
                         {isEditMode && (
                             <input 
                                type="color" 
                                value={faction.color}
                                onChange={handleColorChange}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                             />
                         )}
                    </div>

                    <div>
                        <EditableText 
                            tag="h1"
                            value={faction.name} 
                            onSave={(v) => handleTextEdit('name', v)}
                            className="text-3xl md:text-5xl font-serif text-[#e5e5e5] tracking-wide leading-none"
                        />
                        <EditableText 
                            tag="h2"
                            value={faction.englishName}
                            onSave={(v) => handleTextEdit('englishName', v)}
                            className="text-[10px] md:text-xs font-cinzel text-[#555] uppercase tracking-[0.4em] mt-2"
                        />
                    </div>
                </div>

                <div className="space-y-8 font-serif text-[#a0a0a0]">
                    {/* Description */}
                    <div className="group">
                        <div className="flex items-center gap-2 mb-3 text-[#444] group-hover:text-[#666] transition-colors">
                            <BookOpen size={14} />
                            <h3 className="text-[10px] font-bold uppercase tracking-widest">Archive 01</h3>
                        </div>
                        <EditableText 
                            tag="p"
                            value={faction.description}
                            onSave={(v) => handleTextEdit('description', v)}
                            className="text-sm md:text-base leading-relaxed text-justify text-gray-400"
                        />
                    </div>

                    {/* Philosophy */}
                    <div className="group">
                         <div className="flex items-center gap-2 mb-3 text-[#444] group-hover:text-[#666] transition-colors">
                            <Quote size={14} />
                            <h3 className="text-[10px] font-bold uppercase tracking-widest">Creed</h3>
                        </div>
                        <blockquote 
                            className="p-6 border-l-2 border-[#222] italic text-[#ccc] text-sm relative bg-white/5 rounded-r-lg"
                            style={{borderColor: faction.color}}
                        >
                             <EditableText 
                                tag="span"
                                value={faction.philosophy}
                                onSave={(v) => handleTextEdit('philosophy', v)}
                             />
                        </blockquote>
                    </div>
                </div>
            </div>
        </div>

        {/* --- RIGHT PANEL: Characters Grid --- */}
        <div className="w-full md:w-7/12 bg-[#0a0a0a] flex flex-col h-1/2 md:h-full relative overflow-hidden">
             
             {/* Character Selector Bar */}
             <div className="p-4 md:p-6 pb-2 bg-gradient-to-b from-[#111] to-transparent border-b border-[#222] flex items-center justify-between shrink-0 z-20">
                 <h3 className="text-xs font-bold text-[#444] uppercase tracking-widest flex items-center gap-2">
                     Personnel Records <span className="px-1 bg-[#222] text-gray-500 rounded text-[9px]">{faction.characters.length}</span>
                 </h3>
                 {isEditMode && <span className="text-[10px] text-red-400 flex items-center gap-1 animate-pulse"><Edit2 size={10}/> EDIT MODE ACTIVE</span>}
             </div>

             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6 overflow-y-auto custom-scrollbar z-20 content-start">
                {faction.characters.map((char) => (
                    <div 
                        key={char.id}
                        onMouseEnter={() => playSfx('hover')}
                        onClick={() => handleSelectCharacter(char.id)}
                        className={`
                            relative cursor-pointer border transition-all duration-300 p-3 flex flex-col items-center gap-3 rounded-lg group aspect-[3/4]
                            bg-[#0a0a0a] border-[#222] hover:border-[#444] hover:bg-[#111] hover:-translate-y-1
                        `}
                    >
                         {/* Thumbnail */}
                        <div className="relative w-full aspect-square shrink-0 overflow-hidden rounded border border-[#333]">
                             <img 
                                src={(char as any).customImage || `https://picsum.photos/seed/${char.imageSeed}/200/200?grayscale`} 
                                alt={char.name}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                             {char.isLeader && <div className="absolute top-0 right-0 bg-yellow-900/80 p-[2px] rounded-bl"><Crown size={12} className="text-yellow-400"/></div>}
                        </div>
                        <div className="w-full text-center">
                            <p className="font-serif text-sm text-gray-300 truncate">{char.name}</p>
                            <p className="text-[9px] text-gray-600 truncate uppercase tracking-wider">{char.title}</p>
                        </div>
                    </div>
                ))}

                {/* Add Character Button */}
                {isEditMode && (
                    <button 
                        onClick={handleAddCharacter}
                        className="flex flex-col items-center justify-center gap-2 aspect-[3/4] border border-dashed border-gray-700 rounded-lg hover:border-gray-500 hover:bg-white/5 transition-all group"
                    >
                        <Plus className="text-gray-600 group-hover:text-white" size={32}/>
                        <span className="text-xs text-gray-600 group-hover:text-white uppercase tracking-widest">New Entry</span>
                    </button>
                )}
             </div>
        </div>
      </div>

      {/* --- CHARACTER MODAL OVERLAY --- */}
      {selectedCharacterId && (
        <CharacterModal 
            character={faction.characters.find(c => c.id === selectedCharacterId)!}
            factionColor={faction.color}
            isEditMode={isEditMode}
            onClose={handleCloseModal}
            onUpdate={handleCharacterUpdate}
        />
      )}

    </div>
  );
};

// --- Subcomponent: Character Modal ---

const CharacterModal = ({ 
    character, 
    factionColor, 
    isEditMode, 
    onClose, 
    onUpdate 
}: { 
    character: Character, 
    factionColor: string, 
    isEditMode: boolean, 
    onClose: () => void,
    onUpdate: (c: Character) => void
}) => {
    const [revealSecret, setRevealSecret] = useState(false);
    
    // Mount animation
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    const handleTextEdit = (field: keyof Character, value: any) => {
        if(!isEditMode) return;
        onUpdate({ ...character, [field]: value });
    }
    
    const handleStatEdit = (statName: keyof Character['stats'], value: number) => {
        if(!isEditMode) return;
        onUpdate({ ...character, stats: { ...character.stats, [statName]: value } });
    }

    const handleArrayEdit = (field: 'tags' | 'relics', index: number, value: string) => {
        if(!isEditMode) return;
        const newArr = [...character[field]];
        newArr[index] = value;
        onUpdate({ ...character, [field]: newArr });
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            try {
                playSfx('click');
                const base64 = await fileToBase64(e.target.files[0]);
                onUpdate({ ...character, customImage: base64 });
            } catch (err) {
                console.error("Image upload failed", err);
            }
        }
    };

    const EditableText = ({ 
        value, 
        onSave, 
        className, 
        tag = 'div' 
    }: { value: string, onSave: (val: string) => void, className?: string, tag?: 'h1'|'h2'|'h3'|'p'|'div'|'blockquote'|'span' }) => {
        const Tag = tag as any;
        return (
            <Tag
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e: any) => onSave(e.target.innerText)}
                className={`${className} ${isEditMode ? 'border-b border-dashed border-yellow-600/50 hover:bg-white/5 cursor-text focus:outline-none focus:bg-white/10 transition-colors' : ''}`}
            >
                {value}
            </Tag>
        )
    }

    const StatBar = ({ label, value, icon: Icon, colorClass, statKey }: { label: string, value: number, icon: any, colorClass: string, statKey: keyof Character['stats'] }) => (
        <div className="flex items-center gap-2 mb-2 group">
            <div className={`w-6 h-6 flex items-center justify-center rounded bg-black/50 ${colorClass}`}>
                <Icon size={12} />
            </div>
            <div className="flex-grow">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                    <span>{label}</span>
                    <span className={colorClass}>{value}</span>
                </div>
                <div className="h-1.5 bg-[#222] rounded-full overflow-hidden relative">
                     <div 
                        className={`h-full rounded-full transition-all duration-1000 ${colorClass.replace('text-', 'bg-')}`} 
                        style={{ width: `${value}%` }}
                     ></div>
                     {isEditMode && (
                         <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={value} 
                            onChange={(e) => handleStatEdit(statKey, parseInt(e.target.value))}
                            className="absolute inset-0 opacity-0 cursor-ew-resize"
                         />
                     )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in" onClick={onClose}>
            
            {/* Modal Card - 3D Flip Entry */}
            <div 
                onClick={(e) => e.stopPropagation()}
                className={`
                    w-full max-w-4xl max-h-[90vh] bg-[#0c0c0c] border border-gray-800 shadow-[0_0_100px_rgba(0,0,0,1)] relative flex flex-col md:flex-row overflow-hidden
                    transition-all duration-500 ease-out
                    ${isMounted ? 'opacity-100 translate-y-0 rotate-x-0' : 'opacity-0 translate-y-20 rotate-x-12'}
                `}
                style={{ perspective: '1500px' }}
            >
                 <button onClick={onClose} className="absolute top-4 right-4 z-50 text-gray-500 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all">
                     <X size={24} />
                 </button>

                 {/* Left: Image */}
                 <div className="w-full md:w-1/3 h-64 md:h-auto relative bg-[#050505] overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] to-transparent z-10 md:hidden"></div>
                     <img 
                        src={(character as any).customImage || `https://picsum.photos/seed/${character.imageSeed}/400/600?grayscale`} 
                        alt={character.name}
                        className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
                    />
                    {isEditMode && (
                        <label className="absolute inset-0 z-20 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity backdrop-blur-sm">
                            <Camera className="text-white mb-2" size={32} />
                            <span className="text-xs uppercase tracking-widest text-white">Change Portrait</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                    )}
                 </div>

                 {/* Right: Data */}
                 <div className="w-full md:w-2/3 p-8 md:p-12 overflow-y-auto custom-scrollbar flex flex-col gap-8">
                     
                     {/* Header */}
                     <div>
                         <EditableText 
                            tag="h2"
                            value={character.name}
                            onSave={(v) => handleTextEdit('name', v)}
                            className="text-4xl md:text-5xl font-serif text-[#e5e5e5] tracking-wide mb-1"
                        />
                        <div className="flex items-center gap-3">
                             <div className="h-[1px] w-10 bg-gray-700"></div>
                             <EditableText 
                                tag="p"
                                value={character.title}
                                onSave={(v) => handleTextEdit('title', v)}
                                className="text-xs font-cinzel text-[#888] uppercase tracking-[0.2em]"
                            />
                        </div>
                     </div>

                     {/* Tags */}
                     <div className="flex flex-wrap gap-2">
                        {(character.tags || []).map((tag, idx) => (
                            <div key={idx} className="bg-[#1a1a1a] border border-[#333] px-3 py-1 flex items-center gap-2">
                                <TagIcon size={12} className="text-gray-500" />
                                <EditableText 
                                    tag="span"
                                    value={tag}
                                    onSave={(v) => handleArrayEdit('tags', idx, v)}
                                    className="text-[10px] text-gray-300 uppercase tracking-wide font-sans"
                                />
                            </div>
                        ))}
                     </div>

                     {/* Stats & Relics Row */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="bg-[#111] p-5 border border-[#222]">
                             <StatBar label="Might" value={character.stats?.might || 0} icon={Sword} colorClass="text-red-500" statKey="might" />
                             <StatBar label="Scheme" value={character.stats?.scheme || 0} icon={Brain} colorClass="text-blue-500" statKey="scheme" />
                             <StatBar label="Sanity" value={character.stats?.sanity || 0} icon={Activity} colorClass="text-purple-500" statKey="sanity" />
                         </div>
                         <div className="bg-[#111] p-5 border border-[#222]">
                            <h4 className="text-[10px] font-bold text-[#555] uppercase tracking-widest mb-3 border-b border-[#333] pb-1">Relics</h4>
                             <ul className="space-y-2">
                                 {(character.relics || []).map((relic, idx) => (
                                     <li key={idx} className="text-xs text-[#a0a0a0] flex items-center gap-2">
                                         <div className="w-1.5 h-1.5 bg-yellow-700 rotate-45"></div>
                                         <EditableText 
                                            tag="span"
                                            value={relic}
                                            onSave={(v) => handleArrayEdit('relics', idx, v)}
                                         />
                                     </li>
                                 ))}
                             </ul>
                         </div>
                     </div>

                     {/* Bio */}
                     <div className="relative pl-6 border-l border-gray-800">
                         <EditableText 
                            tag="p"
                            value={character.description}
                            onSave={(v) => handleTextEdit('description', v)}
                            className="text-gray-400 font-serif text-sm md:text-base leading-relaxed text-justify"
                        />
                     </div>

                     {/* Secret */}
                     <div className="relative group cursor-pointer mt-auto" onClick={() => setRevealSecret(!revealSecret)}>
                        <h4 className="text-[10px] font-bold text-red-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <EyeOff size={12}/> Forbidden Knowledge
                        </h4>
                        <div className={`
                                p-5 border border-red-900/30 bg-red-950/10 transition-all duration-500 relative overflow-hidden
                                ${revealSecret || isEditMode ? 'opacity-100' : 'opacity-80 hover:opacity-100'}
                        `}>
                                {/* Blur Overlay */}
                                {(!revealSecret && !isEditMode) && (
                                    <div className="absolute inset-0 backdrop-blur-md bg-black/60 flex items-center justify-center z-10">
                                        <div className="flex flex-col items-center text-red-700/50 animate-pulse">
                                            <Key size={24} />
                                            <span className="text-[9px] uppercase tracking-widest mt-1">Decrypting Required</span>
                                        </div>
                                    </div>
                                )}
                                
                                <EditableText 
                                tag="p"
                                value={character.secret || "????"}
                                onSave={(v) => handleTextEdit('secret', v)}
                                className="text-red-400/90 font-serif italic text-sm"
                                />
                        </div>
                    </div>

                 </div>
            </div>
        </div>
    );
}
