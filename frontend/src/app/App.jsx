import React, { useEffect, useState } from 'react';
import TopMenuBar from '../components/layout/TopMenuBar';
import QuickAccessToolbar from '../components/layout/QuickAccessToolbar';
import StatusBar from '../components/layout/StatusBar';
import CommandLine from '../components/layout/CommandLine';
import CADToolbar from '../modules/cad2d/CADToolbar';
import CAD2DViewport from '../modules/cad2d/CAD2DViewport';
import Model3DViewport from '../modules/modelling3d/Model3DViewport';
import PropertiesInspector from '../modules/properties/PropertiesInspector';
import ProjectDashboard from '../modules/dashboard/ProjectDashboard';
import NewProjectModal from '../components/dialogs/NewProjectModal';
import AIPlannerModal from '../components/dialogs/AIPlannerModal';
import EstimatesModal from '../components/dialogs/EstimatesModal';
import ExportModal from '../components/dialogs/ExportModal';

import { useUIStore } from '../stores/uiStore';
import { useProjectStore } from '../stores/projectStore';
import { apiService } from '../services/apiService';

export default function App() {
  const { activeView, setBackendHealth, setStatusMessage } = useUIStore();
  const { loadProject, projectId } = useProjectStore();
  const [initCompleted, setInitCompleted] = useState(false);

  // Initial startup hook: check backend and load initial project
  useEffect(() => {
    async function initApp() {
      setStatusMessage('Connecting to BuildCraft Studio Spring Boot backend...');
      try {
        const health = await apiService.checkHealth();
        if (health.status === 'UP') {
          setBackendHealth('UP');
          setStatusMessage('Connected to Spring Boot 3 Engine & SQLite DB.');

          // Load first available project from SQLite
          const projects = await apiService.getProjects();
          if (projects && projects.length > 0) {
            const firstProject = await apiService.getProject(projects[0].id);
            loadProject(firstProject);
            setStatusMessage(`Loaded active project: "${firstProject.name}".`);
          }
        } else {
          setBackendHealth('OFFLINE');
          setStatusMessage('Backend offline. Local memory workspace active.');
        }
      } catch (e) {
        console.warn('Initial backend connection note:', e);
        setBackendHealth('OFFLINE');
        setStatusMessage('Backend offline. Local memory workspace active.');
      } finally {
        setInitCompleted(true);
      }
    }

    initApp();
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0f1115] text-[#f1f5f9] select-none">
      {/* 1. Top Menu Bar */}
      <TopMenuBar />

      {/* 2. Quick Access Toolbar */}
      <QuickAccessToolbar />

      {/* 3. Central Engineering Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Engineering Tool Palette */}
        <CADToolbar />

        {/* Central Viewport Area (2D, 3D, or Split) */}
        <div className="flex-1 flex overflow-hidden relative">
          {activeView === '2D' && <CAD2DViewport />}

          {activeView === '3D' && <Model3DViewport />}

          {activeView === 'SPLIT' && (
            <div className="flex-1 flex w-full h-full">
              {/* 2D CAD Pane */}
              <div className="w-1/2 h-full border-r border-[#222a38] relative">
                <CAD2DViewport />
              </div>
              {/* 3D BIM Pane */}
              <div className="w-1/2 h-full relative">
                <Model3DViewport />
              </div>
            </div>
          )}
        </div>

        {/* Right Properties Inspector */}
        <PropertiesInspector />
      </div>

      {/* 4. Bottom AutoCAD-style Command Line */}
      <CommandLine />

      {/* 5. Bottom Status Bar */}
      <StatusBar />

      {/* Modals & Dialogs */}
      <ProjectDashboard />
      <NewProjectModal />
      <AIPlannerModal />
      <EstimatesModal />
      <ExportModal />
    </div>
  );
}
