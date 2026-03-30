import { Hotspot, SystemType } from '@/store/useCrisisStore';

export interface ScenarioAnchor {
  lat: number;
  lng: number;
}

type DistractorTemplate = {
  title: string;
  description: string;
  type: Hotspot['type'];
  investigativeRole: Hotspot['investigativeRole'];
};

const LAYER_SYSTEMS: SystemType[] = [
  'Temperature',
  'Air',
  'Water',
  'Energy',
  'Mobility',
  'Waste',
  'Vegetation',
  'Soil',
  'Social',
  'Health',
];

const DISTRACTOR_TEMPLATES: Record<SystemType, DistractorTemplate[]> = {
  Temperature: [
    {
      title: 'ROOFTOP HEAT REFLECTION',
      description: 'Maintenance note: A mirrored facade is reflecting midday sun into one rooftop thermal sensor cluster and exaggerating local heat.',
      type: 'social',
      investigativeRole: 'distractor',
    },
    {
      title: 'FOOD TRUCK HEAT POCKET',
      description: 'Complaint log: A lunchtime food truck row is creating a tiny heat pocket around one plaza and drawing overblown neighborhood reports.',
      type: 'complaint',
      investigativeRole: 'distractor',
    },
    {
      title: 'BROKEN THERMOMETER PANIC',
      description: 'Rumor spread says a failed public thermometer proves the whole district is overheating, but adjacent blocks stay normal.',
      type: 'false_lead',
      investigativeRole: 'false_lead',
    },
  ],
  Air: [
    {
      title: 'UFO SIGHTING?',
      description: '@tinfoil_hat: Strange flashing lights were hovering in the clouds again last night. Definitely not aircraft, definitely not normal.',
      type: 'social',
      investigativeRole: 'distractor',
    },
    {
      title: 'FIREWORK SMOKE COMPLAINT',
      description: 'Service ticket: Shop owners blame leftover fireworks smoke from a private event for the haze over one commercial strip.',
      type: 'complaint',
      investigativeRole: 'distractor',
    },
    {
      title: 'DRONE SHOW THEORY',
      description: 'Forum chatter claims a rehearsal drone swarm dumped particulates over the district, with no supporting telemetry.',
      type: 'false_lead',
      investigativeRole: 'false_lead',
    },
  ],
  Water: [
    {
      title: 'CAR WASH RUNOFF',
      description: '311 note: A private car wash is spilling soapy runoff into the gutter, causing noisy but shallow neighborhood complaints.',
      type: 'social',
      investigativeRole: 'distractor',
    },
    {
      title: 'POOL REFILL GRIEVANCE',
      description: 'Complaint center: Residents are fighting over a condominium pool refill that keeps tankers double-parked on the curb.',
      type: 'complaint',
      investigativeRole: 'distractor',
    },
    {
      title: 'FOUNTAIN SABOTAGE',
      description: 'Rumor mill says vandals tampered with decorative fountains and somehow destabilized the district water balance.',
      type: 'false_lead',
      investigativeRole: 'false_lead',
    },
  ],
  Energy: [
    {
      title: 'INTERNET OUTAGE',
      description: 'Fiber provider bulletin: A cut line dropped service to a few blocks and residents are loudly blaming the power grid again.',
      type: 'social',
      investigativeRole: 'distractor',
    },
    {
      title: 'BROKEN ATM',
      description: 'Complaint queue: A bank ATM swallowed multiple cards after a brief kiosk reset, sparking exaggerated outage reports.',
      type: 'complaint',
      investigativeRole: 'distractor',
    },
    {
      title: 'SECRET BATTERY FIRE',
      description: 'Anonymous post claims a hidden battery warehouse is distorting the energy map, though inspectors found no thermal signature.',
      type: 'false_lead',
      investigativeRole: 'false_lead',
    },
  ],
  Mobility: [
    {
      title: 'NOISE COMPLAINT',
      description: 'Residents say an all-night party has jammed a narrow street with parked cars and taxis, but the disruption stays hyper-local.',
      type: 'social',
      investigativeRole: 'distractor',
    },
    {
      title: 'POTHOLE DAMAGE',
      description: 'PROCON 881: A driver lost a tire on a crater-sized pothole and now swears the avenue is becoming impassable.',
      type: 'complaint',
      investigativeRole: 'distractor',
    },
    {
      title: 'STADIUM TRAFFIC ALERT',
      description: 'Sports desk: Tonight\'s derby is expected to choke a few feeder roads near the stadium with match-day congestion.',
      type: 'false_lead',
      investigativeRole: 'false_lead',
    },
  ],
  Waste: [
    {
      title: 'POST-PARTY LITTER',
      description: 'Vendor post: A private block party left a full street of cups and food wrappers waiting for routine cleanup.',
      type: 'social',
      investigativeRole: 'distractor',
    },
    {
      title: 'BROKEN COMPACTOR',
      description: 'Municipal ticket: A neighborhood compactor jammed, backing up local trash bags around a transfer bay.',
      type: 'complaint',
      investigativeRole: 'distractor',
    },
    {
      title: 'CONTRACTOR COVER-UP',
      description: 'Community rumor says a sanitation contractor is staging garbage piles to force a new bid cycle.',
      type: 'false_lead',
      investigativeRole: 'false_lead',
    },
  ],
  Vegetation: [
    {
      title: 'LOST GOLDEN RETRIEVER',
      description: 'Neighborhood feed: LOST DOG near the park, golden retriever, answers to Sol. Please DM with sightings.',
      type: 'social',
      investigativeRole: 'distractor',
    },
    {
      title: 'COMMUNITY GARDEN DIE-OFF',
      description: 'Complaint board: Garden volunteers report a fungal patch wiping out raised beds near a school courtyard.',
      type: 'complaint',
      investigativeRole: 'distractor',
    },
    {
      title: 'INVASIVE SPECIES SCARE',
      description: 'Neighborhood groups insist an invasive vine is the hidden source of every ecological anomaly on the map.',
      type: 'false_lead',
      investigativeRole: 'false_lead',
    },
  ],
  Soil: [
    {
      title: 'SIDEWALK SETTLING',
      description: 'Works crew note: Fresh sidewalk panels are settling unevenly after a minor contractor backfill issue.',
      type: 'social',
      investigativeRole: 'distractor',
    },
    {
      title: 'VACANT LOT EROSION',
      description: 'Citizen complaint: Loose dirt from a fenced lot is sliding into storm drains after every passing truck.',
      type: 'complaint',
      investigativeRole: 'distractor',
    },
    {
      title: 'MICRO-TREMOR SPECULATION',
      description: 'Chat groups claim unexplained tremors are creeping through the district, without any seismic corroboration.',
      type: 'false_lead',
      investigativeRole: 'false_lead',
    },
  ],
  Social: [
    {
      title: 'NEIGHBORHOOD PANIC THREAD',
      description: 'Local channel: Residents are forwarding unverified warnings faster than agencies can debunk them.',
      type: 'social',
      investigativeRole: 'distractor',
    },
    {
      title: 'UNION RALLY SPILLOVER',
      description: 'Community complaint: A loud labor rally is consuming hotline bandwidth with unrelated grievances.',
      type: 'complaint',
      investigativeRole: 'distractor',
    },
    {
      title: 'COORDINATED BOT SWARM',
      description: 'Rumor board alleges a coordinated influence campaign is manufacturing the crisis narrative from thin air.',
      type: 'false_lead',
      investigativeRole: 'false_lead',
    },
  ],
  Health: [
    {
      title: 'WALK-IN CLINIC QUEUE',
      description: 'Patient post: One clinic app glitch released duplicate appointments and created a temporary waiting-room pileup.',
      type: 'social',
      investigativeRole: 'distractor',
    },
    {
      title: 'PHARMACY STOCK ARGUMENT',
      description: 'Complaint line: Residents are disputing a pharmacy chain shortage of routine cold medication in one district.',
      type: 'complaint',
      investigativeRole: 'distractor',
    },
    {
      title: 'MYSTERY VIRUS TALK',
      description: 'Unofficial channels are calling it a mystery pathogen, even though surveillance teams see no outbreak signature there.',
      type: 'false_lead',
      investigativeRole: 'false_lead',
    },
  ],
};

function hashString(input: string) {
  let hash = 0;

  for (let index = 0; index < input.length; index += 1) {
    hash = ((hash << 5) - hash + input.charCodeAt(index)) | 0;
  }

  return Math.abs(hash);
}

function createDeterministicOffset(anchor: ScenarioAnchor, seed: string, stage: number) {
  const hash = hashString(seed);
  const angle = (hash % 360) * (Math.PI / 180);
  const radius = 0.06 + (stage * 0.008) + ((hash % 7) * 0.003);

  return {
    lat: anchor.lat + Math.sin(angle) * radius,
    lng: anchor.lng + Math.cos(angle) * radius,
  };
}

function getAnchorForSeed(anchors: ScenarioAnchor[], seed: string) {
  return anchors[hashString(seed) % anchors.length];
}

function buildLayerDistractor(scenarioCode: string, stage: number, system: SystemType, anchors: ScenarioAnchor[]): Hotspot {
  const template = DISTRACTOR_TEMPLATES[system][stage - 1];
  const seed = `${scenarioCode}-${system}-${stage}`;
  const anchor = getAnchorForSeed(anchors, seed);
  const position = createDeterministicOffset(anchor, seed, stage);

  return {
    id: `${scenarioCode.toLowerCase()}-dst-${stage}-${system.toLowerCase()}`,
    ...position,
    type: template.type,
    investigativeRole: template.investigativeRole,
    title: template.title,
    description: template.description,
    system,
    stageAppeared: stage,
  };
}

export function addLayerDistractors(baseHotspots: Hotspot[], scenarioCode: string, anchors: ScenarioAnchor[]) {
  const existingSystems = new Set<SystemType>(
    baseHotspots
      .filter((hotspot) =>
        hotspot.stageAppeared <= 3 &&
        (hotspot.type === 'false_lead' || hotspot.investigativeRole === 'distractor' || hotspot.investigativeRole === 'false_lead')
      )
      .map((hotspot) => hotspot.system)
  );
  const generatedHotspots: Hotspot[] = [];

  for (const system of LAYER_SYSTEMS) {
    if (existingSystems.has(system)) {
      continue;
    }

    const stage = ((generatedHotspots.length % 3) + 1) as 1 | 2 | 3;
    generatedHotspots.push(buildLayerDistractor(scenarioCode, stage, system, anchors));
  }

  return [...baseHotspots, ...generatedHotspots];
}
