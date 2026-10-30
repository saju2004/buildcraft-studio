import React, { useState, useEffect } from 'react';
import { 
  FilePlus, 
  FolderOpen, 
  Save, 
  Undo2, 
  Redo2, 
  Layers, 
  Grid, 
  Magnet, 
  Crosshair, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Box,
  LayoutGrid,
  Columns,
  Cpu,
  Calculator,
  ChevronDown
} from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useCADStore } from '../../stores/cadStore';
import { useProjectStore } from '../../stores/projectStore';
import { commandManager } from '../../engines/commands/commandManager';
import { apiService } from '../../services/apiService';

export default function QuickAccessToolbar() {
  const { 
    activeView, 
    setActiveView, 
    setNewProjectModalOpen, 
    setProjectDashboardOpen, 
    setAIPlannerOpen, 
    setEstimatesOpen,
    setStatusMessage
  } = useUIStore();

  const { 
    snapping, 
    toggleGridSnap, 
    toggleObjectSnap, 
    toggleOrtho, 
    zoomBy, 
    resetView,
    viewport 
  } = useCADStore();

  const { 
    projectId, 
    name, 
    clientName, 
    location, 
    category, 
    unitSystem, 
    lengthUnit, 
    plot, 
    levels, 
    activeLevelId, 
    setActiveLevel,
    serializeScene,
    markSaved,
    hasUnsavedChanges
  } = useProjectStore();

  const [canUndo, setCanUndo] = useState(commandManager.canUndo());
  const [canRedo, setCanRedo] = useState(commandManager.canRedo());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    return commandManager.subscribe((info) => {
      setCanUndo(info.canUndo);
      setCanRedo(info.canRedo);
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage('Saving project to SQLite database...');
    try {
      const sceneData = serializeScene();
      const payload = {
        name,
        clientName,
        location,
        category,
        unitSystem,
        lengthUnit,
        plotWidth: plot.width,
        plotLength: plot.length,
        floorCount: levels.length,
        projectDataJson: JSON.stringify(sceneData)
      };

      if (projectId) {
        await apiService.updateProject(projectId, payload);
      } else {
        const res = await apiService.createProject(payload);
        useProjectStore.setState({ projectId: res.id });
      }

      markSaved();
      setStatusMessage('Project saved successfully.');
    } catch (err) {
      console.error('Save failed:', err);
      setStatusMessage(`Save failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-10 bg-[#161a22] border-b border-[#242b38] flex items-center justify-between px-3 text-xs text-[#cbd5e1] select-none">
      {/* Quick Action Icons */}
      <div className="flex items-center space-x-1.5">
        <button 
          onClick={() => setNewProjectModalOpen(true)}
          className="p-1.5 hover:bg-[#202735] rounded text-[#94a3b8] hover:text-white transition-colors"
          title="New Project (Ctrl+N)"
        >
          <FilePlus className="w-4 h-4" />
        </button>

        <button 
          onClick={() => setProjectDashboardOpen(true)}
          className="p-1.5 hover:bg-[#202735] rounded text-[#94a3b8] hover:text-white transition-colors"
          title="Open Project Dashboard (Ctrl+O)"
        >
          <FolderOpen className="w-4 h-4" />
        </button>

        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`p-1.5 hover:bg-[#202735] rounded transition-colors ${hasUnsavedChanges ? 'text-[#38bdf8]' : 'text-[#94a3b8]'} hover:text-white`}
          title="Save Project (Ctrl+S)"
        >
          <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
        </button>

        <div className="h-4 w-px bg-[#2a3242] mx-1" />

        {/* Undo / Redo */}
        <button 
          onClick={() => commandManager.undo()}
          disabled={!canUndo}
          className={`p-1.5 rounded transition-colors ${canUndo ? 'text-[#cbd5e1] hover:bg-[#202735] hover:text-white' : 'text-[#475569] cursor-not-allowed'}`}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        <button 
          onClick={() => commandManager.redo()}
          disabled={!canRedo}
          className={`p-1.5 rounded transition-colors ${canRedo ? 'text-[#cbd5e1] hover:bg-[#202735] hover:text-white' : 'text-[#475569] cursor-not-allowed'}`}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-[#2a3242] mx-1" />

        {/* Snapping Controls */}
        <button 
          onClick={toggleGridSnap}
          className={`p-1.5 rounded flex items-center space-x-1 transition-colors ${snapping.isGridSnap ? 'bg-[#1e293b] text-[#38bdf8] border border-[#38bdf8]/40' : 'text-[#64748b] hover:bg-[#202735]'}`}
          title="Snap to Grid (F9)"
        >
          <Grid className="w-3.5 h-3.5" />
          <span className="text-[11px] font-mono">GRID</span>
        </button>

        <button 
          onClick={toggleObjectSnap}
          className={`p-1.5 rounded flex items-center space-x-1 transition-colors ${snapping.isObjectSnap ? 'bg-[#1e293b] text-[#22c55e] border border-[#22c55e]/40' : 'text-[#64748b] hover:bg-[#202735]'}`}
          title="Object Snap - Endpoints & Midpoints (F3)"
        >
          <Magnet className="w-3.5 h-3.5" />
          <span className="text-[11px] font-mono">OSNAP</span>
        </button>

        <button 
          onClick={toggleOrtho}
          className={`p-1.5 rounded flex items-center space-x-1 transition-colors ${snapping.isOrtho ? 'bg-[#1e293b] text-[#f59e0b] border border-[#f59e0b]/40' : 'text-[#64748b] hover:bg-[#202735]'}`}
          title="Orthogonal Mode - 90 Degree Constraints (F8)"
        >
          <Crosshair className="w-3.5 h-3.5" />
          <span className="text-[11px] font-mono">ORTHO</span>
        </button>

        <div className="h-4 w-px bg-[#2a3242] mx-1" />

        {/* Level / Floor Selector */}
        <div className="flex items-center space-x-1.5 bg-[#1a202c] px-2 py-1 rounded border border-[#2d3748]">
          <Layers className="w-3.5 h-3.5 text-[#38bdf8]" />
          <select 
            value={activeLevelId} 
            onChange={(e) => setActiveLevel(e.target.value)}
            className="bg-transparent text-xs text-[#e2e8f0] focus:outline-none cursor-pointer pr-1"
          >
            {levels.map((lvl) => (
              <option key={lvl.id} value={lvl.id} className="bg-[#1a202c] text-white">
                {lvl.name} ({lvl.elevation.toFixed(1)}m)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Viewport Mode Switcher & Tools */}
      <div className="flex items-center space-x-3">
        {/* Zoom Controls */}
        <div className="flex items-center space-x-1 bg-[#1a202c] p-0.5 rounded border border-[#2d3748]">
          <button 
            onClick={() => zoomBy(1.2)}
            className="p-1 hover:bg-[#2d3748] rounded text-[#94a3b8] hover:text-white"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono px-1 text-[#64748b]">{Math.round((viewport.zoom / 45) * 100)}%</span>
          <button 
            onClick={() => zoomBy(0.8)}
            className="p-1 hover:bg-[#2d3748] rounded text-[#94a3b8] hover:text-white"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={resetView}
            className="p-1 hover:bg-[#2d3748] rounded text-[#94a3b8] hover:text-white"
            title="Reset View / Extents"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2D / 3D / Split Switcher */}
        <div className="flex items-center bg-[#12161f] p-0.5 rounded-lg border border-[#283140]">
          <button 
            onClick={() => setActiveView('2D')}
            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center space-x-1.5 transition-all ${activeView === '2D' ? 'bg-[#2563eb] text-white shadow-sm' : 'text-[#94a3b8] hover:text-white'}`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>2D CAD</span>
          </button>

          <button 
            onClick={() => setActiveView('3D')}
            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center space-x-1.5 transition-all ${activeView === '3D' ? 'bg-[#2563eb] text-white shadow-sm' : 'text-[#94a3b8] hover:text-white'}`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D BIM</span>
          </button>

          <button 
            onClick={() => setActiveView('SPLIT')}
            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center space-x-1.5 transition-all ${activeView === 'SPLIT' ? 'bg-[#2563eb] text-white shadow-sm' : 'text-[#94a3b8] hover:text-white'}`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split View</span>
          </button>
        </div>

        {/* AI & Estimator Action Pills */}
        <button 
          onClick={() => setAIPlannerOpen(true)}
          className="px-2.5 py-1 bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] hover:from-[#0369a1] hover:to-[#0284c7] text-white rounded font-medium flex items-center space-x-1.5 shadow-sm transition-all"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>AI Plan</span>
        </button>

        <button 
          onClick={() => setEstimatesOpen(true)}
          className="px-2.5 py-1 bg-gradient-to-r from-[#059669] to-[#10b981] hover:from-[#047857] hover:to-[#059669] text-white rounded font-medium flex items-center space-x-1.5 shadow-sm transition-all"
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Takeoff & BOQ</span>
        </button>
      </div>
    </div>
  );
}
