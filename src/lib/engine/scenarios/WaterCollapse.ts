import { ScenarioContext, Hotspot, ChartConfig } from "@/store/useCrisisStore";

/**
 * CRISIS-01: Water Collapse in ABC
 * 
 * Logic Chain:
 * Stage 1: Heat wave assumption. High temps reported, traffic jams start.
 * Stage 2: False Lead - Suspicions of a sinkhole or road structure failure closing Industrial Ave.
 * Stage 3: Clues point towards soil and unusual anomalies underground, away from usual pothole logic.
 * Stage 4: Massive disparity between pumping pressure and distribution. Point of convergence.
 * Stage 5: Underground main line burst confirmed. Water loss.
 */

const baseAnchors = [
  { lat: -23.664, lng: -46.532 }, // Central Santo André
  { lat: -23.667, lng: -46.461 }, // More east
  { lat: -23.694, lng: -46.565 }  // Further south
];

// Reusing randomOffset from generator for minor spread
function offset(anchorIdx: number, range: number) {
  const anchor = baseAnchors[anchorIdx % baseAnchors.length];
  return {
    lat: anchor.lat + (Math.random() - 0.5) * range,
    lng: anchor.lng + (Math.random() - 0.5) * range
  };
}

const hotspots: Hotspot[] = [
  // STAGE 1: The Initial Symptoms and Distractors
  {
    id: "hs-1-1", ...offset(0, 0.05),
    type: "social", investigativeRole: "symptom", stageAppeared: 1, system: "Temperature",
    title: "BLISTERING HEAT", description: "@ABC_resident: The thermometer just hit 35C in Santo André. The asphalt feels like it's melting! Need rain desperately."
  },
  {
    id: "hs-1-2", ...offset(1, 0.08),
    type: "complaint", investigativeRole: "distractor", stageAppeared: 1, system: "Mobility",
    title: "TRAFFIC LIGHT DEAD", description: "PROCON: Traffic lights at intersection 44 completely offline. Causing massive headaches."
  },
  {
    id: "hs-1-3", ...offset(0, 0.02),
    type: "social", investigativeRole: "symptom", stageAppeared: 1, system: "Mobility",
    title: "GRIDLOCK", description: "@daily_commuter: Stuck on Industrial Ave. Apparently a bunch of water trucks are blocking the right lane? What is going on?"
  },
  {
    id: "hs-1-4", ...offset(2, 0.05),
    type: "news", investigativeRole: "distractor", stageAppeared: 1, system: "Vegetation",
    title: "PARK BROWNING", description: "Local News: The intense summer sun is accelerating the browning of foliage in municipal parks."
  },
  {
    id: "hs-1-5", ...offset(0, 0.03),
    type: "social", investigativeRole: "secondary_clue", stageAppeared: 1, system: "Water",
    title: "DRY TAPS", description: "@sp_citizen: Only air coming out of the taps today. Sabesp didn't announce any maintenance! 😠"
  },

  // STAGE 2: The False Lead forms
  {
    id: "hs-2-1", ...offset(0, 0.01),
    type: "internal_email", investigativeRole: "false_lead", stageAppeared: 2, system: "Mobility",
    title: "TRAFFIC ADVISORY", description: "FWD: Suspected sinkhole forming on Industrial Ave due to heavy transport trucks and heat warping. Divert bus routes immediately. - Dept of Mobility"
  },
  {
    id: "hs-2-2", ...offset(1, 0.06),
    type: "alert", investigativeRole: "symptom", stageAppeared: 2, system: "Waste",
    title: "COLLECTION DELAYED", description: "AUTOMATED ALERT: 4 trash collection routes abandoned due to impenetrable gridlock on Industrial avenues."
  },
  {
    id: "hs-2-3", ...offset(2, 0.07),
    type: "complaint", investigativeRole: "distractor", stageAppeared: 2, system: "Energy",
    title: "AC OUTAGE", description: "Mall management reports grid fluctuation knocking out central air conditioning. Customers leaving."
  },
  {
    id: "hs-2-4", ...offset(0, 0.04),
    type: "social", investigativeRole: "false_lead", stageAppeared: 2, system: "Temperature",
    title: "BLAMING THE WEATHER", description: "@news_anchor: City officials state the sudden road collapses are entirely due to the extreme heatwave warping the asphalt composition."
  },
  {
    id: "hs-2-5", ...offset(0, 0.03),
    type: "social", investigativeRole: "secondary_clue", stageAppeared: 2, system: "Mobility",
    title: "MUDDY TIRES", description: "@biker_dude: How did my bike get completely covered in mud riding down Industrial? It hasn't rained in weeks!"
  },

  // STAGE 3: Secondary Clues build contradiction
  {
    id: "hs-3-1", ...offset(0, 0.02),
    type: "complaint", investigativeRole: "secondary_clue", stageAppeared: 3, system: "Soil",
    title: "UNUSUAL SUBSIDENCE", description: "PROCON: Foundation crack reported in commercial building. Owner states the ground has been 'spongy' since yesterday."
  },
  {
    id: "hs-3-2", ...offset(1, 0.04),
    type: "alert", investigativeRole: "root_clue", stageAppeared: 3, system: "Water",
    title: "RESERVOIR DRAWDOWN", description: "SYSTEM ALERT: Unexplained 15% acceleration in reservoir depletion rate over the last 6 hours."
  },
  {
    id: "hs-3-3", ...offset(2, 0.06),
    type: "social", investigativeRole: "distractor", stageAppeared: 3, system: "Social",
    title: "NOISE COMPLAINT", description: "@karen_sp: The jackhammers downtown are driving me insane. Can't the city do roadwork at night?"
  },
  {
    id: "hs-3-4", ...offset(0, 0.02),
    type: "news", investigativeRole: "symptom", stageAppeared: 3, system: "Health",
    title: "HOSPITALS STRESSED", description: "Medical centers in ABC region reporting influx of dehydration cases as local stores sell out of bottled water."
  },
  {
    id: "hs-3-5", ...offset(0, 0.03),
    type: "internal_email", investigativeRole: "secondary_clue", stageAppeared: 3, system: "Energy",
    title: "PUMP STATION STRESS", description: "Internal Memo: Pumping Station 4 is drawing anomalous current. It's pushing maximum pressure but distribution nodes aren't registering the flow. Is our sensor broken?"
  },

  // STAGE 4: Convergence
  {
    id: "hs-4-1", ...offset(0, 0.01),
    type: "alert", investigativeRole: "root_clue", stageAppeared: 4, system: "Water",
    title: "PRESSURE ANOMALY DETECTED", description: "CRITICAL ALERT: Massive flow discrepancy between Sabesp Substation 4 and Distribution Node B. Thousands of liters unaccounted for per minute."
  },
  {
    id: "hs-4-2", ...offset(0, 0.015),
    type: "hint", investigativeRole: "secondary_clue", stageAppeared: 4, system: "Soil",
    title: "SUBTERRANEAN SCAN", description: "Field Unit: GPR scan under Industrial avenue confirms no natural sinkhole. Massive fluid saturation eating away sub-base layer."
  },
  {
    id: "hs-4-3", ...offset(1, 0.05),
    type: "social", investigativeRole: "symptom", stageAppeared: 4, system: "Water",
    title: "WATER TRUCKS HIJACKED", description: "@scandalo_sp: People are literally blocking the private water trucks on the avenue and demanding they distribute to the neighborhood!"
  },
  {
    id: "hs-4-4", ...offset(2, 0.09),
    type: "false_lead", investigativeRole: "false_lead", stageAppeared: 4, system: "Energy",
    title: "GRID SABOTAGE?", description: "Blogger rumor: The pump station anomalies are due to targeted hacker attacks on the electrical grid, scrambling the flow rates!"
  },
  {
    id: "hs-4-5", ...offset(0, 0.02),
    type: "complaint", investigativeRole: "symptom", stageAppeared: 4, system: "Vegetation",
    title: "IRRIGATION COLLAPSE", description: "Parks Dept: All automated irrigation systems in the southern sector have failed entirely due to zero municipal line pressure."
  },

  // STAGE 5: Conclusion
  {
    id: "hs-5-1", ...offset(0, 0.005),
    type: "news", investigativeRole: "root_clue", stageAppeared: 5, system: "Water",
    title: "CATASTROPHIC BREACH", description: "BREAKING: Authorities confirm a 3-meter breach in the master aqueduct beneath Industrial Avenue. Millions of liters lost underground."
  },
  {
    id: "hs-5-2", ...offset(0, 0.01),
    type: "alert", investigativeRole: "symptom", stageAppeared: 5, system: "Mobility",
    title: "AVENUE COLLAPSE", description: "EMERGENCY: 40 meters of pavement has caved in. The structural failure was caused by extreme localized erosion from the burst pipe."
  },
  {
    id: "hs-5-3", ...offset(1, 0.04),
    type: "internal_email", investigativeRole: "secondary_clue", stageAppeared: 5, system: "Health",
    title: "EMERGENCY SUPPLY", description: "Mayor's Office: Mobilize civil defense. We have 4 neighborhoods entering day 2 with zero water and temperatures peaking."
  },
  {
    id: "hs-5-4", ...offset(2, 0.07),
    type: "social", investigativeRole: "distractor", stageAppeared: 5, system: "Social",
    title: "WHO WILL PAY", description: "@angry_taxpayer: So the city ignores aging pipes until an entire avenue caves in? Unbelievable."
  },
  {
    id: "hs-5-5", ...offset(0, 0.02),
    type: "complaint", investigativeRole: "symptom", stageAppeared: 5, system: "Energy",
    title: "PUMPS BURNT OUT", description: "Maintenance log: Two hyper-pumps at Substation 4 have completely burnt their coils out trying to maintain pressure against the massive leak."
  }
];

const charts: ChartConfig[] = [
  {
    id: "chart-water-1",
    title: "Traffic Congestion Index",
    type: "line",
    measureDescription: "Average vehicle delays on primary axes.",
    hiddenRole: "The Misleading Metric",
    data: [
      { stage: 1, delayIndex: 45, baseline: 30 },
      { stage: 2, delayIndex: 85, baseline: 30 }, // Spikes early to distract
      { stage: 3, delayIndex: 90, baseline: 30 },
      { stage: 4, delayIndex: 92, baseline: 30 },
      { stage: 5, delayIndex: 100, baseline: 30 }
    ]
  },
  {
    id: "chart-water-2",
    title: "Cross-District Crisis Indicators",
    type: "radar",
    measureDescription: "Alert density by sector vs normal baseline.",
    hiddenRole: "The Zone Comparison - Shows soil/water anomalies isolated in central ABC, while mobility hits everywhere.",
    data: [
      { metric: "Mobility", SantoAndre: 90, SaoBernardo: 70, SaoCaetano: 60 },
      { metric: "Water Loss", SantoAndre: 100, SaoBernardo: 20, SaoCaetano: 10 },
      { metric: "Soil Saturation", SantoAndre: 85, SaoBernardo: 15, SaoCaetano: 10 },
      { metric: "Temperature", SantoAndre: 60, SaoBernardo: 58, SaoCaetano: 55 },
      { metric: "Energy Draw", SantoAndre: 80, SaoBernardo: 40, SaoCaetano: 30 }
    ]
  },
  {
    id: "chart-water-3",
    title: "Subterranean Saturation vs. Pump Energy",
    type: "stacked_bar",
    measureDescription: "Underground moisture levels compared to regional pump station kilowatt usage.",
    hiddenRole: "The Hidden Correlation - Roots out the core cause in stage 4. Moisture spikes as pumps max out.",
    data: [
      { stage: 1, pumpEnergyKW: 450, soilMoistureIndex: 20 },
      { stage: 2, pumpEnergyKW: 500, soilMoistureIndex: 25 },
      { stage: 3, pumpEnergyKW: 750, soilMoistureIndex: 55 }, // The clue appears
      { stage: 4, pumpEnergyKW: 1200, soilMoistureIndex: 90 }, // Massive divergence
      { stage: 5, pumpEnergyKW: 0, soilMoistureIndex: 100 }    // Pumps burn out, soil flooded
    ]
  }
];

export const waterCollapseContext: Omit<ScenarioContext, 'id'> = {
  title: "Water Collapse in ABC",
  code: "CRISIS-01",
  rootCauseSystem: "Water",
  description: "Hidden cause: Catastrophic 3m water main break directly beneath Industrial Avenue in Santo André.",
  dossier: "Mayor's Advisor: 'Mayor, the press is going crazy. Traffic on Industrial Ave froze with a convoy of water trucks and the asphalt seems to be sinking. The heat is only making tempers worse. Say in the official notes that it literally is just natural wear and tear of the asphalt from the heatwave.'",
  stageTexts: {
    1: "Extreme Heat reported. Several localized supply complaints. Industrial Ave slowing down.",
    2: "False Sinkhole Warning: Traffic rerouted. Officials blame thermal wear on asphalt structure.",
    3: "Pumps Overworking: Pumping Station 4 drawing excessive current. Unexplained subsurface soil dampness.",
    4: "Discovery: Massive delta between pump thrust and node reception. Groundwater radars confirming flood.",
    5: "Collapse: Avenue base washes away. 4 neighborhoods completely without supply. Aqueduct breach confirmed."
  },
  hotspots,
  chartData: [], // Legacy fallback
  chartConfigs: charts
};
