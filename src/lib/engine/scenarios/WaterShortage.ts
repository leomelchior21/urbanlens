import { ScenarioContext, Hotspot, ChartConfig } from '@/store/useCrisisStore';

// Base anchors for Cantareira region
const baseAnchors = [
  { lat: -23.268, lng: -46.561 },
  { lat: -23.317, lng: -46.587 }
];
function offset(idx: number, range: number) {
  const a = baseAnchors[idx % baseAnchors.length];
  return {
    lat: a.lat + (Math.random() - 0.5) * range,
    lng: a.lng + (Math.random() - 0.5) * range
  };
}

const hotspots: Hotspot[] = [
  // Stage 1 – Symptoms
  {
    id: 'ws-1-1', ...offset(0, 0.04),
    type: 'news', investigativeRole: 'symptom', stageAppeared: 1, system: 'Water',
    title: 'RESERVOIR LEVEL DROP', description: 'Sensors report Cantareira reservoir at 30% capacity, unexpected decline.'
  },
  {
    id: 'ws-1-2', ...offset(1, 0.03),
    type: 'social', investigativeRole: 'symptom', stageAppeared: 1, system: 'Health',
    title: 'RATIONING ALERT', description: '@cityalert: Water rationing announced for 5 municipalities, lines forming at taps.'
  },
  // Stage 2 – Distractors / False Leads
  {
    id: 'ws-2-1', ...offset(0, 0.05),
    type: 'false_lead', investigativeRole: 'false_lead', stageAppeared: 2, system: 'Energy',
    title: 'POWER PLANT SHUTDOWN', description: 'Rumor that a hydro plant offline caused the shortage.'
  },
  // Stage 3 – Secondary Clues
  {
    id: 'ws-3-1', ...offset(1, 0.04),
    type: 'alert', investigativeRole: 'secondary_clue', stageAppeared: 3, system: 'Vegetation',
    title: 'ILLEGAL ABSTRACTION', description: 'Investigation uncovers illegal water extraction from upstream wells.'
  },
  // Stage 4 – Root Clue
  {
    id: 'ws-4-1', ...offset(0, 0.02),
    type: 'alert', investigativeRole: 'root_clue', stageAppeared: 4, system: 'Water',
    title: 'DROUGHT CONFIRMATION', description: 'Meteorology confirms a multi‑week drought with negligible rainfall.'
  },
  // Stage 5 – Convergence
  {
    id: 'ws-5-1', ...offset(1, 0.015),
    type: 'news', investigativeRole: 'root_clue', stageAppeared: 5, system: 'Water',
    title: 'EMERGENCY DECLARED', description: 'State of emergency declared; water trucks deployed, strict rationing enforced.'
  }
];

const charts: ChartConfig[] = [
  {
    id: 'chart-ws-1',
    title: 'Reservoir Level Line',
    type: 'line',
    measureDescription: 'Reservoir volume percentage across stages.',
    hiddenRole: 'Misleading Metric: Shows a gradual decline, hinting at natural evaporation, while illegal abstraction is the hidden driver.',
    data: [
      { stage: 1, level: 30 },
      { stage: 2, level: 25 },
      { stage: 3, level: 20 },
      { stage: 4, level: 15 },
      { stage: 5, level: 10 }
    ]
  },
  {
    id: 'chart-ws-2',
    title: 'Abstraction Radar',
    type: 'radar',
    measureDescription: 'Legal vs. illegal water extraction volumes.',
    hiddenRole: 'Root Clue: Highlights illegal extraction dominating the water balance.',
    data: [
      { metric: 'Extraction (ML)', Legal: 5, Illegal: 45 },
      { metric: 'Rainfall (mm)', Legal: 10, Illegal: 0 }
    ]
  }
];

export const waterShortageContext: Omit<ScenarioContext, 'id'> = {
  title: 'Water Shortage in Cantareira System',
  code: 'CRISIS-09',
  rootCauseSystem: 'Water',
  description: 'Hidden cause: illegal water abstraction combined with prolonged drought reduces reservoir levels.',
  dossier: "Mayor's Advisor: 'Upstream mayors claim the reservoir is drying due to climate, but illegal wells are siphoning water. Emphasize the drought narrative, hide the theft.'",
  stageTexts: {
    1: 'Water: reservoir drops sharply; health: rationing announced.',
    2: 'Energy: false rumor of hydro plant shutdown.',
    3: 'Vegetation: illegal wells discovered.',
    4: 'Water: drought confirmed by meteorology.',
    5: 'Emergency: strict rationing, water trucks deployed.'
  },
  hotspots,
  chartData: [],
  chartConfigs: charts
};
