import React, { useMemo } from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';
import { useCrisisStore, SystemType } from '@/store/useCrisisStore';

// Dynamic color palettes for each system's heatmap
const HEATMAP_COLORS: Record<SystemType, any[]> = {
  Temperature: [0, 'rgba(255, 165, 0, 0)', 0.2, '#f97316', 0.5, '#ef4444', 1, '#991b1b'],
  Water:       [0, 'rgba(6, 182, 212, 0)', 0.2, '#0ea5e9', 0.5, '#06b6d4', 1, '#cffafe'],
  Air:         [0, 'rgba(250, 204, 21, 0)', 0.2, '#eab308', 0.5, '#facc15', 1, '#fef08a'],
  Energy:      [0, 'rgba(168, 85, 247, 0)', 0.2, '#9333ea', 0.5, '#a855f7', 1, '#f3e8ff'],
  Mobility:    [0, 'rgba(16, 185, 129, 0)', 0.2, '#059669', 0.5, '#10b981', 1, '#d1fae5'],
  Waste:       [0, 'rgba(120, 113, 108, 0)', 0.2, '#78716c', 0.5, '#a8a29e', 1, '#f5f5f4'],
  Vegetation:  [0, 'rgba(34, 197, 94, 0)', 0.2, '#16a34a', 0.5, '#22c55e', 1, '#dcfce7']
};

const RADAR_COLORS: Record<SystemType, string> = {
  Temperature: '#f97316',
  Water: '#06b6d4',
  Air: '#facc15',
  Energy: '#a855f7',
  Mobility: '#10b981',
  Waste: '#a8a29e',
  Vegetation: '#22c55e'
};

export const SystemLayer = () => {
  const { activeSystem, scenarioContext, stage } = useCrisisStore();

  const hotspots = scenarioContext?.hotspots || [];
  
  // Transform active hotspots to GeoJSON
  const geojson = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: hotspots
        .filter(h => h.system === activeSystem && h.stageAppeared <= stage)
        .map(h => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [h.lng, h.lat] },
          properties: { weight: Math.max(1, stage - h.stageAppeared + 1) * 3 } // Older points inside current stage weight more
        }))
    };
  }, [hotspots, activeSystem, stage]);

  const activeColorPalette = HEATMAP_COLORS[activeSystem as SystemType] || HEATMAP_COLORS['Temperature'];
  const activeRadar = RADAR_COLORS[activeSystem as SystemType] || RADAR_COLORS['Temperature'];

  // Force remount when system changes to avoid maplibre source conflict errors
  const sourceKey = `source-${activeSystem}-${stage}`;

  return (
    <React.Fragment key={sourceKey}>
      <Source id="system-source" type="geojson" data={geojson as any}>
        
        {/* Deep Glow Heatmap Layer */}
        <Layer
          id="system-heatmap"
          type="heatmap"
          paint={{
            'heatmap-weight': ['get', 'weight'],
            'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 9, 1, 15, 3],
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              ...activeColorPalette
            ],
            // Scale heatmap radius by zoom
            'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 9, 30, 15, 100],
            'heatmap-opacity': 0.85
          }}
        />

        {/* Tactical Outer Radar Ring */}
        <Layer
          id="system-radar-outer"
          type="circle"
          paint={{
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 15, 15, 45],
            'circle-color': 'transparent',
            'circle-stroke-width': 2,
            'circle-stroke-color': activeRadar,
            'circle-stroke-opacity': 0.3
          }}
        />

        {/* Tactical Inner Target Ring */}
        <Layer
          id="system-radar-inner"
          type="circle"
          paint={{
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 8, 15, 25],
            'circle-color': 'transparent',
            'circle-stroke-width': 1.5,
            'circle-stroke-color': activeRadar,
            'circle-stroke-opacity': 0.8
          }}
        />

        {/* Center Point */}
        <Layer
          id="system-radar-center"
          type="circle"
          paint={{
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 3, 15, 6],
            'circle-color': activeRadar,
            'circle-opacity': 1
          }}
        />

      </Source>
    </React.Fragment>
  );
};
