import { ScenarioContext, Hotspot, ChartConfig } from '@/store/useCrisisStore';
import { addLayerDistractors } from './scenarioUtils';

// Base anchors for Metropolitan Region
const baseAnchors = [
  { lat: -23.523, lng: -46.185 },
  { lat: -23.542, lng: -46.310 }
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
    id: 'ac-1-1', ...offset(0, 0.04),
    type: 'alert', investigativeRole: 'symptom', stageAppeared: 1, system: 'Air',
    title: 'PM2.5 SPIKE', description: 'Air quality monitors report PM2.5 levels exceeding 150 µg/m³ in Mogi das Cruzes.'
  },
  {
    id: 'ac-1-2', ...offset(1, 0.03),
    type: 'social', investigativeRole: 'symptom', stageAppeared: 1, system: 'Health',
    title: 'ASTHMA SURGE', description: '@citizen: My son can’t breathe, the air is choking us.'
  },
  // Stage 2 – Distractors / False Leads
  {
    id: 'ac-2-1', ...offset(0, 0.05),
    type: 'false_lead', investigativeRole: 'false_lead', stageAppeared: 2, system: 'Energy',
    title: 'POWER OUTAGE RUMOR', description: 'Rumor spreads that a transformer failure caused the smog.'
  },
  // Stage 3 – Secondary Clues
  {
    id: 'ac-3-1', ...offset(1, 0.04),
    type: 'alert', investigativeRole: 'secondary_clue', stageAppeared: 3, system: 'Vegetation',
    title: 'FIRE OUTBREAK', description: 'Satellite detects multiple small fires in the metropolitan belt.'
  },
  // Stage 4 – Root Clue
  {
    id: 'ac-4-1', ...offset(0, 0.02),
    type: 'alert', investigativeRole: 'root_clue', stageAppeared: 4, system: 'Air',
    title: 'THERMAL INVERSION', description: 'Meteorology confirms a strong thermal inversion trapping pollutants near ground level.'
  },
  // Stage 5 – Convergence
  {
    id: 'ac-5-1', ...offset(1, 0.015),
    type: 'news', investigativeRole: 'root_clue', stageAppeared: 5, system: 'Air',
    title: 'EMERGENCY DECLARED', description: 'State of environmental emergency issued; schools suspended and traffic halted.'
  }
];

const charts: ChartConfig[] = [
  {
    id: 'chart-ac-1',
    title: 'PM2.5 Trend',
    type: 'line',
    measureDescription: 'PM2.5 concentration across stages against the health-safe limit.',
    hiddenRole: 'Misleading Metric: Shows rising PM2.5 suggesting only pollution, while inversion is the hidden cause trapping it in place.',
    data: [
      { stage: 1, pm: 120, safeLimit: 50 },
      { stage: 2, pm: 140, safeLimit: 50 },
      { stage: 3, pm: 160, safeLimit: 50 },
      { stage: 4, pm: 180, safeLimit: 50 },
      { stage: 5, pm: 200, safeLimit: 50 }
    ]
  },
  {
    id: 'chart-ac-2',
    title: 'Fire Radar',
    type: 'radar',
    measureDescription: 'Fire and atmospheric stress across the main affected municipalities.',
    hiddenRole: 'Root Clue: Highlights the green-belt fire belt lining up with the worst smoke density and visibility loss.',
    data: [
      { metric: 'Fire Intensity', Mogi: 85, Suzano: 76, Itaquaquecetuba: 68 },
      { metric: 'Smoke Density', Mogi: 90, Suzano: 82, Itaquaquecetuba: 74 },
      { metric: 'Visibility Loss', Mogi: 78, Suzano: 71, Itaquaquecetuba: 66 },
      { metric: 'ER Load', Mogi: 84, Suzano: 69, Itaquaquecetuba: 63 }
    ]
  },
  {
    id: 'chart-ac-3',
    title: 'Visibility Loss vs Respiratory Load',
    type: 'stacked_bar',
    measureDescription: 'Highway visibility loss compared with respiratory admissions as the smog layer intensifies.',
    hiddenRole: 'Cross-System Correlation: makes the mobility and health damage legible as a direct consequence of air stagnation.',
    data: [
      { stage: 1, visibilityLoss: 15, respiratoryAdmissions: 20 },
      { stage: 2, visibilityLoss: 30, respiratoryAdmissions: 40 },
      { stage: 3, visibilityLoss: 45, respiratoryAdmissions: 58 },
      { stage: 4, visibilityLoss: 70, respiratoryAdmissions: 85 },
      { stage: 5, visibilityLoss: 90, respiratoryAdmissions: 120 }
    ]
  }
];

export const airCrisisContext: Omit<ScenarioContext, 'id'> = {
  title: 'Air Crisis in Metropolitan Region',
  code: 'CRISIS-07',
  rootCauseSystem: 'Air',
  description: 'Hidden cause: thermal inversion combined with uncontrolled fires creates a hazardous smog layer.',
  dossier: "Mayor's Advisor: 'Respiratory health indicators skyrocketed in Mogi. Visibility dropped, causing collisions. Tell the council there is a stationary thermal front and we are monitoring the fog.'",
  stageTexts: {
    1: 'Air: Elevated PM2.5 in Mogi das Cruzes, Suzano, Itaquaquecetuba.',
    2: 'Health: 30% increase in respiratory care.',
    3: 'Temperature: Fog layer traps heat (+3°C).',
    4: 'Traffic: Reduced visibility; vegetation fires erupt.',
    5: 'State of emergency; schools suspended.'
  },
  hotspots: addLayerDistractors(hotspots, 'CRISIS-07', baseAnchors),
  chartData: [],
  chartConfigs: charts
};
