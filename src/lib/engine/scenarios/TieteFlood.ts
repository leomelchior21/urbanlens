import { ScenarioContext, Hotspot, ChartConfig } from "@/store/useCrisisStore";

/**
 * CRISIS-03: Tiete River Flood
 * 
 * Logic Chain:
 * Stage 1: River levels rising unexpectedly. Marginal traffic slows. Rain blamed.
 * Stage 2: False Lead - Soil saturation and heavy localized rainfall presumed to be the sole cause.
 * Stage 3: Secondary Clues - Water flowing strangely. Floating 'islands' seen on drones.
 * Stage 4: Convergence - Substation threatened by backed-up drainage despite pumps working.
 * Stage 5: Root Cause - Edgard de Souza dam gates physically jammed by tons of illegal solid plastic waste.
 */

const baseAnchors = [
  { lat: -23.526, lng: -46.822 }, // Osasco / River bend
  { lat: -23.532, lng: -46.792 }  // Close to Marginal
];

function offset(anchorIdx: number, range: number) {
  const anchor = baseAnchors[anchorIdx % baseAnchors.length];
  return {
    lat: anchor.lat + (Math.random() - 0.5) * range,
    lng: anchor.lng + (Math.random() - 0.5) * range
  };
}

const hotspots: Hotspot[] = [
  // STAGE 1
  {
    id: "tf-1-1", ...offset(0, 0.03),
    type: "alert", investigativeRole: "symptom", stageAppeared: 1, system: "Water",
    title: "TIETÊ LEVEL CRITICAL", description: "Sensors in Osasco section show river rising 12cm per hour against expected baselines."
  },
  {
    id: "tf-1-2", ...offset(1, 0.05),
    type: "social", investigativeRole: "symptom", stageAppeared: 1, system: "Mobility",
    title: "MARGINAL HALTED", description: "@motorista_sp: Puddles forming on the fast lane of Marginal Tietê. Traffic is already backing up to Lapa."
  },
  {
    id: "tf-1-3", ...offset(0, 0.02),
    type: "news", investigativeRole: "false_lead", stageAppeared: 1, system: "Temperature",
    title: "TORRENTIAL RAIN", description: "Weather channel predicts heavy summer storms continuing to batter the western basin, overwhelming the soil."
  },
  {
    id: "tf-1-4", ...offset(1, 0.06),
    type: "complaint", investigativeRole: "distractor", stageAppeared: 1, system: "Energy",
    title: "LIGHTS FLICKERING", description: "PROCON: Industrial park reporting minor voltage drops due to water seeping into underground junction boxes."
  },
  {
    id: "tf-1-5", ...offset(0, 0.04),
    type: "social", investigativeRole: "secondary_clue", stageAppeared: 1, system: "Waste",
    title: "FOUL SMELL", description: "@osasco_view: The river always smells bad, but today it smells like a literal landfill floating right by my window."
  },

  // STAGE 2
  {
    id: "tf-2-1", ...offset(1, 0.03),
    type: "internal_email", investigativeRole: "false_lead", stageAppeared: 2, system: "Soil",
    title: "SATURATION LIMITS", description: "FWD: Civil Defense: The Várzea do Carmo floodplain soil is at 100% saturation. It can't absorb any more rain. Prepare for overflow."
  },
  {
    id: "tf-2-2", ...offset(0, 0.01),
    type: "alert", investigativeRole: "secondary_clue", stageAppeared: 2, system: "Water",
    title: "ABNORMAL EDDY CURRENTS", description: "Sonar scans show the water isn't just rising; it's churning backwards near the dam spillways. Flow dynamics compromised."
  },
  {
    id: "tf-2-3", ...offset(0, 0.07),
    type: "complaint", investigativeRole: "symptom", stageAppeared: 2, system: "Health",
    title: "LEPTOSPIROSIS FEARS", description: "Local clinics ordering emergency antibiotics stockpiles as contaminated floodwaters reach the sidewalks."
  },
  {
    id: "tf-2-4", ...offset(1, 0.04),
    type: "social", investigativeRole: "distractor", stageAppeared: 2, system: "Vegetation",
    title: "FALLEN TREES", description: "@nature_watch: The soaked soil caused two massive eucalyptus trees to fall near the park. Blocking the pedestrian bridge."
  },
  {
    id: "tf-2-5", ...offset(0, 0.02),
    type: "news", investigativeRole: "false_lead", stageAppeared: 2, system: "Water",
    title: "DREDGING FAILURE?", description: "Opposition politicians claim the city failed to dredge the river bottom this year, causing the swift flooding."
  },

  // STAGE 3
  {
    id: "tf-3-1", ...offset(0, 0.01),
    type: "hint", investigativeRole: "root_clue", stageAppeared: 3, system: "Waste",
    title: "FLOATING PLASTIC ISLANDS", description: "Drone Operator: We've spotted massive, compacted masses of solid plastic waste flowing downstream, clumping together like icebergs."
  },
  {
    id: "tf-3-2", ...offset(1, 0.02),
    type: "alert", investigativeRole: "symptom", stageAppeared: 3, system: "Energy",
    title: "OSASCO SUBSTATION THREAT", description: "WARNING: Floodwaters have breached the outer perimeter wall of the primary Osasco energy transmission hub."
  },
  {
    id: "tf-3-3", ...offset(0, 0.05),
    type: "complaint", investigativeRole: "distractor", stageAppeared: 3, system: "Mobility",
    title: "BUSES STRANDED", description: "Transport HQ: 12 articulated buses are trapped in half a meter of muddy water on the Marginal. Passengers evacuated."
  },
  {
    id: "tf-3-4", ...offset(1, 0.03),
    type: "social", investigativeRole: "secondary_clue", stageAppeared: 3, system: "Water",
    title: "PUMPS ARE RUNNING", description: "@engineer_bob: I drove past the municipal pumping station. The pumps are blasting at 100%, but the water has nowhere to go. It's hitting a wall."
  },
  {
    id: "tf-3-5", ...offset(0, 0.06),
    type: "internal_email", investigativeRole: "symptom", stageAppeared: 3, system: "Mobility",
    title: "ROAD CLOSURE", description: "URGENT: Initiate full closure of Marginal Tietê (Central-West axis). Industrial supply chains effectively severed for the next 48h."
  },

  // STAGE 4
  {
    id: "tf-4-1", ...offset(0, 0.02),
    type: "internal_email", investigativeRole: "root_clue", stageAppeared: 4, system: "Waste",
    title: "DAM GATES STUCK", description: "CONFIDENTIAL: Sabesp divers report the Edgard de Souza dam gates are mechanically jammed. Thousands of tons of compacted garbage have locked the hydraulic arms."
  },
  {
    id: "tf-4-2", ...offset(1, 0.01),
    type: "alert", investigativeRole: "symptom", stageAppeared: 4, system: "Energy",
    title: "PREEMPTIVE SHUTDOWN", description: "Enel: We are cutting power to the Osasco hub to prevent a mega-arc explosion as water enters the transformer yards."
  },
  {
    id: "tf-4-3", ...offset(0, 0.04),
    type: "social", investigativeRole: "distractor", stageAppeared: 4, system: "Social",
    title: "LOOTING FEARS", description: "@zl_observer: With the power out and streets flooded, merchants are abandoning their stores. Chaos incoming."
  },
  {
    id: "tf-4-4", ...offset(1, 0.05),
    type: "news", investigativeRole: "symptom", stageAppeared: 4, system: "Health",
    title: "EVACUATION ORDER", description: "Civil Defense orders immediate maritime evacuation of three riverside neighborhoods facing 1.5m of toxic standing water."
  },
  {
    id: "tf-4-5", ...offset(0, 0.03),
    type: "complaint", investigativeRole: "false_lead", stageAppeared: 4, system: "Water",
    title: "OPEN THE GATES", description: "Protestors on the bridge demanding the administration 'turn on the dams'—ignorant to the fact the mechanical systems are physically entombed."
  },

  // STAGE 5
  {
    id: "tf-5-1", ...offset(0, 0.01),
    type: "news", investigativeRole: "root_clue", stageAppeared: 5, system: "Waste",
    title: "TRASH BLOCKADE CONFIRMED", description: "BREAKING: The catastrophic flood was not purely rainfall. The river's exit wound was sealed by an unprecedented mass of illegally dumped industrial solid waste locking the dam gates."
  },
  {
    id: "tf-5-2", ...offset(1, 0.02),
    type: "alert", investigativeRole: "symptom", stageAppeared: 5, system: "Mobility",
    title: "LOGISTICS COLLAPSE", description: "With the Marginal under water and the Osasco hub dark, SP's western industrial corridor is entirely paralyzed."
  },
  {
    id: "tf-5-3", ...offset(0, 0.06),
    type: "internal_email", investigativeRole: "secondary_clue", stageAppeared: 5, system: "Health",
    title: "EPIDEMIC PREP", description: "Medical memo: Now that the water is sitting stagnant mixed with industrial trash, prepare for massive bacteriological outbreaks in 7 days."
  },
  {
    id: "tf-5-4", ...offset(1, 0.04),
    type: "social", investigativeRole: "distractor", stageAppeared: 5, system: "Social",
    title: "RUINED HOMES", description: "@osasco_sobrevive: We lost everything on the ground floor. The water is thick, black, and smells like chemical death."
  },
  {
    id: "tf-5-5", ...offset(0, 0.02),
    type: "hint", investigativeRole: "secondary_clue", stageAppeared: 5, system: "Waste",
    title: "ORIGIN POINT", description: "Investigation points to five illegal dump sites upstream that collapsed their retaining walls during the early rain."
  }
];

const charts: ChartConfig[] = [
  {
    id: "chart-flood-1",
    title: "Rainfall vs Soil Absorption",
    type: "line",
    measureDescription: "Millimeters of rain compared to soil saturation index.",
    hiddenRole: "The Misleading Metric: Convinces the user it's just a tragic weather event overloading the dirt.",
    data: [
      { stage: 1, rainMM: 40, soilSaturation: 80 },
      { stage: 2, rainMM: 60, soilSaturation: 100 },
      { stage: 3, rainMM: 85, soilSaturation: 100 },
      { stage: 4, rainMM: 90, soilSaturation: 100 },
      { stage: 5, rainMM: 20, soilSaturation: 100 } // Rain stops, but flood remains!
    ]
  },
  {
    id: "chart-flood-2",
    title: "System Stress Radar",
    type: "radar",
    measureDescription: "Multi-vector anomaly pressure.",
    hiddenRole: "Zone Comparison: Displays massive waste anomalies spiking right alongside water.",
    data: [
      { metric: "Water Level", Impact: 100 },
      { metric: "Mobility Jam", Impact: 95 },
      { metric: "Trash Mass", Impact: 90 },
      { metric: "Energy Risk", Impact: 80 },
      { metric: "Wind/Air", Impact: 10 }
    ]
  },
  {
    id: "chart-flood-3",
    title: "Pump Thrust vs Outflow Volume",
    type: "stacked_bar",
    measureDescription: "Mechanical pumping effort compared to actual water passing the dam.",
    hiddenRole: "The Root Clue: Shows pumps working at 100%, but outflow drops to zero. A physical blockage must exist.",
    data: [
      { stage: 1, pumpPower: 50, outflowVolume: 48 },
      { stage: 2, pumpPower: 70, outflowVolume: 65 },
      { stage: 3, pumpPower: 100, outflowVolume: 30 }, // The blockage occurs
      { stage: 4, pumpPower: 100, outflowVolume: 5 },  // Fully jammed
      { stage: 5, pumpPower: 0, outflowVolume: 0 }     // Pumps turned off
    ]
  }
];

export const tieteFloodContext: Omit<ScenarioContext, 'id'> = {
  title: "Tiete River Flood",
  code: "CRISIS-03",
  rootCauseSystem: "Waste",
  description: "Hidden cause: Illegal solid waste dumping creating massive floating islands that block the Edgard de Souza dam gates.",
  dossier: "Mayor's Advisor: 'URGENT: The Marginal is already jamming due to the volume of accumulated water. The Osasco basins are heavily stressed under the volume and the soil is not absorbing fast enough. I advised Civil Defense not to declare a state of emergency yet so as not to panic the industries. If anyone asks, it's just an unpredictable act of God and extreme weather.'",
  stageTexts: {
    1: "Tietê level rising rapidly. Marginal traffic crawls as puddles form.",
    2: "False Assumption: Soil saturation presumed to be the sole cause blocking drainage.",
    3: "Pumps running at maximum capacity but water isn't draining. Floating debris spotted.",
    4: "Discovery: The exit point of the river is jammed. Floodwaters threaten the Osasco Energy hub.",
    5: "Collapse: Dam gates confirmed locked by compacted plastic waste. Massive regional flooding halts logistics."
  },
  hotspots,
  chartData: [],
  chartConfigs: charts
};
