import { ScenarioContext, Hotspot, ChartConfig } from '@/store/useCrisisStore';

// Base anchors for Parelheiros area
const baseAnchors = [
  { lat: -23.827, lng: -46.727 },
  { lat: -23.959, lng: -46.784 }
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
    id: 'ls-1-1', ...offset(0, 0.04),
    type: 'alert', investigativeRole: 'symptom', stageAppeared: 1, system: 'Soil',
    title: 'HEAVY RAIN ALERT', description: 'Meteorology: 120mm of rain forecast for the next 24h in Parelheiros.'
  },
  {
    id: 'ls-1-2', ...offset(1, 0.03),
    type: 'social', investigativeRole: 'symptom', stageAppeared: 1, system: 'Vegetation',
    title: 'TREE LOSS', description: '@local: Residents report many trees uprooted after recent storms.'
  },
  // Stage 2 – Distractors / False Leads
  {
    id: 'ls-2-1', ...offset(0, 0.05),
    type: 'false_lead', investigativeRole: 'false_lead', stageAppeared: 2, system: 'Energy',
    title: 'POWER LINE FAILURE', description: 'Rumor: A nearby power line snapped, causing ground vibrations.'
  },
  // Stage 3 – Secondary Clues
  {
    id: 'ls-3-1', ...offset(1, 0.04),
    type: 'alert', investigativeRole: 'secondary_clue', stageAppeared: 3, system: 'Water',
    title: 'STREAM OVERFLOW', description: 'Hydro: Small streams in the hills are overflowing, eroding slopes.'
  },
  // Stage 4 – Root Clue
  {
    id: 'ls-4-1', ...offset(0, 0.02),
    type: 'alert', investigativeRole: 'root_clue', stageAppeared: 4, system: 'Vegetation',
    title: 'DEFORESTATION SPOT', description: 'Satellite: Detected illegal deforestation on the hill crest, removing root support.'
  },
  // Stage 5 – Convergence
  {
    id: 'ls-5-1', ...offset(1, 0.015),
    type: 'news', investigativeRole: 'root_clue', stageAppeared: 5, system: 'Soil',
    title: 'LANDSLIDE OCCURS', description: 'Breaking: Massive landslide blocks Parelheiros Road, casualties reported.'
  }
];

const charts: ChartConfig[] = [
  {
    id: 'chart-ls-1',
    title: 'Rainfall Accumulation',
    type: 'line',
    measureDescription: 'Cumulative rain over the 5 stages.',
    hiddenRole: 'Misleading Metric: Shows increasing rain, suggesting weather is the sole cause.',
    data: [
      { stage: 1, rain: 30 },
      { stage: 2, rain: 55 },
      { stage: 3, rain: 80 },
      { stage: 4, rain: 110 },
      { stage: 5, rain: 130 }
    ]
  },
  {
    id: 'chart-ls-2',
    title: 'Deforestation Radar',
    type: 'radar',
    measureDescription: 'Area of forest loss vs. stable zones.',
    hiddenRole: 'Root Clue: Highlights the zero‑forest sector where the slide originated.',
    data: [
      { metric: 'Forest Cover', Parelheiros: 2, Neighbor1: 45, Neighbor2: 50 },
      { metric: 'Slope Stability', Parelheiros: 15, Neighbor1: 80, Neighbor2: 85 }
    ]
  }
];

export const landslideContext: Omit<ScenarioContext, 'id'> = {
  title: 'Landslide in Parelheiros',
  code: 'CRISIS-06',
  rootCauseSystem: 'Vegetation',
  description: 'Hidden cause: illegal deforestation leaves slopes unsupported, heavy rain triggers collapse.',
  dossier: "Mayor's Advisor: 'The rural roads of Marsilac are blocked, poles fell into mud. Focus on severe weather narrative, but the real issue is illegal logging.'",
  stageTexts: {
    1: 'Soil: saturation on slopes; Vegetation: trees uprooted.',
    2: 'Energy: false rumor of power line; Social: panic spreads.',
    3: 'Water: streams overflow, eroding soil.',
    4: 'Vegetation: satellite confirms deforestation hotspot.',
    5: 'Soil: landslide devastates road, casualties reported.'
  },
  hotspots,
  chartData: [],
  chartConfigs: charts
};
