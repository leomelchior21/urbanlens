import { ScenarioContext, Hotspot, ChartConfig } from '@/store/useCrisisStore';

// Base anchors for Guarulhos area
const baseAnchors = [
  { lat: -23.430, lng: -46.503 },
  { lat: -23.456, lng: -46.478 }
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
    id: 'wc-1-1', ...offset(0, 0.04),
    type: 'news', investigativeRole: 'symptom', stageAppeared: 1, system: 'Waste',
    title: 'LANDFILL FIRE ALERT', description: 'Local news reports a fire igniting at the Guarulhos landfill, thick black smoke visible for kilometers.'
  },
  {
    id: 'wc-1-2', ...offset(1, 0.03),
    type: 'social', investigativeRole: 'symptom', stageAppeared: 1, system: 'Air',
    title: 'SMOG OVER GUARULHOS', description: '@citywatcher: The sky is a permanent orange haze. Breathing feels like inhaling ash.'
  },
  {
    id: 'wc-1-3', ...offset(0, 0.02),
    type: 'complaint', investigativeRole: 'symptom', stageAppeared: 1, system: 'Health',
    title: 'RESPIRATORY SURGES', description: 'PROCON: Emergency rooms report a 30% rise in asthma attacks linked to the landfill plume.'
  },
  {
    id: 'wc-1-4', ...offset(1, 0.05),
    type: 'internal_email', investigativeRole: 'false_lead', stageAppeared: 1, system: 'Waste',
    title: 'PREPARE FOR EVACUATION', description: 'Memo: "If the fire spreads to the adjacent industrial zone, we may need to relocate nearby factories."'
  },
  // Stage 2 – Distractors / False Leads
  {
    id: 'wc-2-1', ...offset(0, 0.06),
    type: 'false_lead', investigativeRole: 'false_lead', stageAppeared: 2, system: 'Energy',
    title: 'POWER SURGE CLAIM', description: 'Local rumor suggests the fire is causing a city‑wide power surge, but sensors show normal load.'
  },
  {
    id: 'wc-2-2', ...offset(1, 0.04),
    type: 'social', investigativeRole: 'distractor', stageAppeared: 2, system: 'Social',
    title: 'PROTESTS AGAINST MUNICIPALITY', description: '@activist: "We demand the city stop dumping waste here!"'
  },
  // Stage 3 – Secondary Clues
  {
    id: 'wc-3-1', ...offset(0, 0.03),
    type: 'alert', investigativeRole: 'secondary_clue', stageAppeared: 3, system: 'Water',
    title: 'LEACHATE CONTAMINATION', description: 'Environmental agency alerts: toxic leachate from the fire is seeping into nearby streams.'
  },
  {
    id: 'wc-3-2', ...offset(1, 0.04),
    type: 'hint', investigativeRole: 'secondary_clue', stageAppeared: 3, system: 'Soil',
    title: 'SOIL PH DROP', description: 'Field report: Soil pH near the landfill dropped dramatically, indicating acid runoff.'
  },
  // Stage 4 – Root Clue
  {
    id: 'wc-4-1', ...offset(0, 0.02),
    type: 'alert', investigativeRole: 'root_clue', stageAppeared: 4, system: 'Waste',
    title: 'ILLEGAL DUMPING NETWORK', description: 'Investigation uncovers a hidden network of illegal waste trucks feeding the landfill, bypassing permits.'
  },
  {
    id: 'wc-4-2', ...offset(1, 0.03),
    type: 'internal_email', investigativeRole: 'secondary_clue', stageAppeared: 4, system: 'Health',
    title: 'HOSPITAL SUPPLY SHORTAGE', description: 'Email: "Ventilators are running low due to increased respiratory cases from the plume."'
  },
  // Stage 5 – Convergence / Final
  {
    id: 'wc-5-1', ...offset(0, 0.015),
    type: 'news', investigativeRole: 'root_clue', stageAppeared: 5, system: 'Waste',
    title: 'CATASTROPHIC EXPLOSION', description: 'Breaking: Accumulated gases ignite, causing a massive explosion that disables major road arteries.'
  },
  {
    id: 'wc-5-2', ...offset(1, 0.02),
    type: 'alert', investigativeRole: 'symptom', stageAppeared: 5, system: 'Air',
    title: 'SMOG PEAK', description: 'Air quality index spikes to hazardous levels across the entire municipality.'
  }
];

const charts: ChartConfig[] = [
  {
    id: 'chart-wc-1',
    title: 'Fire Intensity Over Time',
    type: 'line',
    measureDescription: 'Thermal sensor readings from the landfill perimeter.',
    hiddenRole: 'Misleading Metric: Shows rising temperature suggesting a natural fire, while the root cause is illegal waste accumulation.',
    data: [
      { stage: 1, temp: 45 },
      { stage: 2, temp: 58 },
      { stage: 3, temp: 70 },
      { stage: 4, temp: 85 },
      { stage: 5, temp: 0 } // fire extinguished after explosion
    ]
  },
  {
    id: 'chart-wc-2',
    title: 'Leachate Contamination Radar',
    type: 'radar',
    measureDescription: 'Concentration of pollutants across nearby water bodies.',
    hiddenRole: 'Zone Comparison: Highlights the extreme contamination in the Guarulhos basin versus surrounding clean streams.',
    data: [
      { metric: 'Heavy Metals', Guarulhos: 92, Neighbor1: 12, Neighbor2: 8 },
      { metric: 'pH', Guarulhos: 4.2, Neighbor1: 6.8, Neighbor2: 7.0 },
      { metric: 'Turbidity', Guarulhos: 78, Neighbor1: 15, Neighbor2: 10 }
    ]
  },
  {
    id: 'chart-wc-3',
    title: 'Health Impact Stacked Bar',
    type: 'stacked_bar',
    measureDescription: 'Number of respiratory cases vs. fire‑related injuries per stage.',
    hiddenRole: 'Root Clue: Shows the sharp rise in respiratory admissions aligning with fire progression.',
    data: [
      { stage: 1, respCases: 20, injuries: 2 },
      { stage: 2, respCases: 45, injuries: 5 },
      { stage: 3, respCases: 80, injuries: 12 },
      { stage: 4, respCases: 150, injuries: 30 },
      { stage: 5, respCases: 300, injuries: 70 }
    ]
  }
];

export const wasteCollapseContext: Omit<ScenarioContext, 'id'> = {
  title: 'Waste Collapse in Guarulhos',
  code: 'CRISIS-05',
  rootCauseSystem: 'Waste',
  description: 'Hidden cause: illegal waste dumping fuels a runaway landfill fire that contaminates air, water, and health.',
  dossier: "Mayor's Advisor: 'The air quality is unviable and flights from the airport are at risk of diversion. People are already coughing in local hospitals. Issue a note saying that the temperature change and the cold front that hasn't arrived aggravated the metropolitan dust.'",
  stageTexts: {
    1: 'Waste: ignition at the Guarulhos landfill; thick smoke spreads.',
    2: 'Air: AQI reaches "Very Poor"; residents report choking.',
    3: 'Water: leachate contaminates nearby streams; pH drops.',
    4: 'Health: hospitals overwhelmed with respiratory cases; supply shortages.',
    5: 'Explosion: gas buildup triggers a massive blast, crippling transport.'
  },
  hotspots,
  chartData: [],
  chartConfigs: charts
};
