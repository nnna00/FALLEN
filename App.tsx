
import React, { useState, useEffect } from 'react';
import { IntroSequence } from './components/IntroSequence';
import { WorldMap } from './components/WorldMap';
import { FactionDetail } from './components/FactionDetail';
import { OracleChat } from './components/OracleChat';
import { AppState, Faction, MapLocation } from './types';
import { FACTIONS } from './constants';
import { loadWorldData, saveWorldData, updateFactionInList } from './services/dataService';
import { startAudio, playSfx } from './services/audioService';
import { PenTool } from 'lucide-react';

const App: React.FC = () => {
  const [factions, setFactions] = useState<Faction[]>([]);
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [state, setState] = useState<AppState>({
    view: 'INTRO',
    userFaction: null,
    selectedFactionId: null,
    hasSeenIntro: false
  });

  // Load data on mount
  useEffect(() => {
    const data = loadWorldData();
    setFactions(data.factions);
    setLocations(data.locations);
    
    // Audio init listener
    const initAudioHandler = () => {
        startAudio();
        window.removeEventListener('click', initAudioHandler);
    };
    window.addEventListener('click', initAudioHandler);
    
    return () => window.removeEventListener('click', initAudioHandler);
  }, []);

  // Persist data whenever world data changes
  useEffect(() => {
    if (factions.length > 0) {
      saveWorldData({ factions, locations });
    }
  }, [factions, locations]);

  const handleUpdateFaction = (updatedFaction: Faction) => {
    setFactions(prev => updateFactionInList(prev, updatedFaction));
  };

  const handleUpdateFactionPosition = (id: string, newPos: {x: number, y: number, z: number}) => {
    setFactions(prev => prev.map(f => {
        if (f.id === id) return { ...f, coordinates: newPos };
        return f;
    }));
  };

  const handleAddFaction = () => {
    playSfx('click');
    const newFaction: Faction = {
      id: `fac_${Date.now()}`,
      name: '新阵营',
      englishName: 'New Faction',
      description: '点击编辑描述...',
      shortDesc: '点击编辑短评...',
      philosophy: '点击编辑信条...',
      color: '#ffffff',
      coordinates: { x: 0, y: 0, z: 20 },
      characters: []
    };
    setFactions(prev => [...prev, newFaction]);
  };

  const handleAddLocation = () => {
    playSfx('click');
    const newLocation: MapLocation = {
      id: `loc_${Date.now()}`,
      name: '未命名区域',
      type: 'TOWN',
      x: 0, 
      y: 0
    };
    setLocations(prev => [...prev, newLocation]);
  };

  const handleUpdateLocation = (id: string, updates: Partial<MapLocation>) => {
    setLocations(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const handleIntroComplete = (factionId: string) => {
    playSfx('open');
    setState(prev => ({
      ...prev,
      hasSeenIntro: true,
      userFaction: factionId,
      view: 'MAP'
    }));
  };

  const handleSelectFaction = (id: string) => {
    playSfx('open');
    setState(prev => ({
      ...prev,
      selectedFactionId: id,
      view: 'FACTION_DETAIL'
    }));
  };

  const handleCloseDetail = () => {
    playSfx('click');
    setState(prev => ({
      ...prev,
      selectedFactionId: null,
      view: 'MAP'
    }));
  };

  const toggleEditMode = () => {
      playSfx('click');
      setIsEditMode(!isEditMode);
  };

  const renderContent = () => {
    switch (state.view) {
      case 'INTRO':
        return <IntroSequence onComplete={handleIntroComplete} />;
      
      case 'MAP':
      case 'FACTION_DETAIL':
        return (
          <>
            <WorldMap 
              factions={factions}
              locations={locations}
              onSelectFaction={handleSelectFaction} 
              userFactionId={state.userFaction}
              isEditMode={isEditMode}
              onUpdateFactionPosition={handleUpdateFactionPosition}
              onAddFaction={handleAddFaction}
              onAddLocation={handleAddLocation}
              onUpdateLocation={handleUpdateLocation}
            />
            {state.view === 'FACTION_DETAIL' && state.selectedFactionId && (
              <FactionDetail 
                faction={factions.find(f => f.id === state.selectedFactionId)!} 
                isEditMode={isEditMode}
                onClose={handleCloseDetail}
                onUpdate={handleUpdateFaction}
              />
            )}
            
            {/* Oracle is only visible in Map view usually, but allowed here */}
            {state.view === 'MAP' && <OracleChat userFactionId={state.userFaction ? factions.find(f => f.id === state.userFaction)?.name || null : null} />}
          </>
        );
      
      default:
        return <IntroSequence onComplete={handleIntroComplete} />;
    }
  };

  if (factions.length === 0) return <div className="bg-black h-screen text-gray-600 flex items-center justify-center">Loading World...</div>;

  return (
    <div className="w-full h-screen bg-black text-gray-200 overflow-hidden relative">
      {/* Global overlay for grain/fog effect */}
      <div className="grain-overlay"></div>
      
      {renderContent()}

      {/* Edit Mode Toggle (Global) */}
      {state.view !== 'INTRO' && (
          <button 
            onClick={toggleEditMode}
            className={`absolute bottom-6 left-6 z-[100] p-3 rounded-full border transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.8)] 
                ${isEditMode 
                    ? 'bg-red-900 border-red-500 text-white animate-pulse' 
                    : 'bg-black/80 border-gray-700 text-gray-500 hover:text-white hover:border-gray-400'
                }`}
            title={isEditMode ? "退出创世模式" : "进入创世模式"}
          >
            <PenTool size={20} />
          </button>
      )}
    </div>
  );
};

export default App;
