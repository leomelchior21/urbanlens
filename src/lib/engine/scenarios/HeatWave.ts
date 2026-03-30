import { ScenarioContext, Hotspot, ChartConfig } from "@/store/useCrisisStore";
import { addLayerDistractors } from "./scenarioUtils";

/**
 * CRISIS-02: Heat Wave in East Zone
 * 
 * Logic Chain:
 * Stage 1: Extreme Temperature detected. People flock to UBS (Health). 
 * Stage 2: False Lead - AC demand surging causing localized rolling blackouts. Blamed on old grid.
 * Stage 3: Secondary Clues - Water pressure dropping due to hydrants opening (informal cooling), buses overheating.
 * Stage 4: Convergence - Specific neighborhoods mapped against 'Zero Canopy' data. Blackouts perfectly correlate with concrete-only zones.
 * Stage 5: Systemic Collapse - Heat Island trapped. Substations burn. 
 */

const baseAnchors = [
  { lat: -23.537, lng: -46.456 }, // Itaquera
  { lat: -23.588, lng: -46.397 }  // Guaianases / Cidade Tiradentes
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
    id: "hw-1-1", ...offset(0, 0.04),
    type: "social", investigativeRole: "symptom", stageAppeared: 1, system: "Temperature",
    title: "UNBEARABLE HEAT", description: "@zLeste_vida: The thermometer on the avenue marks 42°C in the sun right now. Absolute furnace. Not a single cloud."
  },
  {
    id: "hw-1-2", ...offset(1, 0.06),
    type: "news", investigativeRole: "symptom", stageAppeared: 1, system: "Health",
    title: "UBS OVERCROWDING", description: "Local UBS reporting a 40% spike in elderly patients arriving with severe solar exhaustion and fainting."
  },
  {
    id: "hw-1-3", ...offset(0, 0.02),
    type: "social", investigativeRole: "distractor", stageAppeared: 1, system: "Waste",
    title: "ROTTING TRASH", description: "@bairro_limpo: The heat is cooking the uncollected garbage on the corner of Avenue A. The smell is criminal."
  },
  {
    id: "hw-1-4", ...offset(1, 0.05),
    type: "alert", investigativeRole: "symptom", stageAppeared: 1, system: "Energy",
    title: "PEAK CONSUMPTION DETECTED", description: "Enel Monitoring: Substation load reaching 95% capacity in the eastern grid. Suspected mass air-conditioning activation."
  },
  {
    id: "hw-1-5", ...offset(0, 0.03),
    type: "internal_email", investigativeRole: "false_lead", stageAppeared: 1, system: "Energy",
    title: "PREPARE FOR BROWNOUTS", description: "Internal Memo: Boss, the grid in Itaquera is obsolete. If this heat continues past 2PM, copper lines are going to warp and we'll have to cut power manually."
  },

  // STAGE 2
  {
    id: "hw-2-1", ...offset(1, 0.04),
    type: "complaint", investigativeRole: "false_lead", stageAppeared: 2, system: "Energy",
    title: "ROLLING BLACKOUTS", description: "PROCON: Multiple residential blocks report losing power every 30 minutes. Food spoiling."
  },
  {
    id: "hw-2-2", ...offset(0, 0.08),
    type: "social", investigativeRole: "distractor", stageAppeared: 2, system: "Social",
    title: "MALL INVASION", description: "@zl_news: Thousands pouring into the local shopping mall just to sit in the AC. Security locking the doors."
  },
  {
    id: "hw-2-3", ...offset(0, 0.02),
    type: "social", investigativeRole: "symptom", stageAppeared: 2, system: "Mobility",
    title: "BUS EVACUATION", description: "@ commuter: The engine of the 4310 bus just literally caught fire on the Radial Leste. We're standing on the sidewalk melting."
  },
  {
    id: "hw-2-4", ...offset(1, 0.07),
    type: "internal_email", investigativeRole: "secondary_clue", stageAppeared: 2, system: "Water",
    title: "HYDRANT PRESSURE DROP", description: "Sabesp Dispatch: We've got 15 localized pressure drops. Citizens are illegally wrenching open fire hydrants to create street showers."
  },
  {
    id: "hw-2-5", ...offset(0, 0.05),
    type: "hint", investigativeRole: "secondary_clue", stageAppeared: 2, system: "Temperature",
    title: "THERMAL IMAGING SCAN", description: "Satellite Pass: Anomalous thermal retention detected. Heat is not dissipating during sunset hours in Sectors 4 and 5."
  },

  // STAGE 3
  {
    id: "hw-3-1", ...offset(1, 0.03),
    type: "false_lead", investigativeRole: "false_lead", stageAppeared: 3, system: "Temperature",
    title: "WEATHER PHENOMENON?", description: "Meteorology update claims a rare 'stationary micro-dome' of hot air is hovering specifically over the east zone due to atmospheric pressure."
  },
  {
    id: "hw-3-2", ...offset(0, 0.02),
    type: "alert", investigativeRole: "root_clue", stageAppeared: 3, system: "Vegetation",
    title: "ALBEDO WARNING", description: "SYSTEM ALERT: Surface albedo in affected zones registers below 0.12. Concrete and asphalt absorbing 88% of solar radiation. Zero green filtration."
  },
  {
    id: "hw-3-3", ...offset(1, 0.06),
    type: "complaint", investigativeRole: "symptom", stageAppeared: 3, system: "Air",
    title: "DUST BOWL", description: "Asthma clinic: Patients suffering heavily. Dry ground and wind kicking up immense particulate clouds. No natural barriers."
  },
  {
    id: "hw-3-4", ...offset(0, 0.04),
    type: "social", investigativeRole: "secondary_clue", stageAppeared: 3, system: "Social",
    title: "SHADOW HUNTING", description: "@foto_sp: It's dystopian. Delivery drivers are literally fighting to park under the shadow of a single billboard because there are no trees here."
  },
  {
    id: "hw-3-5", ...offset(0, 0.09),
    type: "news", investigativeRole: "distractor", stageAppeared: 3, system: "Energy",
    title: "MAYOR BLAMES ENEL", description: "Press Release: The Mayor states that to combat the heat, the energy grid should simply 'be more robust', dodging questions on urban planning."
  },

  // STAGE 4
  {
    id: "hw-4-1", ...offset(1, 0.01),
    type: "alert", investigativeRole: "root_clue", stageAppeared: 4, system: "Vegetation",
    title: "CANOPY DEFICIT CONFIRMED", description: "CRITICAL: Topographical sweep confirms tree canopy density in failing grid sectors is exactly < 2%. Thermal island effect maximized."
  },
  {
    id: "hw-4-2", ...offset(0, 0.03),
    type: "internal_email", investigativeRole: "secondary_clue", stageAppeared: 4, system: "Health",
    title: "TRIAGE PROTOCOL", description: "FWD: UBS capacity hit 150%. The asphalt radiates heat at 55°C after sunset. The lack of flora means no transpiration cooling. We are setting up ice baths."
  },
  {
    id: "hw-4-3", ...offset(1, 0.05),
    type: "social", investigativeRole: "symptom", stageAppeared: 4, system: "Water",
    title: "CISTERNS DRY", description: "@diario_itaquera: Water trucks are arriving but the plastic reserve tanks on the roofs are literally warping from the heat."
  },
  {
    id: "hw-4-4", ...offset(0, 0.07),
    type: "alert", investigativeRole: "symptom", stageAppeared: 4, system: "Energy",
    title: "GRID COLLAPSE IMMINENT", description: "Substation 7 and 9 transformers exceeding operational thermal thresholds. Forced shutdown sequence initiated."
  },
  {
    id: "hw-4-5", ...offset(1, 0.02),
    type: "complaint", investigativeRole: "false_lead", stageAppeared: 4, system: "Social",
    title: "POPULATION DENSITY", description: "Citizen forum blaming the crisis on 'too many people turning on AC at the same time' rather than urban layout."
  },

  // STAGE 5
  {
    id: "hw-5-1", ...offset(0, 0.015),
    type: "news", investigativeRole: "root_clue", stageAppeared: 5, system: "Vegetation",
    title: "STEEL AND CONCRETE", description: "BREAKING: Investigation attributes the localized heat catastrophe to decades of unchecked deforestation. The 'naked' asphalt created an inescapable thermal oven."
  },
  {
    id: "hw-5-2", ...offset(1, 0.02),
    type: "alert", investigativeRole: "symptom", stageAppeared: 5, system: "Energy",
    title: "BLACKOUT CONFIRMED", description: "EMERGENCY: Complete cascade failure of 3 primary substations due to thermal overload. 300,000 residents without power."
  },
  {
    id: "hw-5-3", ...offset(0, 0.05),
    type: "internal_email", investigativeRole: "symptom", stageAppeared: 5, system: "Health",
    title: "MORGUE CAPACITY", description: "SECRETARY OF HEALTH: Requesting refrigerated trucks. Heat stroke fatalities spiking in non-ventilated high-rises."
  },
  {
    id: "hw-5-4", ...offset(1, 0.08),
    type: "social", investigativeRole: "distractor", stageAppeared: 5, system: "Mobility",
    title: "EVACUATING", description: "@ fuga_ZL: Traffic is paralyzed on the avenues as hundreds try to drive their families to the coast just to escape the oven."
  },
  {
    id: "hw-5-5", ...offset(0, 0.04),
    type: "hint", investigativeRole: "secondary_clue", stageAppeared: 5, system: "Soil",
    title: "SOIL BAKING", description: "Geo-Survey: The exposed soil in the region has lost 100% of moisture, effectively turning into hardpan brick, rejecting any chance of groundwater cooling."
  }
];

const charts: ChartConfig[] = [
  {
    id: "chart-heat-1",
    title: "Grid Power Draw vs Capacity",
    type: "line",
    measureDescription: "Gigawatts pulled by residential air conditioning.",
    hiddenRole: "The Misleading Metric: Focuses purely on energy overload, suggesting it's an infrastructure capacity failure rather than a thermal anomaly.",
    data: [
      { stage: 1, powerDraw: 85, threshold: 90 },
      { stage: 2, powerDraw: 98, threshold: 90 }, // Overheating begins
      { stage: 3, powerDraw: 105, threshold: 90 },
      { stage: 4, powerDraw: 115, threshold: 90 },
      { stage: 5, powerDraw: 0, threshold: 90 }  // Blackout
    ]
  },
  {
    id: "chart-heat-2",
    title: "Post-Sunset Thermal Dissipation",
    type: "radar",
    measureDescription: "Rate at which ambient heat leaves the district at night.",
    hiddenRole: "Zone Comparison: Proves the east zone is retaining heat unnaturally compared to surrounded wooded areas.",
    data: [
      { metric: "Concrete Radiance", Itaquera: 95, Ibirapuera: 30, Morumbi: 40 },
      { metric: "Air Temp @ 10PM", Itaquera: 85, Ibirapuera: 50, Morumbi: 55 },
      { metric: "Humidity", Itaquera: 15, Ibirapuera: 70, Morumbi: 65 },
      { metric: "Wind Cooling", Itaquera: 10, Ibirapuera: 55, Morumbi: 60 }
    ]
  },
  {
    id: "chart-heat-3",
    title: "Canopy Density Profile",
    type: "bar",
    measureDescription: "Tree cluster mapping per square kilometer.",
    hiddenRole: "The Root Clue: Shows a glaring zero-flatline for vegetation strictly in the failing districts.",
    data: [
      { stage: 1, ItaqueraTrees: 2, CityAverage: 35 },
      { stage: 2, ItaqueraTrees: 2, CityAverage: 35 },
      { stage: 3, ItaqueraTrees: 2, CityAverage: 35 },
      { stage: 4, ItaqueraTrees: 2, CityAverage: 35 },
      { stage: 5, ItaqueraTrees: 1, CityAverage: 35 }
    ]
  }
];

export const heatWaveContext: Omit<ScenarioContext, 'id'> = {
  title: "Heat Wave in East Zone",
  code: "CRISIS-02",
  rootCauseSystem: "Vegetation",
  description: "Hidden cause: Near-zero tree cover amplifying thermal radiation + AC failure.",
  dossier: "Mayor's Advisor: 'Boss, hospitals in Itaquera are receiving fainting elderly people by the dozens. The electrical demand to try to cool the region skyrocketed and grid warnings are flashing red. The east zone has turned into a literal oven. Blame the historical failure of the power company, but whatever you do, do not draw attention to the fact we cut down the last three parks for those new condo developments.'",
  stageTexts: {
    1: "Severe temperature spike detected. Medical centers crowded due to sunstroke.",
    2: "Rolling blackouts hit residential blocks. Energy sector blamed for outdated infrastructure.",
    3: "Albedo anomaly: Soil and concrete absorbing max radiation. Dust bowls forming.",
    4: "Discovery: Thermal retention directly mapped to neighborhoods with less than 2% tree canopy.",
    5: "Collapse: Trapped heat island burns through 3 substations. Lethal localized climate established."
  },
  hotspots: addLayerDistractors(hotspots, "CRISIS-02", baseAnchors),
  chartData: [],
  chartConfigs: charts
};
