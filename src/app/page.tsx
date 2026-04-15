"use client"

import React, { useEffect, useState } from 'react';
import { useCrisisStore } from '@/store/useCrisisStore';
import { generateInstantBaseScenario, generateMockHotspots } from '@/lib/engine/ScenarioGenerator';
import { TopBar } from '@/components/layout/TopBar';
import { LeftPanel } from '@/components/layout/LeftPanel';
import { RightPanel } from '@/components/layout/RightPanel';
import { UrbanMap } from '@/components/map/UrbanMap';
import { BriefingOverlay } from '@/components/layout/BriefingOverlay';
import { CrisisQuizOverlay } from '@/components/layout/CrisisQuizOverlay';

export default function UrbanLensApp() {
  const { setScenario, setHotspots, tickTimer, isRunning, setTimerRunning, scenarioContext, stage } = useCrisisStore();
  const [loading, setLoading] = useState(true);
  const [showBriefing, setShowBriefing] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);

  // Initialize Scenario on first load
  useEffect(() => {
    async function init() {
      // 1. Instant load of base UI
      const baseScenario = generateInstantBaseScenario();
      setScenario(baseScenario);
      setLoading(false);

      // 2. Hydrate with rich hardcoded logic immediately
      setHotspots(generateMockHotspots(baseScenario));
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

  const interfaceIsBlurred = showBriefing || showQuiz;

  const beginInvestigation = () => {
    setShowBriefing(false);
    setTimerRunning(true);
  };

  const openQuiz = () => {
    setTimerRunning(false);
    setShowQuiz(true);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-slate-950 font-sans selection:bg-blue-500/30">
      <div className={`h-full w-full transition-[filter,opacity] duration-300 ${interfaceIsBlurred ? 'pointer-events-none blur-sm opacity-45' : 'opacity-100'}`}>
        <UrbanMap />
        <TopBar />
        <LeftPanel />
        <RightPanel />
      </div>

      {scenarioContext && showBriefing && (
        <BriefingOverlay scenario={scenarioContext} onBegin={beginInvestigation} />
      )}

      {scenarioContext && stage === 5 && !showBriefing && !showQuiz && (
        <button
          onClick={openQuiz}
          className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 border-2 border-red-300 bg-red-600 px-8 py-5 font-mono text-lg font-black uppercase tracking-[0.28em] text-white shadow-[0_0_45px_rgba(239,68,68,0.55)] transition-colors hover:bg-red-500"
        >
          Guess the Crisis
        </button>
      )}

      {scenarioContext && showQuiz && (
        <CrisisQuizOverlay key={scenarioContext.id} scenario={scenarioContext} onClose={() => setShowQuiz(false)} />
      )}
    </main>
  );
}
