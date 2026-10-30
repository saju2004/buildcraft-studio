import React from 'react';
import { 
  Sliders, 
  Trash2, 
  Layers, 
  Maximize2, 
  Ruler, 
  Square, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { useCADStore } from '../../stores/cadStore';
import { useProjectStore } from '../../stores/projectStore';
import { distance } from '../../engines/geometry/transforms';

export default function PropertiesInspector() {
  const { selectedElementId, selectedElementType, setSelectedElement } = useCADStore();
  const { 
    plot, 
    walls, 
    columns, 
    doors, 
    windows, 
    rooms, 
    updateWall, 
    deleteElement 
  } = useProjectStore();

  const selectedWall = walls.find((w) => w.id === selectedElementId);
  const selectedColumn = columns.find((c) => c.id === selectedElementId);
  const selectedDoor = doors.find((d) => d.id === selectedElementId);
  const selectedWindow = windows.find((win) => win.id === selectedElementId);

  // If a wall is selected
  if (selectedWall) {
    const len = distance({ x: selectedWall.startX, y: selectedWall.startY }, { x: selectedWall.endX, y: selectedWall.endY });
    return (
      <div className="w-64 bg-[#141820] border-l border-[#232936] flex flex-col h-full select-none text-xs text-[#cbd5e1]">
        <div className="h-9 px-3 border-b border-[#232936] flex items-center justify-between font-semibold text-white">
          <div className="flex items-center space-x-1.5">
            <Sliders className="w-4 h-4 text-[#38bdf8]" />
            <span>Wall Properties</span>
          </div>
          <button 
            onClick={() => {
              deleteElement(selectedWall.id);
              setSelectedElement(null);
            }}
            className="text-[#ef4444] hover:bg-[#2c1c24] p-1 rounded"
            title="Delete Wall"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-3 space-y-3 overflow-y-auto flex-1 font-mono">
          <div>
            <label className="text-[10px] text-[#64748b]">WALL ID</label>
            <div className="text-white text-xs mt-0.5 truncate">{selectedWall.id}</div>
          </div>

          <div>
            <label className="text-[10px] text-[#64748b]">TYPE</label>
            <select
              value={selectedWall.wallType || 'EXTERIOR'}
              onChange={(e) => updateWall(selectedWall.id, { wallType: e.target.value })}
              className="w-full bg-[#1e2430] border border-[#2d3748] rounded px-2 py-1 text-white text-xs mt-0.5"
            >
              <option value="EXTERIOR">EXTERIOR (Load Bearing)</option>
              <option value="INTERIOR">INTERIOR (Partition)</option>
              <option value="RETAINING">RETAINING WALL</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-[#64748b]">LENGTH (METERS)</label>
            <div className="bg-[#1a202c] border border-[#2d3748] rounded px-2 py-1 text-[#38bdf8] font-bold">
              {len.toFixed(2)} m
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-[#64748b]">THICKNESS (m)</label>
              <input
                type="number"
                step="0.01"
                value={selectedWall.thickness || 0.23}
                onChange={(e) => updateWall(selectedWall.id, { thickness: parseFloat(e.target.value) || 0.23 })}
                className="w-full bg-[#1e2430] border border-[#2d3748] rounded px-2 py-1 text-white text-xs mt-0.5"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#64748b]">HEIGHT (m)</label>
              <input
                type="number"
                step="0.1"
                value={selectedWall.height || 3.0}
                onChange={(e) => updateWall(selectedWall.id, { height: parseFloat(e.target.value) || 3.0 })}
                className="w-full bg-[#1e2430] border border-[#2d3748] rounded px-2 py-1 text-white text-xs mt-0.5"
              />
            </div>
          </div>

          <div className="border-t border-[#232936] pt-2">
            <label className="text-[10px] text-[#64748b]">START POINT</label>
            <div className="text-[11px] text-[#94a3b8] mt-0.5">
              X: {selectedWall.startX.toFixed(2)}m, Y: {selectedWall.startY.toFixed(2)}m
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#64748b]">END POINT</label>
            <div className="text-[11px] text-[#94a3b8] mt-0.5">
              X: {selectedWall.endX.toFixed(2)}m, Y: {selectedWall.endY.toFixed(2)}m
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If a column is selected
  if (selectedColumn) {
    return (
      <div className="w-64 bg-[#141820] border-l border-[#232936] flex flex-col h-full select-none text-xs text-[#cbd5e1]">
        <div className="h-9 px-3 border-b border-[#232936] flex items-center justify-between font-semibold text-white">
          <div className="flex items-center space-x-1.5">
            <Sliders className="w-4 h-4 text-[#f59e0b]" />
            <span>Column Properties</span>
          </div>
          <button 
            onClick={() => {
              deleteElement(selectedColumn.id);
              setSelectedElement(null);
            }}
            className="text-[#ef4444] hover:bg-[#2c1c24] p-1 rounded"
            title="Delete Column"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-3 space-y-3 font-mono">
          <div>
            <label className="text-[10px] text-[#64748b]">COLUMN ID</label>
            <div className="text-white text-xs mt-0.5">{selectedColumn.id}</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-[#64748b]">WIDTH (m)</label>
              <div className="bg-[#1a202c] border border-[#2d3748] rounded px-2 py-1 text-[#f59e0b]">
                {(selectedColumn.width || 0.3).toFixed(2)} m
              </div>
            </div>
            <div>
              <label className="text-[10px] text-[#64748b]">DEPTH (m)</label>
              <div className="bg-[#1a202c] border border-[#2d3748] rounded px-2 py-1 text-[#f59e0b]">
                {(selectedColumn.depth || 0.3).toFixed(2)} m
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#64748b]">POSITION</label>
            <div className="text-white text-xs mt-0.5">
              X: {selectedColumn.x.toFixed(2)}m, Y: {selectedColumn.y.toFixed(2)}m
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: Site & Plot Overview Properties
  const plotArea = (plot.width * plot.length).toFixed(1);
  return (
    <div className="w-64 bg-[#141820] border-l border-[#232936] flex flex-col h-full select-none text-xs text-[#cbd5e1]">
      <div className="h-9 px-3 border-b border-[#232936] flex items-center justify-between font-semibold text-white">
        <div className="flex items-center space-x-1.5">
          <Square className="w-4 h-4 text-[#38bdf8]" />
          <span>Plot & Project Data</span>
        </div>
      </div>

      <div className="p-3 space-y-3 overflow-y-auto flex-1 font-mono">
        <div className="bg-[#181d26] p-2 rounded border border-[#263040]">
          <span className="text-[10px] text-[#64748b]">TOTAL PLOT AREA</span>
          <div className="text-lg font-bold text-[#38bdf8]">{plotArea} m²</div>
          <div className="text-[10px] text-[#94a3b8]">{(plot.width * plot.length * 10.7639).toFixed(0)} sq. ft</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-[#64748b]">WIDTH</label>
            <div className="bg-[#1a202c] border border-[#2d3748] rounded px-2 py-1 text-white">
              {plot.width.toFixed(1)} m
            </div>
          </div>
          <div>
            <label className="text-[10px] text-[#64748b]">LENGTH</label>
            <div className="bg-[#1a202c] border border-[#2d3748] rounded px-2 py-1 text-white">
              {plot.length.toFixed(1)} m
            </div>
          </div>
        </div>

        <div className="border-t border-[#232936] pt-2">
          <span className="text-[10px] text-[#64748b] block mb-1">MANDATORY SETBACKS</span>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] text-[#94a3b8]">
            <div>Front: {plot.setbackFront || 3.0}m</div>
            <div>Rear: {plot.setbackRear || 2.0}m</div>
            <div>Left: {plot.setbackLeft || 1.5}m</div>
            <div>Right: {plot.setbackRight || 1.5}m</div>
          </div>
        </div>

        <div className="border-t border-[#232936] pt-2 space-y-1 text-[#94a3b8]">
          <div className="flex justify-between">
            <span>Total Walls:</span>
            <span className="text-white font-bold">{walls.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Columns:</span>
            <span className="text-white font-bold">{columns.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Doors & Windows:</span>
            <span className="text-white font-bold">{doors.length + windows.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Identified Rooms:</span>
            <span className="text-white font-bold">{rooms.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
