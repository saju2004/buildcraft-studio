import { create } from 'zustand';

export const useUIStore = create((set, get) => ({
  activeView: '2D', // '2D' | '3D' | 'SPLIT'
  activeModule: 'ARCHITECTURE', // 'ARCHITECTURE' | 'CIVIL' | 'INTERIOR' | 'SITE' | 'ESTIMATES'
  isProjectDashboardOpen: false,
  isNewProjectModalOpen: false,
  isAIPlannerOpen: false,
  isEstimatesOpen: false,
  isExportOpen: false,
  isSettingsOpen: false,
  backendHealth: 'CHECKING',
  commandText: '',
  commandHistory: ['BuildCraft Studio v1.0.0 initialized.', 'Type HELP for command list or press tools on palette.'],
  statusMessage: 'BuildCraft Studio Ready',

  setActiveView: (view) => set({ activeView: view }),
  setActiveModule: (module) => set({ activeModule: module }),
  
  setProjectDashboardOpen: (open) => set({ isProjectDashboardOpen: open }),
  setNewProjectModalOpen: (open) => set({ isNewProjectModalOpen: open }),
  setAIPlannerOpen: (open) => set({ isAIPlannerOpen: open }),
  setEstimatesOpen: (open) => set({ isEstimatesOpen: open }),
  setExportOpen: (open) => set({ isExportOpen: open }),
  setSettingsOpen: (open) => set({ isSettingsOpen: open }),

  setBackendHealth: (health) => set({ backendHealth: health }),
  setStatusMessage: (msg) => set({ statusMessage: msg }),

  setCommandText: (text) => set({ commandText: text }),
  
  executeCommand: (cmdStr) => {
    const raw = (cmdStr || '').trim();
    if (!raw) return;

    const parts = raw.toUpperCase().split(' ');
    const command = parts[0];
    const args = parts.slice(1);

    const history = [...get().commandHistory, `> ${raw}`];

    switch (command) {
      case 'HELP':
        history.push('Available commands: WALL, DOOR, WIN, COL, ROOM, DIM, LINE, REC, PAN, SELECT, 2D, 3D, SPLIT, ZOOM, CLEAR, AI, ESTIMATE');
        break;
      case 'WALL':
        history.push('Wall tool activated. Click to start wall, click again to end.');
        break;
      case 'DOOR':
        history.push('Door tool activated. Click on any wall to place opening.');
        break;
      case 'WIN':
      case 'WINDOW':
        history.push('Window tool activated. Click on any wall to insert window.');
        break;
      case 'COL':
      case 'COLUMN':
        history.push('Column tool activated. Click to position structural column.');
        break;
      case 'DIM':
      case 'DIMENSION':
        history.push('Dimension tool activated. Click two points to measure.');
        break;
      case '2D':
        set({ activeView: '2D' });
        history.push('Switched to 2D CAD Viewport.');
        break;
      case '3D':
        set({ activeView: '3D' });
        history.push('Switched to 3D BIM Viewport.');
        break;
      case 'SPLIT':
        set({ activeView: 'SPLIT' });
        history.push('Switched to Synchronized Split View.');
        break;
      case 'AI':
        set({ isAIPlannerOpen: true });
        history.push('Opening AI Architect Planning Assistant...');
        break;
      case 'ESTIMATE':
      case 'BOQ':
        set({ isEstimatesOpen: true });
        history.push('Opening Cost Estimation & BOQ Takeoff Engine...');
        break;
      case 'CLEAR':
        set({ commandHistory: [] });
        return;
      default:
        history.push(`Unknown command "${command}". Type HELP for available commands.`);
        break;
    }

    set({ commandHistory: history, commandText: '' });
  }
}));
