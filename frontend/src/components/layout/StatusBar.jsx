import React from 'react';
import { useCADStore } from '../../stores/cadStore';
import { useProjectStore } from '../../stores/projectStore';
import { useUIStore } from '../../stores/uiStore';
import { formatMeasurement } from '../../engines/geometry/transforms';

export default function StatusBar() {
  const { cursor, snapping, viewport, snapIndicator } = useCADStore();
  const { unitSystem, lengthUnit, activeLevelId, levels } = useProjectStore();
  const { statusMessage, backendHealth } = useUIStore();

  const activeLevel = levels.find((l) => l.id === activeLevelId) || levels[0];

  return (
    <div className="h-6 bg-[#0d1016] border-t border-[#1e2430] flex items-center justify-between px-3 text-[11px] font-mono text-[#94a3b8] select-none z-40">
      {/* Left: Coordinate Readouts & Snap indicator */}
      <div className="flex items-center space-x-4">
        {/* Real-time Engineering Coordinates */}
        <div className="flex items-center space-x-2 bg-[#141822] px-2 py-0.5 rounded border border-[#222a3a]">
          <span className="text-[#64748b]">X:</span>
          <span className="text-[#38bdf8] w-16">{cursor.worldX.toFixed(2)} m</span>
          <span className="text-[#64748b]">Y:</span>
          <span className="text-[#38bdf8] w-16">{cursor.worldY.toFixed(2)} m</span>
          <span className="text-[#64748b]">Z:</span>
          <span className="text-[#38bdf8] w-14">{(activeLevel ? activeLevel.elevation : 0).toFixed(2)} m</span>
        </div>

        {/* Snap mode indicator */}
        {snapIndicator.active && (
          <div className="flex items-center space-x-1 text-[#22c55e] animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            <span>SNAP: {snapIndicator.type}</span>
          </div>
        )}

        {/* Status prompt */}
        <span className="text-[#cbd5e1] font-sans truncate max-w-md">{statusMessage}</span>
      </div>

      {/* Right: Toggles & Unit system */}
      <div className="flex items-center space-x-3">
        {/* Snapping States */}
        <div className="flex items-center space-x-1.5">
          <span className={`px-1.5 py-0.2 rounded text-[10px] ${snapping.isGridSnap ? 'text-[#38bdf8] bg-[#1e293b]' : 'text-[#475569]'}`}>GRID</span>
          <span className={`px-1.5 py-0.2 rounded text-[10px] ${snapping.isObjectSnap ? 'text-[#22c55e] bg-[#1e293b]' : 'text-[#475569]'}`}>SNAP</span>
          <span className={`px-1.5 py-0.2 rounded text-[10px] ${snapping.isOrtho ? 'text-[#f59e0b] bg-[#1e293b]' : 'text-[#475569]'}`}>ORTHO</span>
        </div>

        <div className="h-3 w-px bg-[#222a3a]" />

        {/* Unit system */}
        <span className="text-[#94a3b8]">{unitSystem} ({lengthUnit})</span>

        <div className="h-3 w-px bg-[#222a3a]" />

        {/* Active Level */}
        <span className="text-[#cbd5e1]">{activeLevel ? activeLevel.name : 'Ground'}</span>

        <div className="h-3 w-px bg-[#222a3a]" />

        {/* Zoom */}
        <span className="text-[#64748b]">Zoom: {Math.round((viewport.zoom / 45) * 100)}%</span>
      </div>
    </div>
  );
}
