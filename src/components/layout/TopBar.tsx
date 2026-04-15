import React from 'react';
import { useCrisisStore } from '@/store/useCrisisStore';
import { Activity } from 'lucide-react';

export const TopBar = () => {
  const { stage, timeRemaining, scenarioContext, isRunning, toggleTimer } = useCrisisStore();

  const mins = Math.floor(timeRemaining / 60);
  const secs = timeRemaining % 60;
  const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const getStageColor = (stage: number) => {
    switch(stage) {
      case 1: return 'text-emerald-500';
      case 2: return 'text-yellow-400';
      case 3: return 'text-orange-400';
      case 4: return 'text-red-500';
      case 5: return 'text-red-600 animate-pulse';
      default: return 'text-emerald-500';
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-3 bg-[#050b14]/70 backdrop-blur-md bg-scanlines border border-slate-500/50 text-white pointer-events-auto shadow-[0_0_40px_rgba(52,211,153,0.15)] relative before:absolute before:inset-0 before:pointer-events-none before:ring-1 before:ring-inset before:ring-white/10">
        
        {/* Left: Branding */}
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-center justify-center space-y-0.5 border-r border-slate-800 pr-4">
            <div className="flex space-x-1">
              <div className="w-1 h-3 bg-emerald-500"></div>
              <div className="w-1 h-4 bg-emerald-500"></div>
              <div className="w-1 h-5 bg-emerald-500 animate-pulse"></div>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-mono font-bold tracking-[0.2em] leading-tight text-emerald-500">URBAN <span className="text-slate-100">LENS 2.0</span></h1>
            <p className="text-[9px] text-emerald-500/50 uppercase tracking-[0.3em] font-mono">São Paulo Spatial Intelligence</p>
          </div>
        </div>

        {/* Center: Scenario & Stage */}
        <div className="flex flex-col items-center justify-center border-l border-r border-slate-800 px-8 py-1 hidden lg:flex">
          <div className="flex items-center space-x-4">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Localized Problem</span>
            <span className="text-slate-800">|</span>
            <span className="text-[12px] text-yellow-500 font-mono tracking-widest uppercase">{scenarioContext?.code || 'WAITING'}</span>
          </div>
        </div>

        {/* Right: Timer & Controls */}
        <div className="flex items-center space-x-6">
          <div className="text-center border-r border-slate-800 pr-6">
            <div className="text-[9px] text-emerald-500/70 uppercase tracking-[0.2em] font-mono mb-1">
               {stage === 5 && !isRunning ? 'CRISIS STATE' : 'LIVE FEED'}
               <span className="ml-2 text-emerald-400">[{stage === 5 && !isRunning ? 'COLLAPSED' : 'ACTIVE'}]</span>
            </div>
            <div className={`text-sm font-bold uppercase tracking-[0.2em] font-mono ${getStageColor(stage)}`}>
              STAGE 0{stage}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className={`text-2xl font-mono font-bold tracking-widest ${stage === 5 && !isRunning ? 'text-red-500' : 'text-slate-100'}`}>
                {timeStr}
              </div>
              <div className="text-[9px] text-emerald-500 uppercase tracking-widest font-mono text-center">
                [{stage === 5 && !isRunning ? 'STOPPED' : 'LIVE'}]
              </div>
            </div>
            <button 
              onClick={toggleTimer}
              className="p-3 bg-[#0a111a]/70 backdrop-blur-sm hover:bg-slate-800/80 transition-colors border border-slate-700 text-slate-400 group"
              title="Toggle Simulation Timer"
            >
              <Activity className={`w-4 h-4 ${isRunning ? 'text-emerald-500 group-hover:text-emerald-400' : 'text-slate-600'}`} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
