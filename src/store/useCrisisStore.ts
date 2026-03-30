import { create } from 'zustand';

export type SystemType = 'Temperature' | 'Air' | 'Water' | 'Energy' | 'Mobility' | 'Waste' | 'Vegetation';

export interface Hotspot {
  id: string;
  lat: number;
  lng: number;
  type: 'news' | 'social' | 'complaint' | 'alert' | 'note' | 'hint' | 'false_lead';
  title: string;
  description: string;
  system: SystemType;
  stageAppeared: number;
}

export interface ScenarioContext {
  id: string;
  title: string;
  code: string;
  rootCauseSystem: SystemType;
  description: string;
  dossier: string; // Fake email from the mayor's advisor
  stageTexts: Record<number, string>;
  hotspots: Hotspot[];
  chartData: Record<string, unknown>[]; // Used for RightPanel charts
}

interface CrisisState {
  activeSystem: SystemType;
  stage: number; // 1 to 5
  timeRemaining: number; // In seconds, e.g. 120 per stage
  scenarioContext: ScenarioContext | null;
  selectedHotspot: Hotspot | null;
  isRunning: boolean;
  pinnedEvidence: Hotspot[]; // User-saved evidence

  // Actions
  setActiveSystem: (sys: SystemType) => void;
  setStage: (stage: number) => void;
  tickTimer: () => void;
  setScenario: (scenario: ScenarioContext) => void;
  setHotspots: (hotspots: Hotspot[]) => void;
  setSelectedHotspot: (hotspot: Hotspot | null) => void;
  resetCrisis: () => void;
  toggleTimer: () => void;
  pinEvidence: (hotspot: Hotspot) => void;
  unpinEvidence: (id: string) => void;
}

export const useCrisisStore = create<CrisisState>((set) => ({
  activeSystem: 'Temperature', // Default
  stage: 1,
  timeRemaining: 60,
  scenarioContext: null,
  selectedHotspot: null,
  isRunning: true,
  pinnedEvidence: [],

  setActiveSystem: (sys) => set({ activeSystem: sys, selectedHotspot: null }),
  setStage: (stage) => set({ stage }),
  tickTimer: () => set((state) => {
    if (!state.isRunning) return state;
    if (state.timeRemaining <= 0) {
      if (state.stage < 5) {
        const nextStage = state.stage + 1;
        const nextDuration = 60;
        return { stage: nextStage, timeRemaining: nextDuration };
      } else {
        return { isRunning: false, timeRemaining: 0 };
      }
    }
    return { timeRemaining: state.timeRemaining - 1 };
  }),

  setScenario: (scenario) => set({ scenarioContext: scenario }),
  setHotspots: (newHotspots) => set((state) => ({
    scenarioContext: state.scenarioContext ? { ...state.scenarioContext, hotspots: newHotspots } : null
  })),
  setSelectedHotspot: (hotspot) => set({ selectedHotspot: hotspot }),
  pinEvidence: (hotspot) => set((state) => ({
    pinnedEvidence: state.pinnedEvidence.find(h => h.id === hotspot.id)
      ? state.pinnedEvidence
      : [...state.pinnedEvidence, hotspot]
  })),
  unpinEvidence: (id) => set((state) => ({
    pinnedEvidence: state.pinnedEvidence.filter(h => h.id !== id)
  })),
  resetCrisis: () => set({
    stage: 1,
    timeRemaining: 60,
    selectedHotspot: null,
    isRunning: true,
    pinnedEvidence: []
  }),
  toggleTimer: () => set((state) => ({ isRunning: !state.isRunning }))
}));
