import { create } from 'zustand';

export const useCADStore = create((set, get) => ({
  activeTool: 'SELECT',
  toolOptions: {
    wallThickness: 0.23,
    wallHeight: 3.0,
    wallType: 'EXTERIOR',
    doorWidth: 0.9,
    doorHeight: 2.1,
    doorType: 'SINGLE',
    windowWidth: 1.2,
    windowHeight: 1.2,
    windowElevation: 0.9,
    windowType: 'SLIDING',
    columnWidth: 0.3,
    columnDepth: 0.3,
    columnHeight: 3.0,
    dimensionOffset: 0.6
  },
  snapping: {
    isGridSnap: true,
    isObjectSnap: true,
    isOrtho: false,
    gridSpacing: 0.5
  },
  viewport: {
    pan: { x: 350, y: 300 },
    zoom: 45 // 45 pixels per meter
  },
  cursor: {
    worldX: 0.0,
    worldY: 0.0,
    screenX: 0,
    screenY: 0
  },
  snapIndicator: {
    active: false,
    point: { x: 0, y: 0 },
    type: 'NONE'
  },
  selectedElementId: null,
  selectedElementType: null,

  setActiveTool: (tool) => set({ activeTool: tool, selectedElementId: null }),

  setToolOption: (key, value) => set((s) => ({
    toolOptions: { ...s.toolOptions, [key]: value }
  })),

  toggleGridSnap: () => set((s) => ({
    snapping: { ...s.snapping, isGridSnap: !s.snapping.isGridSnap }
  })),

  toggleObjectSnap: () => set((s) => ({
    snapping: { ...s.snapping, isObjectSnap: !s.snapping.isObjectSnap }
  })),

  toggleOrtho: () => set((s) => ({
    snapping: { ...s.snapping, isOrtho: !s.snapping.isOrtho }
  })),

  setGridSpacing: (spacing) => set((s) => ({
    snapping: { ...s.snapping, gridSpacing: spacing }
  })),

  setPan: (pan) => set((s) => ({
    viewport: { ...s.viewport, pan }
  })),

  setZoom: (zoom) => set((s) => ({
    viewport: { ...s.viewport, zoom: Math.max(10, Math.min(300, zoom)) }
  })),

  zoomBy: (factor, centerScreenPoint) => set((s) => {
    const oldZoom = s.viewport.zoom;
    const newZoom = Math.max(10, Math.min(300, oldZoom * factor));
    if (newZoom === oldZoom) return s;

    // Zoom centered on cursor
    const center = centerScreenPoint || { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const worldX = (center.x - s.viewport.pan.x) / oldZoom;
    const worldY = (center.y - s.viewport.pan.y) / oldZoom;

    const newPan = {
      x: center.x - worldX * newZoom,
      y: center.y - worldY * newZoom
    };

    return {
      viewport: { pan: newPan, zoom: newZoom }
    };
  }),

  resetView: () => set({
    viewport: { pan: { x: 350, y: 300 }, zoom: 45 }
  }),

  setCursor: (worldX, worldY, screenX, screenY) => set({
    cursor: { worldX, worldY, screenX, screenY }
  }),

  setSnapIndicator: (active, point, type) => set({
    snapIndicator: { active, point: point || { x: 0, y: 0 }, type: type || 'NONE' }
  }),

  setSelectedElement: (id, type = null) => set({
    selectedElementId: id,
    selectedElementType: type
  })
}));
