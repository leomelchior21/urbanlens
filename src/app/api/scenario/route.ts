import { NextResponse } from 'next/server';
import { MOCK_SCENARIOS, randomOffset, ScenarioData } from '@/lib/engine/ScenarioGenerator';
import { SystemType, Hotspot } from '@/store/useCrisisStore';

export async function GET(request: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const base = MOCK_SCENARIOS[Math.floor(Math.random() * MOCK_SCENARIOS.length)];

  // If no API key is provided, use the fallback logic natively (simulated in the API route)
  if (!apiKey) {
    console.warn("No DEEPSEEK_API_KEY found, returning fallback data.");
    return NextResponse.json(generateFallback(base));
  }

  try {
    const anchor = base.anchors[Math.floor(Math.random() * base.anchors.length)];
    
    // We send a hard structured prompt to get precisely what we need from DeepSeek
    const prompt = `You are the UrbanLens AI Engine generating a tactical crisis simulation.
The current crisis scenario is: ${base.title}
Root Cause System: ${base.rootCauseSystem}
Central Lat/Lng: ${anchor.lat}, ${anchor.lng}

Generate a single JSON object containing an array called "hotspots" with 25 items. 
- 15 items should be true intelligence (types: 'news', 'alert', 'complaint', 'hint') logically related to the crisis.
- 10 items should be COMPLETELY FALSE NOISE / DISTRACTORS (types: 'false_lead', 'social', 'complaint'). These must be mundane urban noise (e.g. Internet outages, missing dogs, loud parties, minor local accidents) totally unrelated to the primary crisis, to test the analyst's deduction skills.

Make sure their "stageAppeared" ranges from 1 to 5.
Make sure their "system" is randomly picked from standard systems (Temperature, Air, Water, Energy, Mobility, Waste, Vegetation), but the true intelligence ones heavily lean on symptoms of ${base.rootCauseSystem}.

OUTPUT FORMAT EXACTLY LIKE THIS:
{
  "hotspots": [
    {
      "id": "hs-xyz",
      "lat": -23.5, // vary nearby central lat
      "lng": -46.5, // vary nearby central lng
      "type": "alert", // 'news', 'social', 'complaint', 'alert', 'note', 'hint', 'false_lead'
      "title": "A short uppercase title",
      "description": "The exact message or social media post text",
      "system": "Energy", // any valid system
      "stageAppeared": 1 // integer 1-5
    }
  ]
}`;

    console.log("Calling DeepSeek API...");
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "system", content: "You are a data generation engine. Always return raw JSON. No markdown backticks." }, { role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.8
      })
    });

    if (!res.ok) {
      throw new Error(`DeepSeek API error: ${res.statusText}`);
    }

    const data = await res.json();
    let content = data.choices[0].message.content;
    
    // Safety check: sometimes the API still wraps in markdown
    if (content.startsWith('```json')) {
      content = content.replace(/^```json\n/, '').replace(/\n```$/, '');
    }
    const parsed = JSON.parse(content);
    
    // Generate the generic chart data
    const chartData = generateChartData();

    return NextResponse.json({
      id: `SCENARIO-${Date.now()}`,
      title: base.title,
      code: base.code,
      rootCauseSystem: base.rootCauseSystem,
      description: base.description,
      dossier: base.dossier,
      stageTexts: base.stageTexts,
      hotspots: parsed.hotspots,
      chartData
    });
    
  } catch (error) {
    console.error("DeepSeek failing, falling back:", error);
    return NextResponse.json(generateFallback(base));
  }
}

// Fallback logic extracted from the generator
function generateFallback(base: ScenarioData) {
  const hotspots: Hotspot[] = [];
  const systems: SystemType[] = ['Temperature', 'Air', 'Water', 'Energy', 'Mobility', 'Waste', 'Vegetation'];
  const types: Hotspot['type'][] = ['news', 'social', 'complaint', 'alert', 'note', 'hint', 'false_lead'];
  
  for (let i = 0; i < 25; i++) {
    const stageAppeared = Math.floor(Math.random() * 5) + 1;
    const isRoot = Math.random() < 0.5;
    const system = isRoot ? (base.rootCauseSystem as SystemType) : systems[Math.floor(Math.random() * systems.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const anchor = base.anchors[Math.floor(Math.random() * base.anchors.length)];
    const range = isRoot ? 0.02 : 0.08;

    hotspots.push({
      id: `hs-${i}-${Date.now()}`,
      lat: randomOffset(anchor.lat, range),
      lng: randomOffset(anchor.lng, range),
      type,
      title: "FALLBACK_ANOMALY",
      description: `Locally simulated anomaly for ${system}`,
      system,
      stageAppeared
    });
  }

  return {
    id: `SCENARIO-${Date.now()}`,
    title: base.title,
    code: base.code,
    rootCauseSystem: base.rootCauseSystem,
    description: base.description,
    dossier: base.dossier,
    stageTexts: base.stageTexts,
    hotspots,
    chartData: generateChartData()
  };
}

function generateChartData() {
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
