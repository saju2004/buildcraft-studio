import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Minus, 
  Square, 
  X, 
  FolderOpen, 
  Save, 
  FileText, 
  Undo, 
  Redo, 
  Layers, 
  Grid, 
  Maximize, 
  Cpu, 
  DollarSign, 
  HelpCircle,
  Eye,
  Settings
} from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useProjectStore } from '../../stores/projectStore';
import { commandManager } from '../../engines/commands/commandManager';

export default function TopMenuBar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const { 
    setActiveView, 
    setNewProjectModalOpen, 
    setProjectDashboardOpen, 
    setAIPlannerOpen, 
    setEstimatesOpen, 
    setExportOpen, 
    setSettingsOpen,
    backendHealth
  } = useUIStore();

  const { name, hasUnsavedChanges } = useProjectStore();

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = () => setActiveMenu(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleMenuClick = (e, menuName) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleWindowControl = (action) => {
    if (window.electronAPI) {
      if (action === 'minimize') window.electronAPI.minimizeWindow();
      if (action === 'maximize') window.electronAPI.maximizeWindow();
      if (action === 'close') window.electronAPI.closeWindow();
    }
  };

  return (
    <div className="h-8 bg-[#12151b] border-b border-[#222733] flex items-center justify-between px-2 select-none z-50 text-xs text-[#94a3b8]">
      {/* Brand & Menus */}
      <div className="flex items-center space-x-1">
        {/* App Logo */}
        <div 
          onClick={() => setProjectDashboardOpen(true)}
          className="flex items-center space-x-1.5 px-2 py-1 cursor-pointer hover:bg-[#1a1f29] rounded text-white font-semibold transition-colors mr-2"
          title="Return to Dashboard"
        >
          <Building2 className="w-4 h-4 text-[#38bdf8]" />
          <span className="tracking-wide text-xs">BUILDCRAFT<span className="text-[#38bdf8] font-normal">STUDIO</span></span>
        </div>

        {/* Menu Items */}
        <div className="relative">
          <button 
            onClick={(e) => handleMenuClick(e, 'FILE')}
            className={`px-2 py-1 rounded transition-colors ${activeMenu === 'FILE' ? 'bg-[#2563eb] text-white' : 'hover:bg-[#1a1f29] hover:text-[#f1f5f9]'}`}
          >
            File
          </button>
          {activeMenu === 'FILE' && (
            <div className="absolute left-0 top-full mt-1 w-48 bg-[#161a22] border border-[#2b3342] rounded shadow-xl py-1 z-50 text-[#cbd5e1]">
              <button onClick={() => setNewProjectModalOpen(true)} className="w-full text-left px-3 py-1.5 hover:bg-[#2563eb] hover:text-white flex items-center justify-between">
                <span>New Project...</span>
                <span className="text-[#64748b] text-[10px]">Ctrl+N</span>
              </button>
              <button onClick={() => setProjectDashboardOpen(true)} className="w-full text-left px-3 py-1.5 hover:bg-[#2563eb] hover:text-white flex items-center justify-between">
                <span>Open Project...</span>
                <span className="text-[#64748b] text-[10px]">Ctrl+O</span>
              </button>
              <div className="border-t border-[#232936] my-1" />
              <button onClick={() => setExportOpen(true)} className="w-full text-left px-3 py-1.5 hover:bg-[#2563eb] hover:text-white flex items-center justify-between">
                <span>Export (DXF, GLB, PDF)...</span>
              </button>
              <div className="border-t border-[#232936] my-1" />
              <button onClick={() => setSettingsOpen(true)} className="w-full text-left px-3 py-1.5 hover:bg-[#2563eb] hover:text-white">
                Project Settings...
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button 
            onClick={(e) => handleMenuClick(e, 'EDIT')}
            className={`px-2 py-1 rounded transition-colors ${activeMenu === 'EDIT' ? 'bg-[#2563eb] text-white' : 'hover:bg-[#1a1f29] hover:text-[#f1f5f9]'}`}
          >
            Edit
          </button>
          {activeMenu === 'EDIT' && (
            <div className="absolute left-0 top-full mt-1 w-44 bg-[#161a22] border border-[#2b3342] rounded shadow-xl py-1 z-50 text-[#cbd5e1]">
              <button onClick={() => commandManager.undo()} className="w-full text-left px-3 py-1.5 hover:bg-[#2563eb] hover:text-white flex items-center justify-between">
                <span>Undo</span>
                <span className="text-[#64748b] text-[10px]">Ctrl+Z</span>
              </button>
              <button onClick={() => commandManager.redo()} className="w-full text-left px-3 py-1.5 hover:bg-[#2563eb] hover:text-white flex items-center justify-between">
                <span>Redo</span>
                <span className="text-[#64748b] text-[10px]">Ctrl+Y</span>
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button 
            onClick={(e) => handleMenuClick(e, 'VIEW')}
            className={`px-2 py-1 rounded transition-colors ${activeMenu === 'VIEW' ? 'bg-[#2563eb] text-white' : 'hover:bg-[#1a1f29] hover:text-[#f1f5f9]'}`}
          >
            View
          </button>
          {activeMenu === 'VIEW' && (
            <div className="absolute left-0 top-full mt-1 w-44 bg-[#161a22] border border-[#2b3342] rounded shadow-xl py-1 z-50 text-[#cbd5e1]">
              <button onClick={() => setActiveView('2D')} className="w-full text-left px-3 py-1.5 hover:bg-[#2563eb] hover:text-white">
                2D CAD Workspace
              </button>
              <button onClick={() => setActiveView('3D')} className="w-full text-left px-3 py-1.5 hover:bg-[#2563eb] hover:text-white">
                3D BIM Workspace
              </button>
              <button onClick={() => setActiveView('SPLIT')} className="w-full text-left px-3 py-1.5 hover:bg-[#2563eb] hover:text-white">
                Split 2D / 3D View
              </button>
            </div>
          )}
        </div>

        {/* Engineering Module Launchers */}
        <button 
          onClick={() => setAIPlannerOpen(true)}
          className="px-2 py-1 rounded hover:bg-[#1a1f29] hover:text-[#38bdf8] flex items-center space-x-1 text-[#38bdf8]"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>AI Architect</span>
        </button>

        <button 
          onClick={() => setEstimatesOpen(true)}
          className="px-2 py-1 rounded hover:bg-[#1a1f29] hover:text-[#34d399] flex items-center space-x-1 text-[#34d399]"
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Cost & BOQ</span>
        </button>
      </div>

      {/* Project Title Center */}
      <div className="flex items-center space-x-2 text-xs">
        <span className="font-medium text-[#f1f5f9]">{name}</span>
        {hasUnsavedChanges && (
          <span className="w-2 h-2 rounded-full bg-[#f59e0b]" title="Unsaved changes" />
        )}
      </div>

      {/* Backend Status & Window Controls */}
      <div className="flex items-center space-x-3">
        {/* Backend health status badge */}
        <div className="flex items-center space-x-1.5 px-2 py-0.5 bg-[#181d26] rounded border border-[#242b38] text-[10px]">
          <span className={`w-1.5 h-1.5 rounded-full ${backendHealth === 'UP' ? 'bg-[#22c55e] animate-pulse' : 'bg-[#ef4444]'}`} />
          <span className="text-[#94a3b8]">{backendHealth === 'UP' ? 'Spring Boot 3 + SQLite' : 'Offline / Local'}</span>
        </div>

        {/* Window controls */}
        <div className="flex items-center space-x-0.5">
          <button 
            onClick={() => handleWindowControl('minimize')}
            className="w-7 h-6 flex items-center justify-center hover:bg-[#222836] rounded text-[#94a3b8] hover:text-white"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => handleWindowControl('maximize')}
            className="w-7 h-6 flex items-center justify-center hover:bg-[#222836] rounded text-[#94a3b8] hover:text-white"
          >
            <Square className="w-3 h-3" />
          </button>
          <button 
            onClick={() => handleWindowControl('close')}
            className="w-7 h-6 flex items-center justify-center hover:bg-[#dc2626] rounded text-[#94a3b8] hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
