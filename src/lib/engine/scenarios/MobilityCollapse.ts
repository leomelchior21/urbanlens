import { ScenarioContext, Hotspot, ChartConfig } from '@/store/useCrisisStore';

// Base anchors for Paulista axis area
const baseAnchors = [
  { lat: -23.561, lng: -46.655 },
  { lat: -23.565, lng: -46.651 }
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
    id: 'mc-1-1', ...offset(0, 0.04),
    type: 'alert', investigativeRole: 'symptom', stageAppeared: 1, system: 'Mobility',
    title: 'TRAFFIC GRIDLOCK', description: 'Radial Leste and Paulista Ave traffic speeds drop below 5 km/h.'
  },
  {
    id: 'mc-1-2', ...offset(1, 0.03),
    type: 'social', investigativeRole: 'symptom', stageAppeared: 1, system: 'Health',
    title: 'COMMUTER STRESS', description: '@citycommuter: I’m stuck for 3 hours, my heart is racing.'
  },
  // Stage 2 – Distractors / False Leads
  {
    id: 'mc-2-1', ...offset(0, 0.05),
    type: 'false_lead', investigativeRole: 'false_lead', stageAppeared: 2, system: 'Energy',
    title: 'POWER LINE DAMAGE', description: 'Rumor that a downed power line caused traffic lights to fail.'
  },
  // Stage 3 – Secondary Clues
  {
    id: 'mc-3-1', ...offset(1, 0.04),
    type: 'alert', investigativeRole: 'secondary_clue', stageAppeared: 3, system: 'Air',
    title: 'HAZARDOUS MATERIAL LEAK', description: 'Sensors detect benzene vapors near the accident site.'
  },
  // Stage 4 – Root Clue
  {
    id: 'mc-4-1', ...offset(0, 0.02),
    type: 'alert', investigativeRole: 'root_clue', stageAppeared: 4, system: 'Mobility',
    title: 'HAZMAT ACCIDENT', description: 'A tanker carrying hazardous chemicals overturned, blocking the Radial Leste.'
  },
  // Stage 5 – Convergence
  {
    id: 'mc-5-1', ...offset(1, 0.015),
    type: 'news', investigativeRole: 'root_clue', stageAppeared: 5, system: 'Mobility',
    title: 'CITYWIDE SHUTDOWN', description: 'Mayor declares emergency, closes subway lines and redirects traffic.'
  }
];

const charts: ChartConfig[] = [
  {
    id: 'chart-mc-1',
    title: 'Traffic Flow Line',
    type: 'line',
    measureDescription: 'Average vehicle speed per stage.',
    hiddenRole: 'Misleading Metric: Shows speed drop suggesting generic congestion, not the hazardous spill.',
    data: [
      { stage: 1, speed: 8 },
      { stage: 2, speed: 6 },
      { stage: 3, speed: 4 },
      { stage: 4, speed: 2 },
      { stage: 5, speed: 0 }
    ]
  },
  {
    id: 'chart-mc-2',
    title: 'Hazard Spread Radar',
    type: 'radar',
    measureDescription: 'Benzene concentration vs. safe zones.',
    hiddenRole: 'Root Clue: Highlights the hotspot where the spill originated.',
    data: [
      { metric: 'Benzene ppm', AccidentSite: 95, Neighbor1: 20, Neighbor2: 10 },
      { metric: 'Air Quality Index', AccidentSite: 180, Neighbor1: 80, Neighbor2: 70 }
    ]
  }
];

export const mobilityCollapseContext: Omit<ScenarioContext, 'id'> = {
  title: 'Mobility Collapse on Paulista Axis',
  code: 'CRISIS-08',
  rootCauseSystem: 'Mobility',
  description: 'Hidden cause: a hazardous material accident blocks the main artery, causing citywide paralysis.',
  dossier: "Mayor's Advisor: 'Entire blocks were evacuated due to a hazardous spill on the Radial. Sensors warn of a leak, subway closed. Blame the power outage on the east axis.'",
  stageTexts: {
    1: 'Traffic: extreme slowness on Radial Leste / Paulista Ave.',
    2: 'Energy: false rumor of power line failure spreads.',
    3: 'Air: benzene detected, health alerts issued.',
    4: 'Mobility: tanker overturns, blocking main road.',
    5: 'City: emergency declared, subway paralyzed.'
  },
  hotspots,
  chartData: [],
  chartConfigs: charts
};
