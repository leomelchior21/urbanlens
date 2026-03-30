import React from 'react';
import { useCrisisStore, SystemType } from '@/store/useCrisisStore';
import { 
  CloudRain, 
  Wind, 
  ThermometerSun, 
  Zap, 
  Car, 
  Trash2, 
  TreePine,
  ChevronRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SYSTEMS: { type: SystemType; icon: React.ReactNode; label: string; color: string }[] = [
  { type: 'Temperature', icon: <ThermometerSun className="w-5 h-5" />, label: 'Thermal', color: 'text-red-500' },
  { type: 'Air', icon: <Wind className="w-5 h-5" />, label: 'Atmosphere', color: 'text-purple-500' },
  { type: 'Water', icon: <CloudRain className="w-5 h-5" />, label: 'Hydrology', color: 'text-cyan-500' },
  { type: 'Energy', icon: <Zap className="w-5 h-5" />, label: 'Power Grid', color: 'text-yellow-500' },
  { type: 'Mobility', icon: <Car className="w-5 h-5" />, label: 'Transit', color: 'text-orange-500' },
  { type: 'Waste', icon: <Trash2 className="w-5 h-5" />, label: 'Sanitation', color: 'text-stone-400' },
  { type: 'Vegetation', icon: <TreePine className="w-5 h-5" />, label: 'Ecology', color: 'text-green-500' },
];

export const LeftPanel = () => {
  const { activeSystem, setActiveSystem, stage } = useCrisisStore();

  return (
    <div className="absolute top-[88px] bottom-6 left-2 sm:left-6 w-14 sm:w-56 z-40 flex flex-col pointer-events-none">
      <div className="bg-[#050b14]/70 backdrop-blur-md border border-slate-500/50 rounded-sm overflow-hidden shadow-[0_0_40px_rgba(52,211,153,0.15)] flex-1 flex flex-col p-2 sm:p-4 pointer-events-auto bg-scanlines relative before:absolute before:inset-0 before:pointer-events-none before:ring-1 before:ring-inset before:ring-white/10">
        
        {/* Terminal Header */}
        <div className="mb-4 hidden sm:flex flex-col border-b border-slate-700/50 pb-3">
          <h2 className="text-xs font-mono font-bold tracking-[0.2em] text-emerald-500 uppercase flex items-center gap-2">
            <span className="w-1.5 h-4 bg-emerald-500 block"></span>
            SYS_LAYERS
          </h2>
          <p className="text-[9px] font-mono tracking-widest text-slate-500 mt-2 uppercase">Target Parameters</p>
        </div>

        {/* Buttons List */}
        <div className="flex-1 flex flex-col justify-start overflow-hidden w-full gap-2 mt-2">
          {SYSTEMS.map((sys) => {
            const isActive = activeSystem === sys.type;
            // Get the hex/tail color word to inject safely into borders
            const colorClass = sys.color || 'text-slate-400';
            const hoverBorder = colorClass.replace('text-', 'hover:border-');
            const activeBorder = colorClass.replace('text-', 'border-');
            const activeBg = colorClass.replace('text-', 'bg-').concat('/10');
            
            return (
              <button
                key={sys.type}
                onClick={() => setActiveSystem(sys.type)}
                className={cn(
                  "w-full flex min-h-[40px] items-center justify-center sm:justify-start px-2 sm:px-3 transition-none border font-mono tracking-widest uppercase text-[10px] sm:text-xs",
                  isActive 
                    ? `${activeBorder} ${activeBg} ${colorClass} shadow-[inset_0_0_15px_rgba(255,255,255,0.05)] backdrop-blur-sm` 
                    : `bg-[#0a111a]/60 backdrop-blur-sm border-slate-800 text-slate-500 hover:text-slate-300 ${hoverBorder}`
                )}
                title={sys.label}
              >
                <div className="flex items-center space-x-0 sm:space-x-4 w-full h-full">
                  <div className="flex items-center justify-center">
                    {React.cloneElement(sys.icon as React.ReactElement<{ className?: string }>, {
                      className: cn("w-4 h-4 sm:w-4 sm:h-4", isActive ? colorClass : "text-slate-500")
                    })}
                  </div>
                  <div className="text-left hidden sm:flex flex-col flex-1 border-l border-slate-800/50 pl-3 py-1">
                    <span className={cn("font-bold", isActive ? colorClass : "text-slate-400")}>
                      {sys.label}
                    </span>
                  </div>
                  {isActive && <div className={cn("w-1.5 h-full hidden sm:block", colorClass.replace('text-', 'bg-'))}></div>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Status Footer */}
        <div className="mt-2 sm:mt-4 pt-4 border-t border-slate-800 hidden sm:block">
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono uppercase tracking-widest">
            <span>UPLINK D-NET:</span>
            <span className={cn("flex items-center gap-2 font-bold", stage >= 4 ? "text-red-500" : "text-emerald-500")}>
              <span className={cn("w-2 h-2", stage >= 4 ? "bg-red-500 animate-pulse" : "bg-emerald-500")}></span>
              <span>{stage >= 4 ? 'CRITICAL' : 'SECURE'}</span>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

