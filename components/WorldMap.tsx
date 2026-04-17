
import React, { useRef, useState, useEffect } from 'react';
import { MAP_WIDTH, MAP_HEIGHT, CONTINENT_PATH, RIVER_PATHS } from '../constants';
import { Faction, MapLocation } from '../types';
import { Mountain, Trees, Waves, Castle, Skull, MapPin, Tent, Anchor, Move, Hexagon, LocateFixed, Plus, Map } from 'lucide-react';
import { playSfx } from '../services/audioService';

interface WorldMapProps {
  factions: Faction[];
  locations: MapLocation[];
  onSelectFaction: (id: string) => void;
  userFactionId: string | null;
  isEditMode: boolean;
  onUpdateFactionPosition: (id: string, newPos: {x: number, y: number, z: number}) => void;
  onAddFaction: () => void;
  onAddLocation: () => void;
  onUpdateLocation: (id: string, updates: Partial<MapLocation>) => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({ 
  factions, 
  locations,
  onSelectFaction, 
  userFactionId, 
  isEditMode,
  onUpdateFactionPosition,
  onAddFaction,
  onAddLocation,
  onUpdateLocation
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(0.6); 
  const [rotation, setRotation] = useState({ x: 40, z: 0 }); // Default perspective
  const [isDraggingMap, setIsDraggingMap] = useState(false);
  const [draggingTokenId, setDraggingTokenId] = useState<string | null>(null);
  const [draggingLocationId, setDraggingLocationId] = useState<string | null>(null);
  
  const lastMousePos = useRef({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  // -- Event Handlers --

  const handleStart = (clientX: number, clientY: number, target: EventTarget) => {
    if (isEditMode) {
      const element = target as HTMLElement;
      
      // Check for Faction Token
      const tokenContainer = element.closest('[data-token-id]');
      if (tokenContainer) {
        const tokenId = tokenContainer.getAttribute('data-token-id');
        if (tokenId) {
          setDraggingTokenId(tokenId);
          lastMousePos.current = { x: clientX, y: clientY };
          playSfx('click');
          return;
        }
      }

      // Check for Location Marker
      const locationContainer = element.closest('[data-location-id]');
      if (locationContainer) {
        const locId = locationContainer.getAttribute('data-location-id');
        if (locId) {
            setDraggingLocationId(locId);
            lastMousePos.current = { x: clientX, y: clientY };
            playSfx('click');
            return;
        }
      }
    }

    setIsDraggingMap(true);
    lastMousePos.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: number, clientY: number) => {
    const deltaX = clientX - lastMousePos.current.x;
    const deltaY = clientY - lastMousePos.current.y;
    lastMousePos.current = { x: clientX, y: clientY };

    if (isEditMode && draggingTokenId) {
      const mapDeltaX = deltaX / scale;
      const mapDeltaY = deltaY / scale;
      const faction = factions.find(f => f.id === draggingTokenId);
      if (faction) {
        onUpdateFactionPosition(faction.id, {
          x: faction.coordinates.x + mapDeltaX,
          y: faction.coordinates.y + mapDeltaY,
          z: faction.coordinates.z
        });
      }
    } else if (isEditMode && draggingLocationId) {
       const mapDeltaX = deltaX / scale;
       const mapDeltaY = deltaY / scale;
       const location = locations.find(l => l.id === draggingLocationId);
       if (location) {
           onUpdateLocation(location.id, {
               x: location.x + mapDeltaX,
               y: location.y + mapDeltaY
           });
       }
    } else if (isDraggingMap) {
      setPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
    }
  };

  const handleEnd = () => {
    setIsDraggingMap(false);
    setDraggingTokenId(null);
    setDraggingLocationId(null);
  };

  // -- Interaction Bindings --
  const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX, e.clientY, e.target);
  const onMouseMove = (e: React.MouseEvent) => {
    if (isDraggingMap || draggingTokenId || draggingLocationId) {
        e.preventDefault();
        handleMove(e.clientX, e.clientY);
    }
  };
  const onMouseUp = handleEnd;
  const onTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX, e.touches[0].clientY, e.target);
  const onTouchMove = (e: React.TouchEvent) => {
    if (isDraggingMap || draggingTokenId || draggingLocationId) {
       handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  const onTouchEnd = handleEnd;

  const handleWheel = (e: React.WheelEvent) => {
    const newScale = Math.min(Math.max(scale - e.deltaY * 0.001, 0.3), 2.0);
    setScale(newScale);
  };

  const centerX = MAP_WIDTH / 2;
  const centerY = MAP_HEIGHT / 2;

  const EditableText = ({ id, value, onSave }: { id: string, value: string, onSave: (val: string) => void }) => (
    <span
        contentEditable={isEditMode}
        suppressContentEditableWarning
        onBlur={(e) => onSave(e.currentTarget.innerText)}
        onMouseDown={(e) => e.stopPropagation()} // Allow text selection without dragging
        className={`${isEditMode ? 'border-b border-dashed border-cyan-500 cursor-text bg-black/50' : ''}`}
    >
        {value}
    </span>
  );

  return (
    <div 
      className="relative w-full h-full overflow-hidden bg-[#020205] select-none font-sans"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onWheel={handleWheel}
      style={{ touchAction: 'none' }}
    >
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateZ(var(--z-height)) translateY(0px); }
          50% { transform: translateZ(var(--z-height)) translateY(-15px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        @keyframes grid-move {
          0% { background-position: 0 0; }
          100% { background-position: 50px 50px; }
        }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s infinite; }
      `}</style>

      {/* --- Environment --- */}
      {/* Deep Space / Void Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a1a2e_0%,_#000000_80%)] pointer-events-none"></div>
      
      {/* Decorative Grid Floor (Infinite Plane) */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            transform: `perspective(1000px) rotateX(60deg) scale(2)`,
            transformOrigin: '50% 100%'
        }}
      ></div>

      {/* --- UI Layer --- */}
      <div className="absolute top-0 left-0 w-full p-6 z-50 pointer-events-none flex justify-between items-start bg-gradient-to-b from-black via-black/50 to-transparent h-32">
         <div>
            <h1 className="text-white text-3xl font-cinzel tracking-[0.2em] drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                THE FALLEN WORLD
            </h1>
            <p className="text-xs text-cyan-500/80 font-mono mt-1 tracking-widest border-l-2 border-cyan-500 pl-2">
                COORDINATES: {Math.round(position.x)}, {Math.round(position.y)} // SECTOR: VOID
            </p>
         </div>
         {isEditMode && (
             <div className="pointer-events-auto flex flex-col gap-2 items-end">
                <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-sm text-xs font-bold animate-pulse backdrop-blur-sm">
                    /// SYSTEM OVERRIDE: EDIT MODE ///
                </div>
                {/* CMS Controls */}
                <div className="flex gap-2 mt-2">
                    <button onClick={onAddFaction} className="flex items-center gap-1 px-3 py-1 bg-gray-800 border border-gray-600 hover:border-white text-xs text-gray-300 hover:text-white transition-colors">
                        <Plus size={12}/> New Faction
                    </button>
                    <button onClick={onAddLocation} className="flex items-center gap-1 px-3 py-1 bg-gray-800 border border-gray-600 hover:border-white text-xs text-gray-300 hover:text-white transition-colors">
                        <MapPin size={12}/> New Location
                    </button>
                </div>
             </div>
         )}
      </div>

      {/* --- 3D Scene --- */}
      <div 
        className="absolute inset-0 flex items-center justify-center transition-transform duration-100 ease-linear"
        style={{ perspective: '2000px' }}
      >
        <div 
          ref={mapRef}
          className="relative preserve-3d"
          style={{
            width: `${MAP_WIDTH}px`,
            height: `${MAP_HEIGHT}px`,
            transform: `
                rotateX(${rotation.x}deg) 
                rotateZ(${rotation.z}deg) 
                scale(${scale}) 
                translate3d(${position.x}px, ${position.y}px, 0)
            `,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* --- The Map Layer (Obsidian Slab) --- */}
          
          {/* 1. Base Shadow/Glow */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} style={{ transform: 'translateZ(-20px)' }}>
             <path d={CONTINENT_PATH} fill="rgba(0,0,0,0.8)" filter="url(#glow)" />
             <defs>
               <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                 <feGaussianBlur stdDeviation="30" result="coloredBlur"/>
                 <feMerge>
                   <feMergeNode in="coloredBlur"/>
                   <feMergeNode in="SourceGraphic"/>
                 </feMerge>
               </filter>
             </defs>
          </svg>

          {/* 2. Extrusion Layers (Creating Thickness) */}
          {[...Array(5)].map((_, i) => (
             <svg key={i} className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} style={{ transform: `translateZ(-${i * 4}px)` }}>
                 <path d={CONTINENT_PATH} fill="#0a0a0a" stroke="#111" strokeWidth="2" />
             </svg>
          ))}

          {/* 3. Main Surface (The Top) */}
          <div className="absolute inset-0" style={{ transform: 'translateZ(0px)' }}>
             <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}>
                 
                 {/* Landmass Fill - Dark Void Glass */}
                 <path d={CONTINENT_PATH} fill="#0f0f13" stroke="#333" strokeWidth="1" />
                 
                 {/* Grid Overlay on Land Only */}
                 <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                   <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
                 </pattern>
                 <path d={CONTINENT_PATH} fill="url(#grid)" />

                 {/* Coastline Highlight (Glowing) */}
                 <path d={CONTINENT_PATH} fill="none" stroke="#3b82f6" strokeWidth="3" strokeOpacity="0.5" className="animate-pulse-glow" />

                 {/* Rivers (Energy Veins) */}
                 {RIVER_PATHS.map((d, i) => (
                    <path key={i} d={d} fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" className="animate-pulse" opacity="0.8" />
                 ))}
             </svg>

             {/* Locations (Holographic Points) */}
             {locations.map(loc => (
                 <div 
                    key={loc.id}
                    data-location-id={loc.id}
                    className={`absolute flex flex-col items-center group pointer-events-auto ${isEditMode ? 'cursor-move' : 'cursor-crosshair'}`}
                    style={{ 
                        left: centerX + loc.x, 
                        top: centerY + loc.y,
                        transform: 'translate(-50%, -50%) translateZ(2px)' // Slight lift
                    }}
                 >
                    {/* Glowing Dot */}
                    <div className="relative">
                        <div className="absolute -inset-2 bg-cyan-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"></div>
                    </div>
                    
                    {/* Location Name Label (Tech Style) */}
                    <div className={`absolute top-4 transition-all duration-300 ${isEditMode ? 'opacity-100' : 'opacity-40 group-hover:opacity-100 pointer-events-none'}`}>
                        <div className="bg-black/80 border-l-2 border-cyan-500 px-2 py-1 backdrop-blur-md">
                            <span className="font-mono text-[10px] text-cyan-100 uppercase tracking-widest whitespace-nowrap block">
                                <EditableText 
                                    id={loc.id} 
                                    value={loc.name} 
                                    onSave={(v) => onUpdateLocation(loc.id, { name: v })}
                                />
                            </span>
                            <span className="text-[8px] text-gray-500 block">TYPE: {loc.type}</span>
                        </div>
                    </div>
                 </div>
             ))}
          </div>

          {/* Factions (Holographic Monoliths) */}
          {factions.map((faction) => (
            <FactionToken 
              key={faction.id} 
              faction={faction} 
              isUserFaction={faction.id === userFactionId}
              centerX={centerX}
              centerY={centerY}
              isEditMode={isEditMode}
              onClick={() => {
                  if (!isEditMode) onSelectFaction(faction.id);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Subcomponents ---

const FactionToken: React.FC<{ 
    faction: Faction; 
    isUserFaction: boolean; 
    centerX: number;
    centerY: number;
    isEditMode: boolean;
    onClick: () => void 
}> = ({ faction, isUserFaction, centerX, centerY, isEditMode, onClick }) => {
  
  const left = centerX + faction.coordinates.x;
  const top = centerY + faction.coordinates.y;
  const zHeight = faction.coordinates.z + 40; // Hover higher

  return (
    <div
      data-token-id={faction.id}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseEnter={() => playSfx('hover')}
      className={`absolute group ${isEditMode ? 'cursor-move' : 'cursor-pointer'}`}
      style={{
        left: `${left}px`,
        top: `${top}px`,
        transform: `translate(-50%, -50%)`, 
        transformStyle: 'preserve-3d',
        zIndex: 100
      }}
    >
        {/* Ground Projection (Target Reticle) */}
        <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-dashed rounded-full opacity-30 group-hover:opacity-60 transition-opacity"
            style={{ 
                borderColor: faction.color,
                transform: 'translateZ(1px)' // Flat on ground
            }}
        >
            <div className="absolute inset-0 animate-spin-slow opacity-50" style={{ border: `1px dotted ${faction.color}`, borderRadius: '50%' }}></div>
        </div>
        
        {/* Laser Tether */}
        <div 
            className="absolute bottom-1/2 left-1/2 w-[1px] bg-gradient-to-t from-transparent via-white/50 to-transparent opacity-30"
            style={{ 
                height: `${zHeight}px`,
                transformOrigin: 'bottom',
                transform: `rotateX(-90deg) translateZ(0px)`, // Stand up vertically from ground to token
                backgroundColor: faction.color
            }}
        ></div>

        {/* Floating Monolith (The Token) */}
        <div 
            className={`${!isEditMode && 'animate-float-slow'}`}
            style={{ 
                '--z-height': `${zHeight}px`,
                transformStyle: 'preserve-3d' 
            } as React.CSSProperties}
        >
            <div 
                className={`
                    w-28 h-40 bg-black/40 backdrop-blur-md rounded-sm border border-white/10 flex flex-col items-center p-1 relative overflow-hidden transition-all duration-300
                    ${!isEditMode && 'group-hover:scale-110 group-hover:border-white/40'}
                    ${isUserFaction ? 'ring-2 ring-yellow-500/50' : ''}
                `}
                style={{ 
                    // Always face camera-ish (billboard effect constrained to X)
                    transform: `rotateX(-40deg)`, 
                    boxShadow: `0 0 30px ${faction.color}20, inset 0 0 20px ${faction.color}10`
                }}
            >
                 {/* Top Glow Bar */}
                 <div className="w-full h-[2px] mb-2 shadow-[0_0_10px_currentColor]" style={{ backgroundColor: faction.color, color: faction.color }}></div>

                 {/* Image Window */}
                 <div className="w-full h-24 relative overflow-hidden bg-black/50 mb-2 group-hover:opacity-100 opacity-80 transition-opacity">
                     <img 
                        src={(faction.characters[0] as any)?.customImage || `https://picsum.photos/seed/${faction.characters[0]?.imageSeed || 999}/200/200?grayscale`}
                        alt={faction.name}
                        className="w-full h-full object-cover mix-blend-screen contrast-125"
                     />
                     {/* Scanline overlay */}
                     <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
                 </div>

                 {/* Text Data */}
                 <div className="w-full text-center">
                     <h3 className="text-white font-cinzel text-[10px] tracking-widest uppercase truncate px-1">
                        {faction.englishName}
                     </h3>
                     <p className="text-[9px] font-sans text-gray-400 scale-90" style={{ color: faction.color }}>
                        [{faction.name}]
                     </p>
                 </div>

                 {/* Corner Accents */}
                 <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30"></div>
                 <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/30"></div>
                 <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30"></div>
                 <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30"></div>
            </div>
        </div>
    </div>
  );
};
