import React, { useEffect, useRef, useState } from 'react';
import Map, { MapRef, Marker } from 'react-map-gl/maplibre';
import type { StyleSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useCrisisStore } from '@/store/useCrisisStore';
import { Circle, Crosshair, Siren, TriangleAlert } from 'lucide-react';
import { getHotspotImportance, getHotspotImportanceLabel, simplifyHotspotDescription } from '@/lib/engine/hotspotPresentation';

const MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    cartoDark: {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    },
  },
  layers: [
    {
      id: 'carto-dark',
      type: 'raster',
      source: 'cartoDark',
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

const INITIAL_VIEW_STATE = {
  longitude: -46.6333,
  latitude: -23.5505,
  zoom: 11,
  pitch: 45,
  bearing: 0
};

export const UrbanMap = () => {
  const mapRef = useRef<MapRef | null>(null);
  const { scenarioContext, activeSystem, selectedHotspot, selectedHotspotFocusKey, setSelectedHotspot, stage } = useCrisisStore();

  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !selectedHotspot) return;

    mapRef.current?.flyTo({
      center: [selectedHotspot.lng, selectedHotspot.lat],
      zoom: Math.max(mapRef.current.getZoom(), 13.5),
      pitch: INITIAL_VIEW_STATE.pitch,
      bearing: INITIAL_VIEW_STATE.bearing,
      duration: 850,
    });
  }, [mounted, selectedHotspot, selectedHotspotFocusKey]);

  if (!mounted) return null;

  const hotspots = scenarioContext?.hotspots || [];

  // Filter visible hotspots: matches active system and <= current stage
  const visibleHotspots = hotspots.filter(
    h => h.system === activeSystem && h.stageAppeared <= stage
  );

  const recenterMap = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    mapRef.current?.flyTo({
      center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
      zoom: INITIAL_VIEW_STATE.zoom,
      pitch: INITIAL_VIEW_STATE.pitch,
      bearing: INITIAL_VIEW_STATE.bearing,
      duration: 900,
    });
  };

  const getImportanceBadge = (hotspot: NonNullable<typeof selectedHotspot>) => {
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

  return (
    <div className="absolute inset-0 z-0 bg-[#050b14]">
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
        minZoom={9}
        maxZoom={18}
        onClick={() => setSelectedHotspot(null)}
      >
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
                  ${hotspot.system === 'Temperature' ? 'bg-red-500/50' :
                    hotspot.system === 'Air' ? 'bg-purple-500/50' :
                      hotspot.system === 'Water' ? 'bg-cyan-500/50' :
                        hotspot.system === 'Energy' ? 'bg-yellow-500/50' :
                          hotspot.system === 'Mobility' ? 'bg-orange-500/50' :
                            hotspot.system === 'Waste' ? 'bg-stone-400/50' :
                              hotspot.system === 'Vegetation' ? 'bg-green-500/50' :
                                hotspot.system === 'Soil' ? 'bg-amber-700/50' :
                                  hotspot.system === 'Social' ? 'bg-pink-500/50' :
                                    hotspot.system === 'Health' ? 'bg-rose-600/50' :
                                      'bg-slate-500/50'
                  }`}
                />

                {/* Core Core */}
                <div className={`relative rounded-full z-10 transition-all duration-300 
                  ${stage === 5 ? 'w-2 h-2 opacity-100' :
                    stage >= 3 ? 'w-1.5 h-1.5 opacity-90' :
                      'w-1 h-1 opacity-80'
                  }
                  ${hotspot.system === 'Temperature' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' :
                    hotspot.system === 'Air' ? 'bg-purple-500 shadow-[0_0_8px_#a855f7]' :
                      hotspot.system === 'Water' ? 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]' :
                        hotspot.system === 'Energy' ? 'bg-yellow-500 shadow-[0_0_8px_#eab308]' :
                          hotspot.system === 'Mobility' ? 'bg-orange-500 shadow-[0_0_8px_#f97316]' :
                            hotspot.system === 'Waste' ? 'bg-stone-300 shadow-[0_0_8px_#a8a29e]' :
                              hotspot.system === 'Vegetation' ? 'bg-green-400 shadow-[0_0_8px_#22c55e]' :
                                hotspot.system === 'Soil' ? 'bg-amber-700 shadow-[0_0_8px_#b45309]' :
                                  hotspot.system === 'Social' ? 'bg-pink-500 shadow-[0_0_8px_#ec4899]' :
                                    hotspot.system === 'Health' ? 'bg-rose-600 shadow-[0_0_8px_#e11d48]' :
                                      'bg-slate-400 shadow-[0_0_8px_#94a3b8]'
                  } ${selectedHotspot?.id === hotspot.id ? 'scale-[2.5] ring-2 ring-white/80 ring-offset-2 ring-offset-[#050b14]' : 'scale-100 hover:scale-[3]'}
                `} />
              </div>

              {/* Cyberpunk Hook Popup */}
              {selectedHotspot?.id === hotspot.id && (() => {
                const sysColors = {
                  Temperature: { bg: 'bg-red-500', border: 'border-red-500/50', borderL: 'border-l-red-500', text: 'text-red-500', shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]' },
                  Air: { bg: 'bg-purple-500', border: 'border-purple-500/50', borderL: 'border-l-purple-500', text: 'text-purple-500', shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]' },
                  Water: { bg: 'bg-cyan-400', border: 'border-cyan-500/50', borderL: 'border-l-cyan-400', text: 'text-cyan-400', shadow: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]' },
                  Energy: { bg: 'bg-yellow-500', border: 'border-yellow-500/50', borderL: 'border-l-yellow-500', text: 'text-yellow-500', shadow: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]' },
                  Mobility: { bg: 'bg-orange-500', border: 'border-orange-500/50', borderL: 'border-l-orange-500', text: 'text-orange-500', shadow: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]' },

                  Waste: { bg: 'bg-stone-400', border: 'border-stone-500/50', borderL: 'border-l-stone-400', text: 'text-stone-400', shadow: 'shadow-[0_0_20px_rgba(168,162,158,0.3)]' },
                  Vegetation: { bg: 'bg-green-400', border: 'border-green-500/50', borderL: 'border-l-green-400', text: 'text-green-400', shadow: 'shadow-[0_0_20px_rgba(74,222,128,0.3)]' },
                  Soil: { bg: 'bg-amber-700', border: 'border-amber-700/50', borderL: 'border-l-amber-700', text: 'text-amber-500', shadow: 'shadow-[0_0_20px_rgba(180,83,9,0.3)]' },
                  Social: { bg: 'bg-pink-500', border: 'border-pink-500/50', borderL: 'border-l-pink-500', text: 'text-pink-500', shadow: 'shadow-[0_0_20px_rgba(236,72,153,0.3)]' },
                  Health: { bg: 'bg-rose-600', border: 'border-rose-600/50', borderL: 'border-l-rose-600', text: 'text-rose-500', shadow: 'shadow-[0_0_20px_rgba(225,29,72,0.3)]' }
                };
                const c = sysColors[hotspot.system as keyof typeof sysColors] || sysColors.Water;
                return (
                  <div className="absolute bottom-3 left-3 w-64 pointer-events-none">

                    {/* Diagonal Line Hook */}
                    <div className={`absolute -bottom-2 -left-2 w-8 h-[1px] ${c.bg} origin-bottom-left -rotate-45 opacity-80`} />

                    {/* Data Box */}
                    <div className={`ml-4 bg-[#050b14]/70 backdrop-blur-md bg-scanlines border border-slate-500/50 border-l-2 ${c.borderL} shadow-[0_0_40px_rgba(52,211,153,0.15)] p-3 ${c.shadow} translate-y-2 relative before:absolute before:inset-0 before:pointer-events-none before:ring-1 before:ring-inset before:ring-white/10`}>
                      <div className={`text-[10px] ${c.text} font-mono font-bold mb-1 tracking-[0.2em] uppercase flex items-center justify-between border-b border-slate-500/50 pb-1`}>
                        <span>[{hotspot.type === 'false_lead' ? 'UNVERIFIED' : hotspot.type === 'hint' ? 'ADVISORY' : hotspot.type} INTEL]</span>
                        <span className="text-slate-600 font-mono text-[8px] pl-4">{hotspot.lat.toFixed(4)}, {hotspot.lng.toFixed(4)}</span>
                      </div>
                      <div className="mb-2">
                        {getImportanceBadge(hotspot)}
                      </div>
                      <div className="text-xs text-slate-100 font-mono font-bold tracking-widest uppercase mb-1 leading-tight">{hotspot.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono leading-relaxed overflow-y-auto max-h-28 pointer-events-auto custom-scrollbar">{simplifyHotspotDescription(hotspot)}</div>
                    </div>

                  </div>
                );
              })()}

            </div>
          </Marker>
        ))}
      </Map>

      <button
        onClick={recenterMap}
        className="absolute top-[98px] left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 border border-cyan-400/60 bg-[#050b14]/80 px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200 shadow-[0_0_30px_rgba(6,182,212,0.18)] backdrop-blur-md transition-colors hover:border-cyan-300 hover:bg-cyan-400/10"
      >
        <Crosshair className="h-4 w-4" />
        Center SP
      </button>
    </div>
  );
};
