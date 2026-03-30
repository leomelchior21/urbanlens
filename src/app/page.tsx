"use client"

import React, { useEffect, useState } from 'react';
import { useCrisisStore } from '@/store/useCrisisStore';
import { generateInstantBaseScenario, generateMockHotspots, fetchDeepSeekHotspots } from '@/lib/engine/ScenarioGenerator';
import { TopBar } from '@/components/layout/TopBar';
import { LeftPanel } from '@/components/layout/LeftPanel';
import { RightPanel } from '@/components/layout/RightPanel';
import { UrbanMap } from '@/components/map/UrbanMap';

export default function UrbanLensApp() {
  const { setScenario, setHotspots, tickTimer, isRunning } = useCrisisStore();
  const [loading, setLoading] = useState(true);

  // Initialize Scenario on first load
  useEffect(() => {
    async function init() {
      // 1. Instant load of base UI
      const baseScenario = generateInstantBaseScenario();
      setScenario(baseScenario);
      setLoading(false);

      // 2. Fetch AI-generated hotspots asynchronously
      try {
        const hotspots = await fetchDeepSeekHotspots(baseScenario.code);
        setHotspots(hotspots);
      } catch (err) {
        // Fallback if DeepSeek is offline/unavailable or throws error
        setHotspots(generateMockHotspots(baseScenario));
      }
    }
    init();
  }, [setScenario, setHotspots]);

  // Main escalation timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !loading) {
      interval = setInterval(() => {
        tickTimer();
      }, 1000); // Ticks every 1 second
    }
    return () => clearInterval(interval);
  }, [isRunning, tickTimer, loading]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-blue-500 flex-col space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="text-sm font-mono tracking-widest text-blue-400 uppercase animate-pulse">Initializing UrbanLens Platform...</div>
      </div>
    );
  }

  return (
    <main className="relative w-full h-screen overflow-hidden bg-slate-950 font-sans selection:bg-blue-500/30">
      <UrbanMap />
      <TopBar />
      <LeftPanel />
      <RightPanel />
    </main>
  );
}
