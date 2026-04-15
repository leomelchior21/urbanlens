import React, { useEffect, useRef, useState } from 'react';
import { useCrisisStore, Hotspot } from '@/store/useCrisisStore';
import { AlertTriangle, CheckCircle2, Circle, EyeOff, FileText, Inbox, MapPin, Radio, Siren, TerminalSquare, TriangleAlert, X } from 'lucide-react';
import { getHotspotImportance, getHotspotImportanceLabel, simplifyHotspotDescription } from '@/lib/engine/hotspotPresentation';

type PanelType = 'feed' | null;

export const RightPanel = () => {
  const { scenarioContext, activeSystem, stage, selectedHotspot, setSelectedHotspot } = useCrisisStore();
  const [activePanel, setActivePanel] = useState<PanelType>('feed');
  const feedScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedHotspot) return;

    const timeoutId = window.setTimeout(() => {
      setActivePanel('feed');

      const el = document.getElementById(`feed-item-${selectedHotspot.id}`);
      if (el && feedScrollRef.current) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);

    return () => window.clearTimeout(timeoutId);
  }, [selectedHotspot]);

  if (!scenarioContext) return null;

  const visibleHotspots = scenarioContext.hotspots
    .filter(h => h.system === activeSystem && h.stageAppeared <= stage)
    .sort((a, b) => b.stageAppeared - a.stageAppeared);

  const getIconForType = (type: Hotspot['type']) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'news': return <FileText className="w-4 h-4 text-blue-400" />;
      case 'complaint': return <CheckCircle2 className="w-4 h-4 text-orange-400" />;
      case 'internal_email': return <Inbox className="w-4 h-4 text-yellow-400" />;
      case 'false_lead': return <EyeOff className="w-4 h-4 text-pink-400" />;
      case 'hint': return <TerminalSquare className="w-4 h-4 text-cyan-400" />;
      default: return <MapPin className="w-4 h-4 text-slate-400" />;
    }
  };

  const getImportanceBadge = (hotspot: Hotspot) => {
    const importance = getHotspotImportance(hotspot);
    const label = getHotspotImportanceLabel(importance);

    if (importance === 'high') {
      return (
        <span className="inline-flex items-center gap-1 border border-red-500/70 bg-red-500/10 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-red-300">
          <Siren className="h-3 w-3" />
          {label}
        </span>
      );
    }

    if (importance === 'medium') {
      return (
        <span className="inline-flex items-center gap-1 border border-yellow-500/70 bg-yellow-500/10 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-yellow-300">
          <TriangleAlert className="h-3 w-3" />
          {label}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 border border-slate-600 bg-slate-700/10 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400">
        <Circle className="h-3 w-3" />
        {label}
      </span>
    );
  };

  const isFeedOpen = activePanel === 'feed';

  return (
    <div className="absolute top-[88px] bottom-6 right-2 sm:right-6 z-40 flex pointer-events-none transition-all">
      <div
        className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden mr-2 sm:mr-4 bg-[#050b14]/70 backdrop-blur-md bg-scanlines border-y border-l border-slate-500/50 shadow-[0_0_40px_rgba(52,211,153,0.15)] pointer-events-auto flex flex-col relative before:absolute before:inset-0 before:pointer-events-none before:ring-1 before:ring-inset before:ring-white/10
          ${isFeedOpen ? 'w-80 opacity-100 border-r border-r-slate-500/50 translate-x-0' : 'w-0 opacity-0 translate-x-10 border-r-transparent'}
        `}
      >
        {isFeedOpen && (
          <>
            <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-[#0a111a]/50">
              <h2 className="text-xs font-mono font-bold tracking-[0.2em] text-emerald-500 uppercase flex items-center gap-2">
                <span className="w-1.5 h-4 bg-emerald-500 block"></span>
                INTERCEPTS
              </h2>
              <button onClick={() => setActivePanel(null)} className="text-slate-500 hover:text-emerald-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 p-4 space-y-3" ref={feedScrollRef}>
              {visibleHotspots.length === 0 ? (
                <div className="text-[10px] font-mono tracking-widest uppercase text-center text-slate-600 italic py-4">
                  No signals detected for this system yet.
                </div>
              ) : (
                visibleHotspots.map(h => (
                  <div
                    key={h.id}
                    id={`feed-item-${h.id}`}
                    onClick={() => setSelectedHotspot(h)}
                    className={`p-3 border text-sm transition-colors cursor-pointer ${
                      selectedHotspot?.id === h.id
                        ? 'bg-emerald-900/40 backdrop-blur-md border-emerald-500 shadow-[inset_0_0_15px_rgba(52,211,153,0.1)]'
                        : 'bg-[#0a111a]/60 backdrop-blur-sm border-slate-800 hover:border-emerald-900/50'
                    }`}
                  >
                    <div className="flex items-start space-x-3 text-slate-300">
                      <div className="mt-0.5" style={{ color: selectedHotspot?.id === h.id ? '#34d399' : undefined }}>
                        {getIconForType(h.type)}
                      </div>
                      <div className="flex-1">
                        <div className="mb-2">
                          {getImportanceBadge(h)}
                        </div>
                        <div className={`font-mono font-bold tracking-widest text-[10px] uppercase mb-1 ${selectedHotspot?.id === h.id ? 'text-emerald-400' : 'text-slate-200'}`}>
                          {h.title}
                        </div>
                        <div className={`text-[11px] font-mono leading-relaxed ${selectedHotspot?.id === h.id ? 'text-emerald-500/80' : 'text-slate-400'}`}>
                          {simplifyHotspotDescription(h)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      <div className="bg-[#050b14]/70 backdrop-blur-md bg-scanlines border border-slate-500/50 flex flex-col pointer-events-auto shadow-[0_0_40px_rgba(52,211,153,0.15)] h-fit relative before:absolute before:inset-0 before:pointer-events-none before:ring-1 before:ring-inset before:ring-white/10">
        <button
          onClick={() => setActivePanel(isFeedOpen ? null : 'feed')}
          className={`relative p-3 transition-colors duration-200 group border-b border-transparent ${
            isFeedOpen
              ? 'bg-emerald-900/20 text-emerald-400 border-b-emerald-400 shadow-[inset_0_0_15px_rgba(52,211,153,0.1)]'
              : 'bg-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800'
          }`}
          title="Intercepts"
        >
          <Radio className="w-5 h-5" />
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-[#050b14]/80 backdrop-blur-md border border-slate-800 text-emerald-500 font-mono text-[10px] tracking-widest uppercase py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Intercepts
          </span>
        </button>
      </div>
    </div>
  );
};
