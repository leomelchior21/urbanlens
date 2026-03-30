import React, { useState, useEffect, useRef } from 'react';
import { useCrisisStore, Hotspot } from '@/store/useCrisisStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Radio, Paperclip, Mail, X, Trash2, MapPin, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

type PanelType = 'metrics' | 'feed' | 'evidence' | 'dossier' | null;

export const RightPanel = () => {
  const { scenarioContext, activeSystem, stage, pinnedEvidence, unpinEvidence, selectedHotspot, setSelectedHotspot } = useCrisisStore();
  const [activePanel, setActivePanel] = useState<PanelType>('dossier'); // Mission Dossier open by default
  const feedScrollRef = useRef<HTMLDivElement>(null);

  // Auto-open feed and scroll when a hotspot is selected from the map
  useEffect(() => {
    if (selectedHotspot) {
      if (activePanel !== 'feed') setActivePanel('feed');
      // Delay scrolling slightly to allow the panel to open/render
      setTimeout(() => {
        const el = document.getElementById(`feed-item-${selectedHotspot.id}`);
        if (el && feedScrollRef.current) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [selectedHotspot]);

  if (!scenarioContext) return null;

  // Filter hotspots for the active system that have appeared up to the current stage
  const visibleHotspots = scenarioContext.hotspots
    .filter(h => h.system === activeSystem && h.stageAppeared <= stage)
    .sort((a, b) => b.stageAppeared - a.stageAppeared);

  // Extract chart key based on active system
  const chartDataKeyMap: Record<string, string> = {
    'Temperature': 'temperature',
    'Water': 'waterLevel',
    'Energy': 'energyUsage',
    'Air': 'airQuality',
    'Mobility': 'trafficIndex',
    'Waste': 'blockageLevel',
    'Vegetation': 'canopyDeficit'
  };
  const dataKey = chartDataKeyMap[activeSystem] || 'temperature';
  
  const chartData = scenarioContext.chartData.map(d => ({
    ...d,
    [dataKey]: d[dataKey] || (Math.random() * 100)
  })).slice(0, Math.max(1, stage)); 

  const getIconForType = (type: Hotspot['type']) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'news': return <FileText className="w-4 h-4 text-blue-400" />;
      case 'complaint': return <CheckCircle2 className="w-4 h-4 text-orange-400" />;
      default: return <MapPin className="w-4 h-4 text-slate-400" />;
    }
  };

  const getDockButton = (type: PanelType, Icon: any, label: string) => {
    const isActive = activePanel === type;
    return (
      <button
        onClick={() => setActivePanel(isActive ? null : type)}
        className={`relative p-3 transition-colors duration-200 group border-b border-transparent ${
          isActive 
            ? 'bg-emerald-900/20 text-emerald-400 border-b-emerald-400 shadow-[inset_0_0_15px_rgba(52,211,153,0.1)]' 
            : 'bg-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800'
        }`}
        title={label}
      >
        <Icon className="w-5 h-5" />
        {/* Tooltip */}
        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-[#050b14] border border-slate-800 text-emerald-500 font-mono text-[10px] tracking-widest uppercase py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          {label}
        </span>
        {/* Badge for Evidence */}
        {type === 'evidence' && pinnedEvidence.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-sm flex items-center justify-center text-[10px] text-black font-bold pointer-events-none">
            {pinnedEvidence.length}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="absolute top-[88px] bottom-6 right-2 sm:right-6 z-40 flex pointer-events-none transition-all">
      
      {/* Expanding Panel */}
      <div 
        className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden mr-2 sm:mr-4 bg-[#050b14] bg-scanlines border-y border-l border-slate-800 shadow-2xl pointer-events-auto flex flex-col relative before:absolute before:inset-0 before:pointer-events-none before:ring-1 before:ring-inset before:ring-white/5
          ${activePanel ? 'w-80 sm:w-80 opacity-100 border-r border-r-slate-800 translate-x-0' : 'w-0 opacity-0 translate-x-10 border-r-transparent'}
        `}
      >
        {activePanel && (
          <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-[#0a111a]">
            <h2 className="text-xs font-mono font-bold tracking-[0.2em] text-emerald-500 uppercase flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-500 block"></span>
              {activePanel === 'metrics' && 'ANALYTICS'}
              {activePanel === 'feed' && 'INTERCEPTS'}
              {activePanel === 'evidence' && 'EVIDENCE'}
              {activePanel === 'dossier' && 'DOSSIER'}
            </h2>
            <button onClick={() => setActivePanel(null)} className="text-slate-500 hover:text-emerald-400 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          
          {/* Metrics Panel */}
          {activePanel === 'metrics' && (
            <div className="p-4 flex flex-col h-full">
              <p className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-6">Analyzing {activeSystem} anomaly patterns over time.</p>
              <div className="h-64 flex-shrink-0 bg-[#020617] p-2 border border-slate-800 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="stage" stroke="#475569" tick={{fontSize: 10, fill: '#64748b', fontFamily: 'monospace'}} />
                    <YAxis stroke="#475569" tick={{fontSize: 10, fill: '#64748b', fontFamily: 'monospace'}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', color: '#10b981', fontFamily: 'monospace', fontSize: '10px', textTransform: 'uppercase' }} 
                      itemStyle={{ color: '#10b981' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey={dataKey} 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#020617', stroke: '#10b981', strokeWidth: 2 }}
                      activeDot={{ r: 5, fill: '#10b981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Feed Panel */}
          {activePanel === 'feed' && (
            <div className="p-4 space-y-3" ref={feedScrollRef}>
              {visibleHotspots.length === 0 ? (
                <div className="text-[10px] font-mono tracking-widest uppercase center text-slate-600 italic py-4">No signals detected for this system yet.</div>
              ) : (
                visibleHotspots.map(h => (
                  <div 
                    key={h.id} 
                    id={`feed-item-${h.id}`}
                    onClick={() => setSelectedHotspot(h)}
                    className={`p-3 border text-sm transition-colors cursor-pointer ${
                      selectedHotspot?.id === h.id 
                        ? 'bg-emerald-900/20 border-emerald-500 shadow-[inset_0_0_15px_rgba(52,211,153,0.1)]' 
                        : 'bg-[#0a111a] border-slate-800 hover:border-emerald-900/50'
                    }`}
                  >
                    <div className="flex items-start space-x-3 text-slate-300">
                      <div className="mt-0.5" style={{ color: selectedHotspot?.id === h.id ? '#34d399' : undefined }}>
                        {getIconForType(h.type)}
                      </div>
                      <div className="flex-1">
                        <div className={`font-mono font-bold tracking-widest text-[10px] uppercase mb-1 ${selectedHotspot?.id === h.id ? 'text-emerald-400' : 'text-slate-200'}`}>
                          {h.title}
                        </div>
                        <div className={`text-[11px] font-mono leading-relaxed ${selectedHotspot?.id === h.id ? 'text-emerald-500/80' : 'text-slate-400'}`}>
                          {h.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Evidence Board Panel */}
          {activePanel === 'evidence' && (
            <div className="p-4 space-y-3">
              {pinnedEvidence.length === 0 ? (
                <div className="text-[10px] uppercase font-mono text-center text-slate-600 py-8 border border-dashed border-slate-700 bg-[#020617]">
                  No evidence pinned yet.<br />Explore the map to gather intelligence.
                </div>
              ) : (
                pinnedEvidence.map(evidence => (
                  <div key={evidence.id} className="p-3 border border-emerald-900/50 bg-emerald-900/10 shadow-[inset_0_0_15px_rgba(52,211,153,0.05)] group transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-[9px] text-emerald-500 font-mono tracking-widest uppercase">
                        {evidence.system} — STAGE {evidence.stageAppeared}
                      </div>
                      <button 
                        onClick={() => unpinEvidence(evidence.id)}
                        className="text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove from block"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[10px] font-mono font-bold tracking-widest text-slate-100 leading-tight uppercase mb-1">{evidence.title}</div>
                    <div className="text-xs text-slate-400 font-mono pt-1 border-t border-slate-800">{evidence.description}</div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Dossier Panel */}
          {activePanel === 'dossier' && (
            <div className="p-4">
               <div className="bg-[#020617] p-4 border border-yellow-900 shadow-[inset_0_0_20px_rgba(234,179,8,0.05)] relative">
                 <div className="absolute top-0 left-0 w-full h-1 bg-yellow-600"></div>
                 <div className="text-slate-500 mb-4 border-b border-slate-800 pb-2 font-mono text-[9px] uppercase tracking-widest space-y-1">
                    <p>TO: <span className="text-slate-300">INVESTIGATION UNIT</span></p>
                    <p>FROM: <span className="text-slate-300">MAYOR'S OFFICE (SECURE)</span></p>
                    <p>SUBJECT: <span className="text-yellow-500">{scenarioContext.code} {scenarioContext.title}</span></p>
                 </div>
                 <p className="whitespace-pre-line text-[11px] font-mono text-yellow-500/90 leading-relaxed uppercase">
                   "{scenarioContext.dossier}"
                 </p>
               </div>
            </div>
          )}

        </div>
      </div>

      {/* Static Dock */}
      <div className="bg-[#050b14] bg-scanlines border border-slate-800 flex flex-col pointer-events-auto shadow-2xl h-fit">
        {getDockButton('metrics', Activity, 'Analytics')}
        {getDockButton('feed', Radio, 'Intercepts')}
        {getDockButton('evidence', Paperclip, 'Evidence Board')}
        <div className="w-full h-px bg-slate-800" />
        {getDockButton('dossier', Mail, 'Mission Dossier')}
      </div>

    </div>
  );
};
