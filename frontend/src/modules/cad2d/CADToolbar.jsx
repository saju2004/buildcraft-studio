import React from 'react';
import { 
  MousePointer, 
  Hand, 
  BrickWall, 
  DoorOpen, 
  AppWindow, 
  Columns3, 
  Maximize, 
  Ruler, 
  Slash, 
  Square, 
  Eraser,
  Compass,
  Layers,
  Sparkles
} from 'lucide-react';
import { useCADStore } from '../../stores/cadStore';
import { useUIStore } from '../../stores/uiStore';

export default function CADToolbar() {
  const { activeTool, setActiveTool, toolOptions, setToolOption } = useCADStore();
  const { setStatusMessage } = useUIStore();

  const handleToolSelect = (tool, promptMsg) => {
    setActiveTool(tool);
    setStatusMessage(promptMsg);
  };

  const tools = [
    { id: 'SELECT', label: 'Select (Esc)', icon: MousePointer, prompt: 'Select objects to inspect or edit properties' },
    { id: 'PAN', label: 'Pan (Space)', icon: Hand, prompt: 'Click and drag canvas to pan view' },
    { id: 'WALL', label: 'Wall (W)', icon: BrickWall, prompt: 'Specify start point of wall, then end point' },
    { id: 'DOOR', label: 'Door (D)', icon: DoorOpen, prompt: 'Click on a wall segment to insert a door opening' },
    { id: 'WINDOW', label: 'Window', icon: AppWindow, prompt: 'Click on a wall segment to insert a window opening' },
    { id: 'COLUMN', label: 'Column (C)', icon: Columns3, prompt: 'Click grid intersection to place structural column' },
    { id: 'ROOM', label: 'Room Area', icon: Maximize, prompt: 'Click inside enclosed walls to detect room boundaries' },
    { id: 'DIMENSION', label: 'Dimension', icon: Ruler, prompt: 'Click first point, then second point to place dimension' },
    { id: 'LINE', label: 'Line (L)', icon: Slash, prompt: 'Draw straight line segment' },
    { id: 'RECTANGLE', label: 'Rectangle (REC)', icon: Square, prompt: 'Draw rectangular room or boundary' },
    { id: 'ERASER', label: 'Eraser', icon: Eraser, prompt: 'Click any object to remove it from project' }
  ];

  return (
    <div className="w-12 bg-[#141820] border-r border-[#232936] flex flex-col items-center py-2 space-y-1 select-none z-30">
      {tools.map((t) => {
        const Icon = t.icon;
        const isActive = activeTool === t.id;
        return (
          <button
            key={t.id}
            onClick={() => handleToolSelect(t.id, t.prompt)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
              isActive 
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20' 
                : 'text-[#94a3b8] hover:bg-[#1e2430] hover:text-[#f1f5f9]'
            }`}
            title={t.label}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}

      <div className="w-8 border-t border-[#232936] my-1" />

      {/* Quick Tool Config Indicator */}
      {activeTool === 'WALL' && (
        <div className="flex flex-col items-center space-y-1 px-1">
          <span className="text-[9px] text-[#64748b] font-mono">THICK</span>
          <button
            onClick={() => setToolOption('wallThickness', toolOptions.wallThickness === 0.23 ? 0.115 : 0.23)}
            className="w-9 py-0.5 bg-[#1e2430] hover:bg-[#283244] rounded text-[10px] font-mono text-[#38bdf8] border border-[#2d3748]"
            title="Toggle Exterior (230mm) / Interior (115mm) thickness"
          >
            {Math.round(toolOptions.wallThickness * 1000)}
          </button>
        </div>
      )}

      {activeTool === 'COLUMN' && (
        <div className="flex flex-col items-center space-y-1 px-1">
          <span className="text-[9px] text-[#64748b] font-mono">SIZE</span>
          <button
            onClick={() => setToolOption('columnWidth', toolOptions.columnWidth === 0.3 ? 0.4 : 0.3)}
            className="w-9 py-0.5 bg-[#1e2430] hover:bg-[#283244] rounded text-[10px] font-mono text-[#f59e0b] border border-[#2d3748]"
            title="Toggle Column Size (300mm / 400mm)"
          >
            {Math.round(toolOptions.columnWidth * 1000)}
          </button>
        </div>
      )}
    </div>
  );
}
