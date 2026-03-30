import React, { useState, useEffect, useRef } from 'react';
import { useCrisisStore, Hotspot } from '@/store/useCrisisStore';
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ChartConfig } from '@/store/useCrisisStore';
import { Activity, Radio, Paperclip, Mail, X, Trash2, MapPin, FileText, CheckCircle2, AlertTriangle, EyeOff, TerminalSquare, Inbox } from 'lucide-react';

type PanelType = 'metrics' | 'feed' | 'evidence' | 'dossier' | null;

const CHART_SERIES_COLORS = ['#10b981', '#38bdf8', '#f59e0b', '#f43f5e', '#a855f7', '#22c55e'];

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function formatSeriesLabel(key: string) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getChartCategoryKey(chart: ChartConfig) {
  return chart.type === 'radar' ? 'metric' : 'stage';
}

function getChartSeriesKeys(chart: ChartConfig) {
  const categoryKey = getChartCategoryKey(chart);
  const seriesKeys = new Set<string>();

  chart.data.forEach((point) => {
    Object.entries(point).forEach(([key, value]) => {
      if (key !== categoryKey && isFiniteNumber(value)) {
        seriesKeys.add(key);
      }
    });
  });

  return Array.from(seriesKeys);
}

export const RightPanel = () => {
  const { scenarioContext, activeSystem, stage, pinnedEvidence, unpinEvidence, selectedHotspot, setSelectedHotspot } = useCrisisStore();
  const [activePanel, setActivePanel] = useState<PanelType>('dossier'); // Mission Dossier open by default
  const feedScrollRef = useRef<HTMLDivElement>(null);

  // Auto-open feed and scroll when a hotspot is selected from the map
  useEffect(() => {
    if (!selectedHotspot) return;

    const timeoutId = window.setTimeout(() => {
      setActivePanel((currentPanel) => currentPanel === 'feed' ? currentPanel : 'feed');

      const el = document.getElementById(`feed-item-${selectedHotspot.id}`);
      if (el && feedScrollRef.current) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);

    return () => window.clearTimeout(timeoutId);
  }, [selectedHotspot]);

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
  
  const chartData = React.useMemo(() => (scenarioContext?.chartData || []).map((d: Record<string, unknown>) => ({
    ...d,
    [dataKey]: (d[dataKey] as number) || (((d.stage as number) || stage) * 17) % 100
  })).slice(0, Math.max(1, stage)), [scenarioContext?.chartData, dataKey, stage]);

  if (!scenarioContext) return null;

  const renderConfiguredChart = (chart: ChartConfig) => {
    const seriesKeys = getChartSeriesKeys(chart);
    const visibleData = chart.type === 'radar'
      ? chart.data
      : chart.data.filter((datum) => !isFiniteNumber(datum.stage) || datum.stage <= stage);

    if (seriesKeys.length === 0 || visibleData.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500 font-mono">
          Chart data unavailable.
        </div>
      );
    }

    if (chart.type === 'line') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={visibleData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="stage" stroke="#475569" tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }} />
            <YAxis stroke="#475569" tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }} />
            <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', color: '#10b981', fontFamily: 'monospace', fontSize: '10px' }} />
            <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', color: '#94a3b8' }} />
            {seriesKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={formatSeriesLabel(key)}
                stroke={CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length]}
                strokeWidth={2}
                strokeDasharray={/(baseline|threshold|expected)/i.test(key) ? '4 4' : undefined}
                dot={seriesKeys.length === 1 ? { r: 3, fill: '#020617', stroke: CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length], strokeWidth: 2 } : false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (chart.type === 'bar' || chart.type === 'stacked_bar') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={visibleData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="stage" stroke="#475569" tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }} />
            <YAxis stroke="#475569" tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }} />
            <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', color: '#10b981', fontFamily: 'monospace', fontSize: '10px' }} />
            <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', color: '#94a3b8' }} />
            {seriesKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                name={formatSeriesLabel(key)}
                fill={CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length]}
                stackId={chart.type === 'stacked_bar' ? 'stack' : undefined}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (chart.type === 'radar') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={visibleData}>
            <PolarGrid stroke="#1e293b" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 8, fill: '#64748b', fontFamily: 'monospace' }} />
            <PolarRadiusAxis angle={30} tick={false} stroke="#1e293b" />
            <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', color: '#10b981', fontFamily: 'monospace', fontSize: '10px' }} />
            <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', color: '#94a3b8' }} />
            {seriesKeys.map((key, index) => (
              <Radar
                key={key}
                name={formatSeriesLabel(key)}
                dataKey={key}
                stroke={CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length]}
                fill={CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length]}
                fillOpacity={Math.max(0.15, 0.35 - (index * 0.07))}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      );
    }

    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-slate-500 font-mono">
        Chart format locked.
      </div>
    );
  };

  // Filter hotspots for the active system that have appeared up to the current stage
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

  const getDockButton = (type: PanelType, Icon: React.ElementType, label: string) => {
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
        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-[#050b14]/80 backdrop-blur-md border border-slate-800 text-emerald-500 font-mono text-[10px] tracking-widest uppercase py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
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
        className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden mr-2 sm:mr-4 bg-[#050b14]/70 backdrop-blur-md bg-scanlines border-y border-l border-slate-500/50 shadow-[0_0_40px_rgba(52,211,153,0.15)] pointer-events-auto flex flex-col relative before:absolute before:inset-0 before:pointer-events-none before:ring-1 before:ring-inset before:ring-white/10
          ${activePanel ? 'w-80 sm:w-80 opacity-100 border-r border-r-slate-500/50 translate-x-0' : 'w-0 opacity-0 translate-x-10 border-r-transparent'}
        `}
      >
        {activePanel && (
          <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-[#0a111a]/50">
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
            <div className="p-4 flex flex-col h-full space-y-6">
              {scenarioContext.chartConfigs && scenarioContext.chartConfigs.length > 0 ? (
                <>
                  <p className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-2">Analyzing active chart protocols.</p>
                  {scenarioContext.chartConfigs.map(chart => (
                    <div key={chart.id} className="flex flex-col mb-4 bg-[#0a111a]/50 p-3 border border-slate-800">
                      <div className="text-[10px] font-mono font-bold text-emerald-500 mb-1 tracking-widest uppercase">{chart.title}</div>
                      <div className="text-[9px] text-slate-400 mb-3 font-mono leading-relaxed">{chart.measureDescription}</div>
                      
                      <div className="h-48 w-full bg-[#020617]/50 backdrop-blur-sm border border-slate-900 relative">
                        {renderConfiguredChart(chart)}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <p className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-6">Analyzing {activeSystem} anomaly patterns over time.</p>
                  <div className="h-64 flex-shrink-0 bg-[#020617]/50 backdrop-blur-sm p-2 border border-slate-800 relative">
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
                </>
              )}
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
                        ? 'bg-emerald-900/40 backdrop-blur-md border-emerald-500 shadow-[inset_0_0_15px_rgba(52,211,153,0.1)]' 
                        : 'bg-[#0a111a]/60 backdrop-blur-sm border-slate-800 hover:border-emerald-900/50'
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
            <div className="p-4 space-y-4">
               <div className="bg-[#020617] p-4 border border-yellow-900 shadow-[inset_0_0_20px_rgba(234,179,8,0.05)] relative">
                 <div className="absolute top-0 left-0 w-full h-1 bg-yellow-600"></div>
                 <div className="text-slate-500 mb-4 border-b border-slate-800 pb-2 font-mono text-[9px] uppercase tracking-widest space-y-1">
                    <p>TO: <span className="text-slate-300">INVESTIGATION UNIT</span></p>
                    <p>FROM: <span className="text-slate-300">MAYOR&apos;S OFFICE (SECURE)</span></p>
                    <p>SUBJECT: <span className="text-yellow-500">{scenarioContext.code} MUNICIPAL INCIDENT DOSSIER</span></p>
                 </div>
                 <p className="whitespace-pre-line text-[11px] font-mono text-yellow-500/90 leading-relaxed uppercase">
                   &quot;{scenarioContext.dossier}&quot;
                 </p>
               </div>

               {/* Add intercepted internal emails to dossier */}
               {scenarioContext.hotspots
                 .filter(h => h.type === 'internal_email' && h.stageAppeared <= stage)
                 .map(email => (
                   <div key={email.id} className="bg-[#020617] p-3 border border-slate-700 relative shadow-sm">
                     <div className="absolute top-0 left-0 w-1 h-full bg-slate-500"></div>
                     <div className="text-slate-500 border-b border-slate-800 pb-2 mb-2 font-mono text-[9px] tracking-widest uppercase ml-2 flex justify-between">
                       <span>:: COMMS INTERCEPT</span>
                       <span>STAGE {email.stageAppeared}</span>
                     </div>
                     <div className="text-[10px] font-bold text-slate-300 mb-1 ml-2 tracking-widest uppercase">{email.title}</div>
                     <div className="text-[10px] text-slate-400 font-mono leading-relaxed ml-2">{email.description}</div>
                   </div>
                 ))}
            </div>
          )}

        </div>
      </div>

      {/* Static Dock */}
      <div className="bg-[#050b14]/70 backdrop-blur-md bg-scanlines border border-slate-500/50 flex flex-col pointer-events-auto shadow-[0_0_40px_rgba(52,211,153,0.15)] h-fit relative before:absolute before:inset-0 before:pointer-events-none before:ring-1 before:ring-inset before:ring-white/10">
        {getDockButton('metrics', Activity, 'Analytics')}
        {getDockButton('feed', Radio, 'Intercepts')}
        {getDockButton('evidence', Paperclip, 'Evidence Board')}
        <div className="w-full h-px bg-slate-800" />
        {getDockButton('dossier', Mail, 'Mission Dossier')}
      </div>

    </div>
  );
};
