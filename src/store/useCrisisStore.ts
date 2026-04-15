import { create } from 'zustand';

const STAGE_DURATION_SECONDS = 30;

export type SystemType = 'Temperature' | 'Air' | 'Water' | 'Energy' | 'Mobility' | 'Waste' | 'Vegetation' | 'Soil' | 'Social' | 'Health';

export type InvestigativeRole = 'root_clue' | 'secondary_clue' | 'symptom' | 'distractor' | 'false_lead';

export interface Hotspot {
  id: string;
  lat: number;
  lng: number;
  type: 'news' | 'social' | 'complaint' | 'alert' | 'note' | 'hint' | 'internal_email' | 'false_lead';
  investigativeRole?: InvestigativeRole;
  title: string;
  description: string;
  system: SystemType;
  stageAppeared: number;
}

export interface ChartConfig {
  id: string;
  title: string;
  type: 'line' | 'area' | 'bar' | 'stacked_bar' | 'grouped_bar' | 'radar' | 'heatmap';
  measureDescription: string;
  hiddenRole: string;
  data: Record<string, unknown>[];
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
  chartData: Record<string, unknown>[]; // Used for RightPanel generic charts (legacy)
  chartConfigs?: ChartConfig[]; // Used for explicit, meaningful charts (new)
}

interface CrisisState {
  activeSystem: SystemType;
  stage: number; // 1 to 5
  timeRemaining: number; // In seconds, e.g. 120 per stage
  scenarioContext: ScenarioContext | null;
  selectedHotspot: Hotspot | null;
  selectedHotspotFocusKey: number;
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
  setTimerRunning: (isRunning: boolean) => void;
  pinEvidence: (hotspot: Hotspot) => void;
  unpinEvidence: (id: string) => void;
}

function getInitialSystemForScenario(scenario: ScenarioContext): SystemType {
  const stageOneHotspots = scenario.hotspots.filter((hotspot) => hotspot.stageAppeared === 1);

  if (stageOneHotspots.some((hotspot) => hotspot.system === scenario.rootCauseSystem)) {
    return scenario.rootCauseSystem;
  }

  return stageOneHotspots[0]?.system ?? scenario.rootCauseSystem;
}

export const useCrisisStore = create<CrisisState>((set) => ({
  activeSystem: 'Temperature', // Default
  stage: 1,
  timeRemaining: STAGE_DURATION_SECONDS,
  scenarioContext: null,
  selectedHotspot: null,
  selectedHotspotFocusKey: 0,
  isRunning: false,
  pinnedEvidence: [],

  setActiveSystem: (sys) => set({ activeSystem: sys, selectedHotspot: null }),
  setStage: (stage) => set({ stage }),
  tickTimer: () => set((state) => {
    if (!state.isRunning) return state;
    if (state.timeRemaining <= 1) {
      if (state.stage < 5) {
        const nextStage = state.stage + 1;
        const nextDuration = STAGE_DURATION_SECONDS;
        return { stage: nextStage, timeRemaining: nextDuration };
      } else {
        return { isRunning: false, timeRemaining: 0 };
      }
    }
    return { timeRemaining: state.timeRemaining - 1 };
  }),

  setScenario: (scenario) => set({
    scenarioContext: scenario,
    activeSystem: getInitialSystemForScenario(scenario),
    selectedHotspot: null,
  }),
  setHotspots: (newHotspots) => set((state) => ({
    scenarioContext: state.scenarioContext ? { ...state.scenarioContext, hotspots: newHotspots } : null
  })),
  setSelectedHotspot: (hotspot) => set((state) => ({
    selectedHotspot: hotspot,
    selectedHotspotFocusKey: hotspot ? state.selectedHotspotFocusKey + 1 : state.selectedHotspotFocusKey,
  })),
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
    timeRemaining: STAGE_DURATION_SECONDS,
    selectedHotspot: null,
    selectedHotspotFocusKey: 0,
    isRunning: false,
    pinnedEvidence: []
  }),
  toggleTimer: () => set((state) => ({ isRunning: !state.isRunning })),
  setTimerRunning: (isRunning) => set({ isRunning })
}));
