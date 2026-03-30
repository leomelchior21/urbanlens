import { ScenarioContext, Hotspot, ChartConfig } from "@/store/useCrisisStore";
import { addLayerDistractors } from "./scenarioUtils";

/**
 * CRISIS-04: Cascading Blackout in Central Region
 * 
 * Logic Chain:
 * Stage 1: Traffic lights go out mid-day. Traffic chaos.
 * Stage 2: False Lead - Assumed to be a simple localized traffic node software failure or wire theft.
 * Stage 3: Secondary Clues - Water pumps stop, hospitals switch to generators. It's not just mobility.
 * Stage 4: Convergence - A hidden night-shift industrial plant drawing illegal power spikes the mid-west grid loop.
 * Stage 5: Systemic Collapse - Bandeirantes substation triggers a protective cascade, dropping 200k households to save the macro-grid.
 */

const baseAnchors = [
  { lat: -23.536, lng: -46.664 }, // Central-West Grid Point A
  { lat: -23.538, lng: -46.645 }  // Central-West Grid Point B
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
    id: "cb-1-1", ...offset(0, 0.02),
    type: "social", investigativeRole: "symptom", stageAppeared: 1, system: "Mobility",
    title: "TRAFFIC LIGHTS DEAD", description: "@moto_boy: All traffic lights on Paulista and Rebouças are completely blank. Cars are aggressively honking. Chaos."
  },
  {
    id: "cb-1-2", ...offset(1, 0.04),
    type: "alert", investigativeRole: "symptom", stageAppeared: 1, system: "Energy",
    title: "GRID FLUCTUATION", description: "SYSTEM ALERT: Minor voltage sag detected in the mid-west distribution grid. Auto-correcting."
  },
  {
    id: "cb-1-3", ...offset(0, 0.03),
    type: "complaint", investigativeRole: "distractor", stageAppeared: 1, system: "Social",
    title: "ELEVATOR TRAPPED", description: "Fire Dept: Responding to 3 separate calls of people trapped in mid-rise elevators downtown."
  },
  {
    id: "cb-1-4", ...offset(1, 0.05),
    type: "news", investigativeRole: "false_lead", stageAppeared: 1, system: "Mobility",
    title: "SOFTWARE GLITCH?", description: "Transit Authority states a centralized server glitch may be responsible for the synchronized signal failures."
  },
  {
    id: "cb-1-5", ...offset(0, 0.01),
    type: "social", investigativeRole: "secondary_clue", stageAppeared: 1, system: "Energy",
    title: "FLICKERING LIGHTS", description: "@cafe_paulista: The espresso machines are turning off and on. The power is completely unstable right now."
  },

  // STAGE 2
  {
    id: "cb-2-1", ...offset(1, 0.02),
    type: "internal_email", investigativeRole: "false_lead", stageAppeared: 2, system: "Energy",
    title: "COPPER THEFT SUSPECTED", description: "FWD: Security teams dispatched. We suspect a specialized gang is cutting main copper arteries under the central axis again."
  },
  {
    id: "cb-2-2", ...offset(0, 0.04),
    type: "complaint", investigativeRole: "symptom", stageAppeared: 2, system: "Mobility",
    title: "INTERSECTION CRASHES", description: "Police Scanner: Three major T-bone collisions at uncontrolled intersections. Ambulances struggling to navigate through the gridlock."
  },
  {
    id: "cb-2-3", ...offset(0, 0.03),
    type: "alert", investigativeRole: "secondary_clue", stageAppeared: 2, system: "Health",
    title: "BACKUP GENERATORS ACTIVE", description: "Santa Casa Hospital telemetry confirms primary grid disconnect. Switching to diesel backup generators."
  },
  {
    id: "cb-2-4", ...offset(1, 0.06),
    type: "social", investigativeRole: "distractor", stageAppeared: 2, system: "Vegetation",
    title: "DARK PARKS", description: "@runner_sp: Ibirapuera is pitch black. Why didn't the park lights turn on at dusk?"
  },
  {
    id: "cb-2-5", ...offset(0, 0.02),
    type: "news", investigativeRole: "symptom", stageAppeared: 2, system: "Water",
    title: "PUMPS OFFLINE", description: "Sabesp warns high-rise apartments to conserve water, as district pumping stations have lost primary electrical feed."
  },

  // STAGE 3
  {
    id: "cb-3-1", ...offset(0, 0.01),
    type: "hint", investigativeRole: "root_clue", stageAppeared: 3, system: "Energy",
    title: "HARMONIC DISTORTION", description: "Engineering Note: This isn't theft. Oscilloscopes show massive harmonic distortion reflecting back from the commercial sector. Something huge is turning on and off."
  },
  {
    id: "cb-3-2", ...offset(1, 0.05),
    type: "alert", investigativeRole: "symptom", stageAppeared: 3, system: "Waste",
    title: "COLD STORAGE COMPROMISED", description: "Municipal organic sorting facility reporting loss of refrigeration. Methane pockets warming."
  },
  {
    id: "cb-3-3", ...offset(0, 0.03),
    type: "complaint", investigativeRole: "false_lead", stageAppeared: 3, system: "Air",
    title: "POLLUTION MONITOR DEAD", description: "Environmental agency angry as entirely air quality monitoring UPS systems die. Pointing fingers at 'cheap city batteries'."
  },
  {
    id: "cb-3-4", ...offset(1, 0.04),
    type: "social", investigativeRole: "symptom", stageAppeared: 3, system: "Mobility",
    title: "SUBWAY HALTED", description: "@metro_depre: Line 2 - Green is crawling. They just announced a 'power fluctuation'. Everyone is nervous in the dark tunnel."
  },
  {
    id: "cb-3-5", ...offset(0, 0.06),
    type: "internal_email", investigativeRole: "secondary_clue", stageAppeared: 3, system: "Energy",
    title: "BANDEIRANTES OVERHEAT", description: "Substation Ops: The Bandeirantes transformer is running 30 degrees above threshold. It's struggling to balance the load spikes."
  },

  // STAGE 4
  {
    id: "cb-4-1", ...offset(0, 0.01),
    type: "internal_email", investigativeRole: "root_clue", stageAppeared: 4, system: "Energy",
    title: "URBAN FACTORY DISCOVERED", description: "CONFIDENTIAL: We found the source. A massive, illegal nocturnal Bitcoin mining farm tapped directly into the commercial high-voltage trunk. It's sucking gigawatts unpredictably."
  },
  {
    id: "cb-4-2", ...offset(1, 0.02),
    type: "alert", investigativeRole: "secondary_clue", stageAppeared: 4, system: "Temperature",
    title: "THERMAL RUNAWAY", description: "Bandeirantes Hub: Transformer cooling oil boiling. System preparing for autonomous SCADA isolation to prevent fire."
  },
  {
    id: "cb-4-3", ...offset(0, 0.04),
    type: "social", investigativeRole: "distractor", stageAppeared: 4, system: "Social",
    title: "CANDLELIGHT DINNER", description: "@romantico_sp: Restaurants in Jardins making the best of it with candles. Actually a vibe to be honest!"
  },
  {
    id: "cb-4-4", ...offset(1, 0.07),
    type: "news", investigativeRole: "symptom", stageAppeared: 4, system: "Health",
    title: "ICU RISK", description: "Hospitals report diesel reserves will only last 12 hours. Demanding priority reconnection for life-support wings."
  },
  {
    id: "cb-4-5", ...offset(0, 0.05),
    type: "complaint", investigativeRole: "false_lead", stageAppeared: 4, system: "Energy",
    title: "INCOMPETENCE", description: "Angry citizens crowding outside Enel headquarters demanding resignations for 'failing to maintain the wires'."
  },

  // STAGE 5
  {
    id: "cb-5-1", ...offset(0, 0.02),
    type: "alert", investigativeRole: "root_clue", stageAppeared: 5, system: "Energy",
    title: "CASCADE DISCONNECT", description: "BREAKING: Bandeirantes Hub isolates itself to prevent explosion. This throws the entire central loop out of phase. System drops 200k households offline instantly."
  },
  {
    id: "cb-5-2", ...offset(1, 0.01),
    type: "news", investigativeRole: "symptom", stageAppeared: 5, system: "Mobility",
    title: "CITY PARALYZED", description: "Subway lines 1, 2, and 4 completely stopped. Passengers evacuating through tunnels. Surface traffic in gridlock."
  },
  {
    id: "cb-5-3", ...offset(0, 0.05),
    type: "internal_email", investigativeRole: "secondary_clue", stageAppeared: 5, system: "Social",
    title: "POLICE ESCORTS", description: "Mayor's Office: Deploy riot police to the discovered crypto farm. Confiscate servers. And figure out who authorized their grid connection."
  },
  {
    id: "cb-5-4", ...offset(1, 0.04),
    type: "social", investigativeRole: "distractor", stageAppeared: 5, system: "Air",
    title: "STARS SHINING", description: "@ceu_limpo: With all the lights out, you can actually see a few stars over São Paulo tonight. Eerie."
  },
  {
    id: "cb-5-5", ...offset(0, 0.03),
    type: "complaint", investigativeRole: "symptom", stageAppeared: 5, system: "Water",
    title: "WATER CUT OFF", description: "Apartment towers completely without water as gravity tanks empty and electric pumps remain dead."
  }
];

const charts: ChartConfig[] = [
  {
    id: "chart-blackout-1",
    title: "Traffic Node Connectivity",
    type: "line",
    measureDescription: "Percentage of active traffic lights and mobility sensors against the normal operating baseline.",
    hiddenRole: "The Misleading Metric: By plummeting early, it makes the player think Mobility is the root failure rather than a symptom of grid collapse.",
    data: [
      { stage: 1, activeNodes: 95, baselineNodes: 96 },
      { stage: 2, activeNodes: 45, baselineNodes: 96 }, // Plummets
      { stage: 3, activeNodes: 20, baselineNodes: 95 },
      { stage: 4, activeNodes: 15, baselineNodes: 95 },
      { stage: 5, activeNodes: 0, baselineNodes: 94 }
    ]
  },
  {
    id: "chart-blackout-2",
    title: "Infrastructure Outage Spread",
    type: "radar",
    measureDescription: "Failure rates across different urban sectors versus stable operating levels and emergency tolerance.",
    hiddenRole: "Zone Comparison: Proves the blackout is hitting Water, Health, and Mobility simultaneously, confirming the root is energy.",
    data: [
      { metric: "Mobility", FailureRate: 100, StableOperation: 12, EmergencyTolerance: 45 },
      { metric: "Water Pumps", FailureRate: 85, StableOperation: 10, EmergencyTolerance: 40 },
      { metric: "Hospitals", FailureRate: 60, StableOperation: 8, EmergencyTolerance: 25 },
      { metric: "Waste Sorting", FailureRate: 90, StableOperation: 15, EmergencyTolerance: 35 },
      { metric: "Comms", FailureRate: 40, StableOperation: 18, EmergencyTolerance: 30 }
    ]
  },
  {
    id: "chart-blackout-3",
    title: "Substation Load vs Expected Curve",
    type: "stacked_bar",
    measureDescription: "Actual Gigawatt draw compared to the predicted baseline for Central West.",
    hiddenRole: "The Root Clue: Shows the massive, unexplained load spikes from the illegal farm blowing past the redline threshold.",
    data: [
      { stage: 1, baseline: 100, actualDraw: 110 },
      { stage: 2, baseline: 95, actualDraw: 140 },
      { stage: 3, baseline: 90, actualDraw: 190 }, // Massive divergence
      { stage: 4, baseline: 85, actualDraw: 220 }, // Thermal limit breached
      { stage: 5, baseline: 80, actualDraw: 0 }    // Cascade trip (blackout)
    ]
  }
];

export const cascadingBlackoutContext: Omit<ScenarioContext, 'id'> = {
  title: "Cascading Blackout in Central Region",
  code: "CRISIS-04",
  rootCauseSystem: "Energy",
  description: "Hidden cause: Nocturnal industrial overload from illegal crypto-mining farm triggers SCADA cascade.",
  dossier: "Mayor's Advisor: 'Monitoring reports that the traffic lights in the central region simply went dark mid-afternoon. City hall vans bumped into double queues and no one can collect trash in the central-west today. Try to blame the mobility software architecture and shield the energy secretariat from blame.'",
  stageTexts: {
    1: "Traffic lights fail across the central axis. Major congestion and minor collisions occur.",
    2: "False Assumption: Police investigate copper wire theft. Secondary systems begin to fail.",
    3: "Hospitals switch to generators. Harmonic distortion detected in the grid.",
    4: "Discovery: An illegal, massive industrial load is secretly draining the grid, overheating the Bandeirantes hub.",
    5: "Collapse: Hub forces an automated shutdown to save itself, throwing 200k homes into darkness."
  },
  hotspots: addLayerDistractors(hotspots, "CRISIS-04", baseAnchors),
  chartData: [],
  chartConfigs: charts
};
