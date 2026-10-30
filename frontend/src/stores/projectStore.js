import { create } from 'zustand';
import { commandManager } from '../engines/commands/commandManager';

export const useProjectStore = create((set, get) => ({
  projectId: null,
  name: 'Untitled Project',
  clientName: '',
  location: '',
  category: 'RESIDENTIAL',
  unitSystem: 'METRIC',
  lengthUnit: 'METERS',
  plot: {
    width: 15.0,
    length: 20.0,
    setbackFront: 3.0,
    setbackRear: 2.0,
    setbackLeft: 1.5,
    setbackRight: 1.5
  },
  levels: [
    { id: 'lvl-ground', name: 'Ground Floor', floorIndex: 0, elevation: 0.0, height: 3.0, slabThickness: 0.15 }
  ],
  activeLevelId: 'lvl-ground',
  layers: [
    { id: 'layer-arch', name: 'Architecture', color: '#60a5fa', visible: true, locked: false },
    { id: 'layer-struct', name: 'Structure', color: '#f59e0b', visible: true, locked: false },
    { id: 'layer-dim', name: 'Dimensions', color: '#34d399', visible: true, locked: false },
    { id: 'layer-furn', name: 'Furniture', color: '#a78bfa', visible: true, locked: false }
  ],
  walls: [],
  doors: [],
  windows: [],
  columns: [],
  rooms: [],
  dimensions: [],
  furniture: [],
  hasUnsavedChanges: false,
  lastSavedAt: null,

  // Load a full project payload
  loadProject: (projectData) => {
    let parsedScene = {};
    if (typeof projectData.projectDataJson === 'string') {
      try {
        parsedScene = JSON.parse(projectData.projectDataJson);
      } catch (e) {
        console.error('Failed to parse projectDataJson:', e);
      }
    } else if (typeof projectData.projectDataJson === 'object') {
      parsedScene = projectData.projectDataJson;
    }

    set({
      projectId: projectData.id || null,
      name: projectData.name || 'Untitled Project',
      clientName: projectData.clientName || '',
      location: projectData.location || '',
      category: projectData.category || 'RESIDENTIAL',
      unitSystem: projectData.unitSystem || 'METRIC',
      lengthUnit: projectData.lengthUnit || 'METERS',
      plot: parsedScene.plot || {
        width: projectData.plotWidth || 15.0,
        length: projectData.plotLength || 20.0,
        setbackFront: 3.0,
        setbackRear: 2.0,
        setbackLeft: 1.5,
        setbackRight: 1.5
      },
      levels: parsedScene.levels || [
        { id: 'lvl-ground', name: 'Ground Floor', floorIndex: 0, elevation: 0.0, height: 3.0, slabThickness: 0.15 }
      ],
      activeLevelId: parsedScene.activeLevelId || 'lvl-ground',
      layers: parsedScene.layers || [
        { id: 'layer-arch', name: 'Architecture', color: '#60a5fa', visible: true, locked: false },
        { id: 'layer-struct', name: 'Structure', color: '#f59e0b', visible: true, locked: false },
        { id: 'layer-dim', name: 'Dimensions', color: '#34d399', visible: true, locked: false },
        { id: 'layer-furn', name: 'Furniture', color: '#a78bfa', visible: true, locked: false }
      ],
      walls: parsedScene.walls || [],
      doors: parsedScene.doors || [],
      windows: parsedScene.windows || [],
      columns: parsedScene.columns || [],
      rooms: parsedScene.rooms || [],
      dimensions: parsedScene.dimensions || [],
      furniture: parsedScene.furniture || [],
      hasUnsavedChanges: false,
      lastSavedAt: projectData.updatedAt || new Date().toISOString()
    });

    commandManager.clear();
  },

  // Export full serialized JSON for backend or .bcs file
  serializeScene: () => {
    const state = get();
    return {
      plot: state.plot,
      levels: state.levels,
      activeLevelId: state.activeLevelId,
      layers: state.layers,
      walls: state.walls,
      doors: state.doors,
      windows: state.windows,
      columns: state.columns,
      rooms: state.rooms,
      dimensions: state.dimensions,
      furniture: state.furniture
    };
  },

  markSaved: () => set({ hasUnsavedChanges: false, lastSavedAt: new Date().toISOString() }),

  setActiveLevel: (levelId) => set({ activeLevelId: levelId }),

  addLevel: (level) => set((s) => ({
    levels: [...s.levels, level],
    hasUnsavedChanges: true
  })),

  // Wall operations with Undo/Redo
  addWall: (wall) => {
    const newWall = {
      ...wall,
      id: wall.id || `w-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      levelId: wall.levelId || get().activeLevelId
    };

    commandManager.execute({
      execute: () => {
        set((s) => ({ walls: [...s.walls, newWall], hasUnsavedChanges: true }));
      },
      undo: () => {
        set((s) => ({ walls: s.walls.filter((w) => w.id !== newWall.id), hasUnsavedChanges: true }));
      }
    });

    return newWall;
  },

  updateWall: (id, updates) => {
    const existing = get().walls.find((w) => w.id === id);
    if (!existing) return;

    commandManager.execute({
      execute: () => {
        set((s) => ({
          walls: s.walls.map((w) => (w.id === id ? { ...w, ...updates } : w)),
          hasUnsavedChanges: true
        }));
      },
      undo: () => {
        set((s) => ({
          walls: s.walls.map((w) => (w.id === id ? existing : w)),
          hasUnsavedChanges: true
        }));
      }
    });
  },

  deleteWall: (id) => {
    const existing = get().walls.find((w) => w.id === id);
    if (!existing) return;
    const relatedDoors = get().doors.filter((d) => d.wallId === id);
    const relatedWindows = get().windows.filter((win) => win.wallId === id);

    commandManager.execute({
      execute: () => {
        set((s) => ({
          walls: s.walls.filter((w) => w.id !== id),
          doors: s.doors.filter((d) => d.wallId !== id),
          windows: s.windows.filter((win) => win.wallId !== id),
          hasUnsavedChanges: true
        }));
      },
      undo: () => {
        set((s) => ({
          walls: [...s.walls, existing],
          doors: [...s.doors, ...relatedDoors],
          windows: [...s.windows, ...relatedWindows],
          hasUnsavedChanges: true
        }));
      }
    });
  },

  // Door operations
  addDoor: (door) => {
    const newDoor = {
      ...door,
      id: door.id || `d-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };
    commandManager.execute({
      execute: () => set((s) => ({ doors: [...s.doors, newDoor], hasUnsavedChanges: true })),
      undo: () => set((s) => ({ doors: s.doors.filter((d) => d.id !== newDoor.id), hasUnsavedChanges: true }))
    });
    return newDoor;
  },

  // Window operations
  addWindow: (win) => {
    const newWin = {
      ...win,
      id: win.id || `win-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };
    commandManager.execute({
      execute: () => set((s) => ({ windows: [...s.windows, newWin], hasUnsavedChanges: true })),
      undo: () => set((s) => ({ windows: s.windows.filter((w) => w.id !== newWin.id), hasUnsavedChanges: true }))
    });
    return newWin;
  },

  // Column operations
  addColumn: (col) => {
    const newCol = {
      ...col,
      id: col.id || `col-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      levelId: col.levelId || get().activeLevelId
    };
    commandManager.execute({
      execute: () => set((s) => ({ columns: [...s.columns, newCol], hasUnsavedChanges: true })),
      undo: () => set((s) => ({ columns: s.columns.filter((c) => c.id !== newCol.id), hasUnsavedChanges: true }))
    });
    return newCol;
  },

  // Dimension operations
  addDimension: (dim) => {
    const newDim = {
      ...dim,
      id: dim.id || `dim-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };
    commandManager.execute({
      execute: () => set((s) => ({ dimensions: [...s.dimensions, newDim], hasUnsavedChanges: true })),
      undo: () => set((s) => ({ dimensions: s.dimensions.filter((d) => d.id !== newDim.id), hasUnsavedChanges: true }))
    });
    return newDim;
  },

  // Room operations
  addRoom: (room) => {
    const newRoom = {
      ...room,
      id: room.id || `rm-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };
    commandManager.execute({
      execute: () => set((s) => ({ rooms: [...s.rooms, newRoom], hasUnsavedChanges: true })),
      undo: () => set((s) => ({ rooms: s.rooms.filter((r) => r.id !== newRoom.id), hasUnsavedChanges: true }))
    });
    return newRoom;
  },

  // Generic element deletion
  deleteElement: (id) => {
    const state = get();
    if (state.walls.some((w) => w.id === id)) {
      get().deleteWall(id);
    } else if (state.doors.some((d) => d.id === id)) {
      const existing = state.doors.find((d) => d.id === id);
      commandManager.execute({
        execute: () => set((s) => ({ doors: s.doors.filter((d) => d.id !== id), hasUnsavedChanges: true })),
        undo: () => set((s) => ({ doors: [...s.doors, existing], hasUnsavedChanges: true }))
      });
    } else if (state.windows.some((w) => w.id === id)) {
      const existing = state.windows.find((w) => w.id === id);
      commandManager.execute({
        execute: () => set((s) => ({ windows: s.windows.filter((w) => w.id !== id), hasUnsavedChanges: true })),
        undo: () => set((s) => ({ windows: [...s.windows, existing], hasUnsavedChanges: true }))
      });
    } else if (state.columns.some((c) => c.id === id)) {
      const existing = state.columns.find((c) => c.id === id);
      commandManager.execute({
        execute: () => set((s) => ({ columns: s.columns.filter((c) => c.id !== id), hasUnsavedChanges: true })),
        undo: () => set((s) => ({ columns: [...s.columns, existing], hasUnsavedChanges: true }))
      });
    } else if (state.dimensions.some((d) => d.id === id)) {
      const existing = state.dimensions.find((d) => d.id === id);
      commandManager.execute({
        execute: () => set((s) => ({ dimensions: s.dimensions.filter((d) => d.id !== id), hasUnsavedChanges: true })),
        undo: () => set((s) => ({ dimensions: [...s.dimensions, existing], hasUnsavedChanges: true }))
      });
    } else if (state.rooms.some((r) => r.id === id)) {
      const existing = state.rooms.find((r) => r.id === id);
      commandManager.execute({
        execute: () => set((s) => ({ rooms: s.rooms.filter((r) => r.id !== id), hasUnsavedChanges: true })),
        undo: () => set((s) => ({ rooms: [...s.rooms, existing], hasUnsavedChanges: true }))
      });
    }
  },

  // Layer management
  toggleLayerVisibility: (layerId) => set((s) => ({
    layers: s.layers.map((l) => (l.id === layerId ? { ...l, visible: !l.visible } : l))
  })),

  toggleLayerLock: (layerId) => set((s) => ({
    layers: s.layers.map((l) => (l.id === layerId ? { ...l, locked: !l.locked } : l))
  }))
}));
