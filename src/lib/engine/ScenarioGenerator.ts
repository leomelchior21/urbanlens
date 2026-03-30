import { ScenarioContext, SystemType, Hotspot } from "@/store/useCrisisStore";

export interface ScenarioData extends Partial<ScenarioContext> {
  anchors: { lat: number, lng: number }[];
  dossier: string;
}

export const MOCK_SCENARIOS: ScenarioData[] = [
  {
    title: "Water Collapse in ABC",
    code: "CRISIS-01",
    rootCauseSystem: "Water",
    description: "Hidden cause: water main break in Santo André",
    dossier: "Mayor's Advisor: 'Mayor, the press is going crazy calling me. Traffic on Industrial Ave froze with a convoy of water trucks and the asphalt seems to be sinking. The heat is only making tempers worse. Say in the official notes that it's just natural wear and tear of the asphalt from the sun.'",
    stageTexts: {
      1: "Low pressure detected at 3 water points in ABC",
      2: "Temperature rises +2°C in Santo André (asphalt without moisture); trash accumulates (no collection due to traffic jam)",
      3: "Critical traffic: 5 water trucks block Industrial Ave; public health: 12 reports of dehydration",
      4: "Soil: subsidence detected in 2 points (broken pipes underground); energy: pumping overloaded",
      5: "Zone of 4 neighborhoods without water; hospitals on alert; vegetation: irrigation collapse in parks"
    },
    anchors: [ { lat: -23.664, lng: -46.532 }, { lat: -23.667, lng: -46.461 }, { lat: -23.694, lng: -46.565 } ]
  },
  {
    title: "Heat Wave in East Zone",
    code: "CRISIS-02",
    rootCauseSystem: "Vegetation",
    description: "Hidden cause: near-zero tree cover amplifying thermal radiation + AC failure",
    dossier: "Mayor's Advisor: 'Boss, hospitals in Itaquera are receiving fainting elderly people and the electrical demand to try to cool the region skyrocketed from one hour to the next. The east zone has turned into an oven, but don't mention the lack of trees.'",
    stageTexts: {
      1: "Temperature: +4°C in Itaquera, Guaianases, Cidade Tiradentes",
      2: "Health: elderly with sunstroke; UBSs crowded; energy: peak consumption",
      3: "Water: hydrants activated as large showers (pressure drop); traffic: buses stopping due to overheating",
      4: "Vegetation: zero tree cover detected — confirms extreme heat island; air: AQI 'Poor'",
      5: "Blackout in 3 substations due to AC demand; localized public health collapse"
    },
    anchors: [ { lat: -23.537, lng: -46.456 }, { lat: -23.588, lng: -46.397 } ]
  },
  {
    title: "Tiete River Flood",
    code: "CRISIS-03",
    rootCauseSystem: "Waste",
    description: "Hidden cause: illegal solid waste dumping blocks Edgard de Souza dam gates",
    dossier: "Mayor's Advisor: 'URGENT: The Marginal is already jamming due to the volume of accumulated water. The Osasco basins are stressed under the volume and the soil is not absorbing fast. I advised Civil Defense not to declare a state of emergency yet so as not to panic the industries at the substation.'",
    stageTexts: {
      1: "Tietê level rising: sensors in Osasco and Carapicuíba on alert",
      2: "Traffic: Marginal Tietê partially closed; waste: floating plastic islands detected",
      3: "Soil: saturation in Várzea do Carmo; water: severe contamination by waste",
      4: "Energy: Osasco substation at risk of flooding due to backed-up drainage",
      5: "Evacuation of 3 neighborhoods; health: leptospirosis under monitoring"
    },
    anchors: [ { lat: -23.526, lng: -46.822 }, { lat: -23.532, lng: -46.792 } ]
  },
  {
    title: "Cascading Blackout in Central Region",
    code: "CRISIS-04",
    rootCauseSystem: "Energy",
    description: "Hidden cause: overload at Bandeirantes substation due to night industrial demand",
    dossier: "Mayor's Advisor: 'Monitoring reports that the traffic lights in the central region simply went completely dark. City hall vans bumped into double queues, no one can collect trash in the central-west today. Blame the traffic and shield our secretariat.'",
    stageTexts: {
      1: "Energy: fluctuation detected in the mid-west grid",
      2: "Traffic: traffic lights off at 40 intersections; accidents",
      3: "Health: Santa Casa hospital on generator; water: supply pumps stopped",
      4: "Waste: cold sorting rooms offline; air: monitoring UPS offline",
      5: "200k households without electricity; subway line 2 stopped"
    },
    anchors: [ { lat: -23.536, lng: -46.664 }, { lat: -23.538, lng: -46.645 } ]
  },
  {
    title: "Waste Collapse in Guarulhos",
    code: "CRISIS-05",
    rootCauseSystem: "Waste",
    description: "Hidden cause: street sweepers strike + landfill fire",
    dossier: "Mayor's Advisor: 'The air quality is unviable and flights from the airport are at risk of diversion. People are already coughing in local hospitals. Issue a note saying that the temperature change and the cold front that hasn't arrived aggravated the metropolitan dust.'",
    stageTexts: {
      1: "Waste: accumulation at 8 critical points in Guarulhos",
      2: "Air: AQI 'Very Poor' — landfill smoke; health: respiratory",
      3: "Soil: leachate detected near Baquirivu-Guaçu",
      4: "Water: contamination in 2 water sources; temperature: +1.5°C from smoke",
      5: "GRU Airport on alert (visibility); 3 schools closed"
    },
    anchors: [ { lat: -23.430, lng: -46.503 }, { lat: -23.456, lng: -46.478 } ]
  },
  {
    title: "Landslide in Parelheiros",
    code: "CRISIS-06",
    rootCauseSystem: "Vegetation",
    description: "Hidden cause: soil degraded by irregular deforestation + heavy rain",
    dossier: "Mayor's Advisor: 'Mayor, the rural roads of Marsilac are completely blocked and poles from the end of the grid fell into the mud. They can't drain or send teams. Focus on the narrative of exceptional severe weather that knocked down the power grid.'",
    stageTexts: {
      1: "Soil: saturation on slopes of Parelheiros and Marsilac",
      2: "Vegetation: minimal tree cover detected on edges",
      3: "Water: overflowing streams; traffic: Parelheiros Road blocked",
      4: "Health: 20 homeless; energy: fallen pole on Saibro Road",
      5: "Risk area with 3 confirmed landslides"
    },
    anchors: [ { lat: -23.827, lng: -46.727 }, { lat: -23.959, lng: -46.784 } ]
  },
  {
    title: "Air Crisis in Metropolitan Region",
    code: "CRISIS-07",
    rootCauseSystem: "Air",
    description: "Hidden cause: thermal inversion + fires in the metropolitan belt",
    dossier: "Mayor's Advisor: 'Respiratory health indicators skyrocketed bizarrely in Mogi. Visibility on the roads dropped so much that we had three ugly collisions this morning. Tell the council there is a stationary thermal front and we are monitoring the fog.'",
    stageTexts: {
      1: "Air: Elevated PM2.5 in Mogi das Cruzes, Suzano, Itaquaquecetuba",
      2: "Health: 30% increase in respiratory care",
      3: "Temperature: layer of fog traps heat (+3°C)",
      4: "Traffic: highways with reduced visibility; vegetation: fire outbreaks",
      5: "State of environmental emergency; schools suspended"
    },
    anchors: [ { lat: -23.523, lng: -46.185 }, { lat: -23.542, lng: -46.310 } ]
  },
  {
    title: "Mobility Collapse on Paulista Axis",
    code: "CRISIS-08",
    rootCauseSystem: "Mobility",
    description: "Hidden cause: accident with hazardous material on Radial Leste",
    dossier: "Mayor's Advisor: 'Entire blocks were evacuated there on the connection with the Radial due to damaged power lines. There's a sensor warning about a leak and the subway has already closed three loops. Comm asked to say that the power outage on the east axis caused the evacuation.'",
    stageTexts: {
      1: "Traffic: extreme slowness on Radial Leste / Paulista Ave",
      2: "Air: volatile product detected (benzene); health: block evacuation",
      3: "Energy: high-voltage cables damaged by accident",
      4: "Water: chemical product threatens Sapateiro stream",
      5: "Subway paralyzes 3 lines; 500k affected in mobility"
    },
    anchors: [ { lat: -23.561, lng: -46.655 }, { lat: -23.565, lng: -46.651 } ]
  },
  {
    title: "Water Shortage in Cantareira System",
    code: "CRISIS-09",
    rootCauseSystem: "Water",
    description: "Hidden cause: illegal abstraction + critically low volume due to drought",
    dossier: "Mayor's Advisor: 'Mayors upstream complained that the reservoir surroundings are drying up frighteningly fast and small grid hydro output is dropping. Try to say it's the fault of an extreme evaporation wave, but the weather hasn't even changed.'",
    stageTexts: {
      1: "Water: Cantareira volume dropping unexpectedly — sensors in Mairiporã",
      2: "Vegetation: surrounding greenery under severe drought stress",
      3: "Health: localized supply restrictions ordered in 5 municipalities",
      4: "Energy: small hydro generator offline due to insufficient flow volume",
      5: "Emergency rationing declared for 8 million people in the macro-region"
    },
    anchors: [ { lat: -23.268, lng: -46.561 }, { lat: -23.317, lng: -46.587 } ]
  },
  {
    title: "Public Health Emergency in Heliopolis",
    code: "CRISIS-10",
    rootCauseSystem: "Waste",
    description: "Hidden cause: open sewer + extreme heat = dengue outbreak",
    dossier: "Mayor's Advisor: 'Boss, the number of crowded stretchers at the Ipiranga UBS broke a record today. The perceived temperature in Heliópolis is boiling and the alleys look like stagnant streams. I would blame it on the harsh summer and sudden overpopulation.'",
    stageTexts: {
      1: "Health: clustered fever cases in Heliópolis and Ipiranga",
      2: "Water: sewage detected in stream; waste: accumulation of stagnant water containers",
      3: "Temperature: intense heat island (+5°C) — vector accelerator",
      4: "Air: emergency fogging detected (fumacê)",
      5: "800 confirmed cases; Heliópolis UBS in collapse"
    },
    anchors: [ { lat: -23.607, lng: -46.606 }, { lat: -23.612, lng: -46.601 } ]
  }
];

export function randomOffset(base: number, range: number) {
  return base + (Math.random() - 0.5) * range;
}

// Helper to get generic chart data
export function generateChartData() {
  return Array.from({ length: 5 }).map((_, i) => ({
    stage: i + 1,
    temperature: 30 + i * Math.random() * 2,
    waterLevel: 50 + ((i*i) * Math.random() * 2),
    energyUsage: 70 + (i * Math.random() * 6),
    airQuality: 50 + (i * Math.random() * 15),
    trafficIndex: 20 + (i * Math.random() * 10),
    blockageLevel: Math.min(100, 30 + (i * 20)),
    canopyDeficit: 10 + (i * 4)
  }));
}

export function generateInstantBaseScenario(): ScenarioContext {
  const base = MOCK_SCENARIOS[Math.floor(Math.random() * MOCK_SCENARIOS.length)];
  return {
    id: `SCENARIO-${Date.now()}`,
    title: base.title || "Unknown Anomaly",
    code: base.code || "ERR-00",
    rootCauseSystem: base.rootCauseSystem as SystemType,
    description: base.description || "",
    dossier: base.dossier || "No data available.",
    stageTexts: base.stageTexts || {},
    hotspots: [], // Loaded asynchronously
    chartData: generateChartData(),
  };
}

export function generateMockHotspots(baseScenario: ScenarioContext): Hotspot[] {
  const hotspots: Hotspot[] = [];
  const systems: SystemType[] = ['Temperature', 'Air', 'Water', 'Energy', 'Mobility', 'Waste', 'Vegetation'];
  
  // Find original anchors
  const originalScenario = MOCK_SCENARIOS.find(s => s.code === baseScenario.code);
  const anchors = originalScenario?.anchors || [{lat: -23.55, lng: -46.63}];

  for (let i = 0; i < 25; i++) {
    const stageAppeared = Math.floor(Math.random() * 5) + 1;
    const anchor = anchors[Math.floor(Math.random() * anchors.length)];
    
    // We want ~10 distractors and ~15 true intelligence points
    const isDistractor = i >= 15;
    const isRoot = !isDistractor && Math.random() < 0.6;
    
    const system = isRoot ? baseScenario.rootCauseSystem : systems[Math.floor(Math.random() * systems.length)];
    const range = isRoot ? 0.02 : (isDistractor ? 0.09 : 0.05);

    // MUNDANE DISTRACTORS
    const distractors = [
      { type: 'social', title: 'NOISE COMPLAINT', sys: 'Social', msg: '@resident: My neighbor\'s party is blasting music since 4 AM! Someone call the cops!' },
      { type: 'complaint', title: 'POTHOLE DAMAGE', sys: 'Mobility', msg: 'PROCON 881: Tire exploded on a massive pothole in the avenue.' },
      { type: 'social', title: 'LOST PET', sys: 'Vegetation', msg: 'LOST DOG: Golden Retriever near the park. Please DM if found!' },
      { type: 'complaint', title: 'INTERNET OUTAGE', sys: 'Energy', msg: 'Fiber optic provider down again. Working from home is impossible today.' },
      { type: 'news', title: 'SPORTS UPDATE', sys: 'Social', msg: 'Local stadium preparing for the giant derby match tonight. Heavy traffic expected.' },
      { type: 'false_lead', title: 'UFO SIGHTING?', sys: 'Air', msg: '@tinfoil_hat: I swear I saw strange flashing lights in the clouds last night! Not a drone!' },
      { type: 'social', title: 'RESTAURANT RANT', sys: 'Social', msg: 'Terrible service at the new downtown bistro. Do not recommend.' },
      { type: 'complaint', title: 'BROKEN ATM', sys: 'Energy', msg: 'Bank terminal near the metro station swallowed my card.' }
    ];

    // REAL INTELLIGENCE TEMPLATES
    const getTrueMessage = (sys: SystemType, t: Hotspot['type'], root: boolean) => {
      const templates = {
        news: [
          `BREAKING: Local authorities investigating unexpected ${sys} infrastructure anomalies.`,
          `News Alert: Services disrupted as ${sys} systems report unprecedented strain.`,
          `Live: Reporters on the ground note visible impact on ${sys} networks in the zone.`
        ],
        social: [
          `@sp_citizen: This is ridiculous! The ${sys} situation here is completely out of control! 😡`,
          `@urban_watcher: Anyone else noticing the weird ${sys} issues? Something is not right...`,
          `@daily_commuter: Stuck again. They said the ${sys} was fixed. It's WORSE.`
        ],
        complaint: [
          `PROCON Ticket #019: Consecutive ${sys} failures. Requesting immediate municipal action.`,
          `Call center overwhelmed: 4,000+ complaints mapping directly to ${sys} sector.`,
          `Neighborhood association filing class action over ${sys} mismanagement.`
        ],
        alert: [
          `AUTOMATED WARNING: Threshold exceeded in ${sys} node.`,
          `SYSTEM ALERT: Critical instability propagating through ${sys} sub-grid.`,
          `NODE FAILURE: ${sys} sensor offline. Dispatching team.`
        ],
        hint: [
          `Field Unit: Traces suggest the ${sys} failure is compounding secondary sectors.`,
          `Internal Memo: Do not dismiss the ${sys} logs, they might be the origin point.`
        ]
      };

      const generic = [`Unverified report of primary damage hitting ${sys} grids.`];
      const category = templates[t as keyof typeof templates] || generic;
      return category[Math.floor(Math.random() * category.length)];
    };

    let finalType, finalTitle, finalDesc, finalSystem;

    if (isDistractor) {
      const d = distractors[Math.floor(Math.random() * distractors.length)];
      finalType = d.type as Hotspot['type'];
      finalTitle = d.title;
      finalDesc = d.msg;
      finalSystem = (d.sys === 'Social' ? 'Mobility' : d.sys) as SystemType;
    } else {
      const types: Hotspot['type'][] = ['news', 'social', 'complaint', 'alert', 'hint'];
      finalType = types[Math.floor(Math.random() * types.length)];
      finalTitle = finalType === 'social' ? 'CITIZEN REPORT' : finalType === 'news' ? 'MEDIA INTERCEPT' : finalType === 'alert' ? 'SYSTEM_ALERT' : 'FIELD_ADVISORY';
      finalDesc = getTrueMessage(system, finalType, isRoot);
      finalSystem = system;
    }

    hotspots.push({
      id: `hs-${i}-${Date.now()}`,
      lat: randomOffset(anchor.lat, range),
      lng: randomOffset(anchor.lng, range),
      type: finalType,
      title: finalTitle,
      description: finalDesc,
      system: finalSystem,
      stageAppeared
    });
  }
  return hotspots;
}
