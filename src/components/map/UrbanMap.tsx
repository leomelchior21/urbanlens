import React, { useEffect, useRef, useState } from 'react';
import Map, { MapRef, Marker, Source, Layer } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useCrisisStore } from '@/store/useCrisisStore';

// MapTiler / Carto Dark Matter style URL
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const INITIAL_VIEW_STATE = {
  longitude: -46.6333,
  latitude: -23.5505,
  zoom: 11,
  pitch: 45,
  bearing: 0
};

export const UrbanMap = () => {
  const mapRef = useRef<MapRef | null>(null);
  const { scenarioContext, activeSystem, selectedHotspot, setSelectedHotspot, stage, pinEvidence, pinnedEvidence } = useCrisisStore();

  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const hotspots = scenarioContext?.hotspots || [];

  // Filter visible hotspots: matches active system and <= current stage
  const visibleHotspots = hotspots.filter(
    h => h.system === activeSystem && h.stageAppeared <= stage
  );

  return (
    <div className="absolute inset-0 z-0">
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle={MAP_STYLE}
        minZoom={9}
        maxZoom={18}
        onClick={() => setSelectedHotspot(null)}
        interactiveLayerIds={['building-extrusion']}
      >
        {/* Adds 3D buildings to the dark map */}
        <Source
          id="openmaptiles"
          type="vector"
          url="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json" // Note: Carto doesn't provide building heights directly in standard free dark-matter without OpenMapTiles source. Let's omit extrusion unless we have a specific source, but we can try to style it if generic vector tiles are present.
        />

        {/* 
          Since CARTO Dark matter might lack building extrusions, 
          we will rely primarily on our custom layers for the tactical feel. 
        */}

        {/* Hotspots */}
        {visibleHotspots.map(hotspot => (
          <Marker
            key={hotspot.id}
            longitude={hotspot.lng}
            latitude={hotspot.lat}
            anchor="bottom"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick={(e: any) => {
              e.originalEvent.stopPropagation();
              setSelectedHotspot(hotspot);
            }}
          >
            <div className={`relative cursor-pointer transition-all duration-500 ${selectedHotspot?.id === hotspot.id ? 'z-50' : 'z-10 hover:scale-125 hover:z-40'}`}>

              {/* Tactical Pulsing Dot */}
              <div className="relative flex items-center justify-center">
                {/* Radar Ping rings */}
                <div className={`absolute rounded-full pointer-events-none transition-all animate-ping
                  ${stage === 5 ? 'w-8 h-8 duration-700 opacity-70' :
                    stage >= 3 ? 'w-6 h-6 duration-1000 opacity-60' :
                      'w-4 h-4 duration-[1500ms] opacity-50'
                  }
                  ${hotspot.system === 'Temperature' ? 'bg-orange-500/50' :
                    hotspot.system === 'Air' ? 'bg-yellow-400/50' :
                      hotspot.system === 'Water' ? 'bg-cyan-500/50' :
                        hotspot.system === 'Energy' ? 'bg-purple-500/50' :
                          hotspot.system === 'Mobility' ? 'bg-emerald-400/50' :
                            hotspot.system === 'Waste' ? 'bg-stone-400/50' :
                              'bg-green-500/50'
                  }`}
                />

                {/* Core Core */}
                <div className={`relative rounded-full z-10 transition-all duration-300 
                  ${stage === 5 ? 'w-2 h-2 opacity-100' :
                    stage >= 3 ? 'w-1.5 h-1.5 opacity-90' :
                      'w-1 h-1 opacity-80'
                  }
                  ${hotspot.system === 'Temperature' ? 'bg-orange-400 shadow-[0_0_8px_#f97316]' :
                    hotspot.system === 'Air' ? 'bg-yellow-400 shadow-[0_0_8px_#facc15]' :
                      hotspot.system === 'Water' ? 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]' :
                        hotspot.system === 'Energy' ? 'bg-purple-400 shadow-[0_0_8px_#a855f7]' :
                          hotspot.system === 'Mobility' ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' :
                            hotspot.system === 'Waste' ? 'bg-stone-300 shadow-[0_0_8px_#a8a29e]' :
                              'bg-green-400 shadow-[0_0_8px_#22c55e]'
                  } ${selectedHotspot?.id === hotspot.id ? 'scale-[2.5] ring-2 ring-white/80 ring-offset-2 ring-offset-[#050b14]' : 'scale-100 hover:scale-[3]'}
                `} />
              </div>

              {/* Cyberpunk Hook Popup */}
              {selectedHotspot?.id === hotspot.id && (() => {
                const sysColors = {
                  Temperature: { bg: 'bg-orange-400', border: 'border-orange-500/50', borderL: 'border-l-orange-400', text: 'text-orange-400', shadow: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]' },
                  Air: { bg: 'bg-yellow-400', border: 'border-yellow-500/50', borderL: 'border-l-yellow-400', text: 'text-yellow-400', shadow: 'shadow-[0_0_20px_rgba(250,204,21,0.3)]' },
                  Water: { bg: 'bg-cyan-400', border: 'border-cyan-500/50', borderL: 'border-l-cyan-400', text: 'text-cyan-400', shadow: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]' },
                  Energy: { bg: 'bg-purple-400', border: 'border-purple-500/50', borderL: 'border-l-purple-400', text: 'text-purple-400', shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]' },
                  Mobility: { bg: 'bg-emerald-400', border: 'border-emerald-500/50', borderL: 'border-l-emerald-400', text: 'text-emerald-400', shadow: 'shadow-[0_0_20px_rgba(52,211,153,0.3)]' },
                  Waste: { bg: 'bg-stone-400', border: 'border-stone-500/50', borderL: 'border-l-stone-400', text: 'text-stone-400', shadow: 'shadow-[0_0_20px_rgba(168,162,158,0.3)]' },
                  Vegetation: { bg: 'bg-green-400', border: 'border-green-500/50', borderL: 'border-l-green-400', text: 'text-green-400', shadow: 'shadow-[0_0_20px_rgba(74,222,128,0.3)]' }
                };
                const c = sysColors[hotspot.system] || sysColors.Water;
                return (
                  <div className="absolute bottom-3 left-3 w-64 pointer-events-none">

                    {/* Diagonal Line Hook */}
                    <div className={`absolute -bottom-2 -left-2 w-8 h-[1px] ${c.bg} origin-bottom-left -rotate-45 opacity-80`} />

                    {/* Data Box */}
                    <div className={`ml-4 bg-[#050b14] bg-scanlines border border-slate-800 border-l-2 ${c.borderL} p-3 ${c.shadow} translate-y-2 relative before:absolute before:inset-0 before:pointer-events-none before:ring-1 before:ring-inset before:ring-white/5`}>
                      <div className={`text-[10px] ${c.text} font-mono font-bold mb-1 tracking-[0.2em] uppercase flex items-center justify-between border-b border-slate-800 pb-1`}>
                        <span>[{hotspot.type === 'false_lead' ? 'UNVERIFIED' : hotspot.type === 'hint' ? 'ADVISORY' : hotspot.type} INTEL]</span>
                        <span className="text-slate-600 font-mono text-[8px] pl-4">{hotspot.lat.toFixed(4)}, {hotspot.lng.toFixed(4)}</span>
                      </div>
                      <div className="text-xs text-slate-100 font-mono font-bold tracking-widest uppercase mb-1 leading-tight">{hotspot.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono leading-relaxed line-clamp-3 overflow-y-auto max-h-24 pointer-events-auto custom-scrollbar mb-2 uppercase">{hotspot.description}</div>

                      {/* Action Row */}
                      <div className="flex justify-end pt-2 border-t border-slate-800 pointer-events-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            pinEvidence(hotspot);
                          }}
                          disabled={pinnedEvidence.some(h => h.id === hotspot.id)}
                          className={`text-[9px] font-mono tracking-widest uppercase font-bold px-2 py-1 transition-colors border ${pinnedEvidence.some(h => h.id === hotspot.id)
                            ? 'bg-[#020617] text-slate-600 border-slate-800 cursor-not-allowed'
                            : 'bg-emerald-900/20 text-emerald-400 hover:bg-emerald-900/40 border-emerald-900 shadow-[inset_0_0_10px_rgba(52,211,153,0.1)]'
                            }`}
                        >
                          {pinnedEvidence.some(h => h.id === hotspot.id) ? '[ PINNED ]' : '[+ PIN EVIDENCE]'}
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })()}

            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
};
