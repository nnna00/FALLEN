
import { Faction, MapLocation } from '../types';
import { FACTIONS, DEFAULT_MAP_LOCATIONS } from '../constants';

const STORAGE_KEY = 'fallen_divinities_data_v2';

export interface WorldData {
  factions: Faction[];
  locations: MapLocation[];
}

// Load data from LocalStorage or fall back to constants
export const loadWorldData = (): WorldData => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Backwards compatibility if locations don't exist in saved data
      if (!parsed.locations) {
          parsed.locations = DEFAULT_MAP_LOCATIONS;
      }
      return parsed;
    }
  } catch (e) {
    console.warn("Failed to load saved data, using default.", e);
  }
  return { factions: FACTIONS, locations: DEFAULT_MAP_LOCATIONS };
};

// Save current state to LocalStorage
export const saveWorldData = (data: WorldData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save data (likely quota exceeded for images)", e);
    alert("保存失败：可能是图片太大，请尝试上传小一点的图片。");
  }
};

// Helper to update a specific faction
export const updateFactionInList = (factions: Faction[], updatedFaction: Faction): Faction[] => {
  return factions.map(f => f.id === updatedFaction.id ? updatedFaction : f);
};

// Helper to convert File to Base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};
