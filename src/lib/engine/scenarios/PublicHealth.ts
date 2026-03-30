import { ScenarioContext, Hotspot, ChartConfig } from '@/store/useCrisisStore';
import { addLayerDistractors } from './scenarioUtils';

// Base anchors for Heliópolis area
const baseAnchors = [
  { lat: -23.607, lng: -46.606 },
  { lat: -23.612, lng: -46.601 }
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
    id: 'ph-1-1', ...offset(0, 0.04),
    type: 'news', investigativeRole: 'symptom', stageAppeared: 1, system: 'Health',
    title: 'FEVER CLUSTER',
    description: 'Health: sudden rise in fever cases reported in Heliópolis and Ipiranga.'
  },
  // Stage 2 – Distractors / False Leads
  {
    id: 'ph-2-1', ...offset(1, 0.05),
    type: 'false_lead', investigativeRole: 'false_lead', stageAppeared: 2, system: 'Energy',
    title: 'POWER OUTAGE RUMOR',
    description: 'Rumor spreads that a transformer failure caused the health surge.'
  },
  // Stage 3 – Secondary Clues
  {
    id: 'ph-3-1', ...offset(0, 0.04),
    type: 'alert', investigativeRole: 'secondary_clue', stageAppeared: 3, system: 'Waste',
    title: 'STAGNANT WATER',
    description: 'Environmental alert: open sewers and stagnant water containers found in alleys.'
  },
  // Stage 4 – Root Clue
  {
    id: 'ph-4-1', ...offset(1, 0.02),
    type: 'alert', investigativeRole: 'root_clue', stageAppeared: 4, system: 'Waste',
    title: 'OPEN SEWER',
    description: 'Investigation reveals open sewer network leaking into neighborhoods, breeding mosquitoes.'
  },
  // Stage 5 – Convergence
  {
    id: 'ph-5-1', ...offset(0, 0.015),
    type: 'news', investigativeRole: 'root_clue', stageAppeared: 5, system: 'Health',
    title: 'DENGUE OUTBREAK DECLARED',
    description: 'Official health emergency: dengue cases exceed 800, hospitals overwhelmed.'
  }
];

const charts: ChartConfig[] = [
  {
    id: 'chart-ph-1',
    title: 'Dengue Cases Over Stages',
    type: 'line',
    measureDescription: 'Cumulative reported dengue cases per investigation stage against UBS surge capacity.',
    hiddenRole: 'Misleading Metric: Shows a steady rise suggesting natural spread, while the root cause is the open sewer and stagnant water network.',
    data: [
      { stage: 1, cases: 120, ubsCapacity: 180 },
      { stage: 2, cases: 250, ubsCapacity: 180 },
      { stage: 3, cases: 420, ubsCapacity: 180 },
      { stage: 4, cases: 620, ubsCapacity: 180 },
      { stage: 5, cases: 820, ubsCapacity: 180 }
    ]
  },
  {
    id: 'chart-ph-2',
    title: 'Water vs Waste Radar',
    type: 'radar',
    measureDescription: 'Comparison of water contamination, waste accumulation, and heat stress in vector formation.',
    hiddenRole: 'Root Clue: Highlights waste and standing water as the dominant drivers, with heat accelerating the outbreak.',
    data: [
      { metric: 'Contamination (ppm)', Water: 15, Waste: 85, Heat: 42 },
      { metric: 'Mosquito Index', Water: 30, Waste: 90, Heat: 78 },
      { metric: 'Standing Water', Water: 42, Waste: 94, Heat: 60 },
      { metric: 'Drainage Failure', Water: 28, Waste: 88, Heat: 35 }
    ]
  },
  {
    id: 'chart-ph-3',
    title: 'Case Load vs Field Response',
    type: 'stacked_bar',
    measureDescription: 'Suspected dengue cases compared with admitted patients as the response system strains.',
    hiddenRole: 'Operational Impact: shows the health network falling behind the outbreak even after field response intensifies.',
    data: [
      { stage: 1, suspectedCases: 90, admittedPatients: 25 },
      { stage: 2, suspectedCases: 180, admittedPatients: 48 },
      { stage: 3, suspectedCases: 320, admittedPatients: 76 },
      { stage: 4, suspectedCases: 500, admittedPatients: 110 },
      { stage: 5, suspectedCases: 760, admittedPatients: 155 }
    ]
  }
];

export const publicHealthContext: Omit<ScenarioContext, 'id'> = {
  title: 'Public Health Emergency in Heliópolis',
  code: 'CRISIS-10',
  rootCauseSystem: 'Waste',
  description: 'Hidden cause: open sewer + extreme heat = dengue outbreak',
  dossier: "Mayor's Advisor: 'Boss, the number of crowded stretchers at the Ipiranga UBS broke a record today. The perceived temperature in Heliópolis is boiling and the alleys look like stagnant streams. I would blame it on the harsh summer and sudden overpopulation.'",
  stageTexts: {
    1: 'Health: clustered fever cases in Heliópolis and Ipiranga',
    2: 'Water: sewage detected in stream; waste: accumulation of stagnant water containers',
    3: 'Temperature: intense heat island (+5°C) — vector accelerator',
    4: 'Air: emergency fogging detected (fumacê)',
    5: '800 confirmed cases; Heliópolis UBS in collapse'
  },
  hotspots: addLayerDistractors(hotspots, 'CRISIS-10', baseAnchors),
  chartData: [],
  chartConfigs: charts
};
