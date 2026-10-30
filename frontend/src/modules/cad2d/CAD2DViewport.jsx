import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useCADStore } from '../../stores/cadStore';
import { useProjectStore } from '../../stores/projectStore';
import { useUIStore } from '../../stores/uiStore';
import { 
  screenToWorld, 
  worldToScreen, 
  distance, 
  formatMeasurement,
  projectPointOnSegment 
} from '../../engines/geometry/transforms';
import { findSnapPoint } from '../../engines/snapping/snappingEngine';

export default function CAD2DViewport() {
  const canvasRef = useRef(null);

  const { 
    activeTool, 
    toolOptions, 
    snapping, 
    viewport, 
    setPan, 
    zoomBy, 
    setCursor, 
    setSnapIndicator,
    selectedElementId,
    setSelectedElement
  } = useCADStore();

  const { 
    plot, 
    levels, 
    activeLevelId, 
    layers, 
    walls, 
    doors, 
    windows, 
    columns, 
    rooms, 
    dimensions,
    addWall,
    addDoor,
    addWindow,
    addColumn,
    addDimension,
    deleteElement
  } = useProjectStore();

  const { setStatusMessage } = useUIStore();

  // Drafting interactive state
  const [dragStart, setDragStart] = useState(null);
  const [currentWorldPoint, setCurrentWorldPoint] = useState(null);
  const [activeSnap, setActiveSnap] = useState(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState(null);

  // Compute active elements for current floor
  const activeWalls = walls.filter((w) => w.levelId === activeLevelId);
  const activeColumns = columns.filter((c) => c.levelId === activeLevelId);

  // Mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const centerPoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const factor = e.deltaY < 0 ? 1.15 : 0.87;
    zoomBy(factor, centerPoint);
  };

  // Mouse Move: Coordinate tracking and Snapping
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const screenPt = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    // Pan handling
    if (isPanning && panStart) {
      setPan({
        x: panStart.panX + (screenPt.x - panStart.startX),
        y: panStart.panY + (screenPt.y - panStart.startY)
      });
      return;
    }

    const rawWorld = screenToWorld(screenPt, viewport.pan, viewport.zoom);

    // Calculate Snapping
    const snapResult = findSnapPoint({
      rawWorldPoint: rawWorld,
      elements: [...activeWalls, ...activeColumns],
      gridSpacing: snapping.gridSpacing,
      isGridSnapEnabled: snapping.isGridSnap,
      isObjectSnapEnabled: snapping.isObjectSnap,
      isOrthoEnabled: snapping.isOrtho,
      originPoint: dragStart,
      zoom: viewport.zoom
    });

    const finalWorld = snapResult.point;
    setCurrentWorldPoint(finalWorld);
    setActiveSnap(snapResult);
    setCursor(finalWorld.x, finalWorld.y, screenPt.x, screenPt.y);
    setSnapIndicator(snapResult.type !== 'NONE', snapResult.point, snapResult.type);
  };

  // Mouse Down
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const screenPt = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    // Middle click or Space+click initiates Pan
    if (e.button === 1 || e.spaceKey || activeTool === 'PAN') {
      setIsPanning(true);
      setPanStart({ startX: screenPt.x, startY: screenPt.y, panX: viewport.pan.x, panY: viewport.pan.y });
      return;
    }

    if (e.button !== 0) return; // Only primary left-click for drawing

    const worldPt = activeSnap ? activeSnap.point : screenToWorld(screenPt, viewport.pan, viewport.zoom);

    // Tool Actions
    if (activeTool === 'SELECT') {
      // Find clicked element
      const clicked = findElementAt(worldPt);
      if (clicked) {
        setSelectedElement(clicked.id, clicked.type);
        setStatusMessage(`Selected ${clicked.type}: ${clicked.id}`);
      } else {
        setSelectedElement(null);
      }
    } else if (activeTool === 'ERASER') {
      const clicked = findElementAt(worldPt);
      if (clicked) {
        deleteElement(clicked.id);
        setStatusMessage(`Deleted ${clicked.type}`);
      }
    } else if (activeTool === 'WALL') {
      if (!dragStart) {
        setDragStart(worldPt);
        setStatusMessage('Click endpoint to finish wall segment');
      } else {
        // Commit Wall
        if (distance(dragStart, worldPt) > 0.2) {
          addWall({
            levelId: activeLevelId,
            startX: dragStart.x,
            startY: dragStart.y,
            endX: worldPt.x,
            endY: worldPt.y,
            thickness: toolOptions.wallThickness,
            height: toolOptions.wallHeight,
            wallType: toolOptions.wallType,
            material: 'BRICK',
            color: toolOptions.wallType === 'EXTERIOR' ? '#d97706' : '#94a3b8'
          });
          setStatusMessage('Wall created. Click next point or Esc to stop.');
          setDragStart(worldPt); // Continue chain
        }
      }
    } else if (activeTool === 'DOOR') {
      // Find nearest wall
      const nearest = findNearestWall(worldPt);
      if (nearest && nearest.distance < 0.6) {
        addDoor({
          wallId: nearest.wall.id,
          offset: nearest.projection.t * distance({ x: nearest.wall.startX, y: nearest.wall.startY }, { x: nearest.wall.endX, y: nearest.wall.endY }),
          width: toolOptions.doorWidth,
          height: toolOptions.doorHeight,
          type: toolOptions.doorType,
          flip: false
        });
        setStatusMessage('Door opening added to wall.');
      } else {
        setStatusMessage('Click closer to a wall to place door');
      }
    } else if (activeTool === 'WINDOW') {
      const nearest = findNearestWall(worldPt);
      if (nearest && nearest.distance < 0.6) {
        addWindow({
          wallId: nearest.wall.id,
          offset: nearest.projection.t * distance({ x: nearest.wall.startX, y: nearest.wall.startY }, { x: nearest.wall.endX, y: nearest.wall.endY }),
          width: toolOptions.windowWidth,
          height: toolOptions.windowHeight,
          elevation: toolOptions.windowElevation,
          type: toolOptions.windowType
        });
        setStatusMessage('Window opening added to wall.');
      } else {
        setStatusMessage('Click closer to a wall to place window');
      }
    } else if (activeTool === 'COLUMN') {
      addColumn({
        levelId: activeLevelId,
        x: worldPt.x,
        y: worldPt.y,
        width: toolOptions.columnWidth,
        depth: toolOptions.columnDepth,
        height: toolOptions.columnHeight
      });
      setStatusMessage('Structural column placed.');
    } else if (activeTool === 'DIMENSION') {
      if (!dragStart) {
        setDragStart(worldPt);
        setStatusMessage('Click second point for dimension');
      } else {
        const dist = distance(dragStart, worldPt);
        if (dist > 0.1) {
          addDimension({
            startX: dragStart.x,
            startY: dragStart.y,
            endX: worldPt.x,
            endY: worldPt.y,
            value: dist,
            text: formatMeasurement(dist)
          });
          setStatusMessage('Dimension placed.');
        }
        setDragStart(null);
      }
    }
  };

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
      setPanStart(null);
    }
  };

  // Escape key cancels active draft
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setDragStart(null);
        setSelectedElement(null);
        setStatusMessage('Draft cancelled. Ready.');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedElement, setStatusMessage]);

  // Spatial hit-testing
  const findElementAt = (point) => {
    const threshold = 0.4;
    // Check columns
    for (const c of activeColumns) {
      if (distance(point, { x: c.x, y: c.y }) < 0.5) {
        return { ...c, type: 'COLUMN' };
      }
    }
    // Check doors
    for (const d of doors) {
      const w = walls.find((wall) => wall.id === d.wallId);
      if (w) {
        const p1 = { x: w.startX, y: w.startY };
        const p2 = { x: w.endX, y: w.endY };
        const wallLen = distance(p1, p2);
        const t = d.offset / (wallLen || 1);
        const dp = { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) };
        if (distance(point, dp) < 0.6) return { ...d, type: 'DOOR' };
      }
    }
    // Check windows
    for (const win of windows) {
      const w = walls.find((wall) => wall.id === win.wallId);
      if (w) {
        const p1 = { x: w.startX, y: w.startY };
        const p2 = { x: w.endX, y: w.endY };
        const wallLen = distance(p1, p2);
        const t = win.offset / (wallLen || 1);
        const wp = { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) };
        if (distance(point, wp) < 0.6) return { ...win, type: 'WINDOW' };
      }
    }
    // Check walls
    for (const w of activeWalls) {
      const proj = projectPointOnSegment(point, { x: w.startX, y: w.startY }, { x: w.endX, y: w.endY });
      if (proj.distance < (w.thickness || 0.23) + 0.2) {
        return { ...w, type: 'WALL' };
      }
    }
    return null;
  };

  const findNearestWall = (point) => {
    let nearest = null;
    let minDist = Infinity;
    for (const w of activeWalls) {
      const proj = projectPointOnSegment(point, { x: w.startX, y: w.startY }, { x: w.endX, y: w.endY });
      if (proj.distance < minDist) {
        minDist = proj.distance;
        nearest = { wall: w, projection: proj, distance: proj.distance };
      }
    }
    return nearest;
  };

  // High-performance Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.parentElement.clientWidth;
    const height = canvas.parentElement.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);

    // 1. Clear background
    ctx.fillStyle = '#0f1217';
    ctx.fillRect(0, 0, width, height);

    const { pan, zoom } = viewport;

    // 2. Render CAD Grid
    renderGrid(ctx, width, height, pan, zoom, snapping.gridSpacing);

    // 3. Render Plot Boundary & Setbacks
    renderPlot(ctx, plot, pan, zoom);

    // 4. Render Rooms / Floor polygons
    renderRooms(ctx, rooms, pan, zoom);

    // 5. Render Walls
    renderWalls(ctx, activeWalls, doors, windows, selectedElementId, pan, zoom);

    // 6. Render Structural Columns
    renderColumns(ctx, activeColumns, selectedElementId, pan, zoom);

    // 7. Render Dimensions
    renderDimensions(ctx, dimensions, pan, zoom);

    // 8. Render Active Drafting Guide / Rubberband
    if (dragStart && currentWorldPoint) {
      renderDraftGuide(ctx, dragStart, currentWorldPoint, activeTool, toolOptions, pan, zoom);
    }

    // 9. Render Snap Indicator
    if (activeSnap && activeSnap.type !== 'NONE') {
      renderSnapIndicator(ctx, activeSnap, pan, zoom);
    }
  }, [
    viewport, 
    activeWalls, 
    activeColumns, 
    doors, 
    windows, 
    rooms, 
    dimensions, 
    plot, 
    selectedElementId, 
    dragStart, 
    currentWorldPoint, 
    activeSnap, 
    snapping.gridSpacing,
    activeTool,
    toolOptions
  ]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0f1217] cursor-crosshair-cad select-none">
      <canvas
        ref={canvasRef}
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="w-full h-full block"
      />

      {/* Coordinate HUD overlay */}
      <div className="absolute top-3 left-3 bg-[#141822]/90 backdrop-blur border border-[#232a3a] px-3 py-1.5 rounded-lg text-xs font-mono text-[#cbd5e1] shadow-lg pointer-events-none flex items-center space-x-3">
        <span className="text-[#38bdf8] font-bold">2D CAD</span>
        <span className="text-[#64748b]">|</span>
        <span>Scale: 1m = {Math.round(viewport.zoom)}px</span>
        <span className="text-[#64748b]">|</span>
        <span className="text-[#22c55e]">Tool: {activeTool}</span>
      </div>
    </div>
  );
}

// ---------------- Canvas Rendering Utilities ---------------- //

function renderGrid(ctx, width, height, pan, zoom, gridSpacing = 0.5) {
  const step = gridSpacing * zoom;
  if (step < 8) return; // Skip if too dense

  const startX = pan.x % step;
  const startY = pan.y % step;

  ctx.lineWidth = 1;

  // Minor Grid Lines
  ctx.strokeStyle = '#181e28';
  ctx.beginPath();
  for (let x = startX; x < width; x += step) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = startY; y < height; y += step) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();

  // Major Grid Lines (every 5 grid steps)
  const majorStep = step * 5;
  const majorStartX = pan.x % majorStep;
  const majorStartY = pan.y % majorStep;

  ctx.strokeStyle = '#222b3a';
  ctx.beginPath();
  for (let x = majorStartX; x < width; x += majorStep) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = majorStartY; y < height; y += majorStep) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();

  // World Origin Axis (0, 0)
  const origin = worldToScreen({ x: 0, y: 0 }, pan, zoom);
  ctx.lineWidth = 1.5;
  // X axis (Red)
  ctx.strokeStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(origin.x + 40, origin.y);
  ctx.stroke();

  // Y axis (Green)
  ctx.strokeStyle = '#22c55e';
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(origin.x, origin.y + 40);
  ctx.stroke();
}

function renderPlot(ctx, plot, pan, zoom) {
  if (!plot) return;
  const p0 = worldToScreen({ x: 0, y: 0 }, pan, zoom);
  const pw = plot.width * zoom;
  const pl = plot.length * zoom;

  // Plot Boundary
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(p0.x, p0.y, pw, pl);

  // Setbacks buildable area (dashed line)
  const sbFront = (plot.setbackFront || 3.0) * zoom;
  const sbRear = (plot.setbackRear || 2.0) * zoom;
  const sbLeft = (plot.setbackLeft || 1.5) * zoom;
  const sbRight = (plot.setbackRight || 1.5) * zoom;

  ctx.strokeStyle = '#f59e0b';
  ctx.setLineDash([4, 4]);
  ctx.strokeRect(p0.x + sbLeft, p0.y + sbFront, pw - sbLeft - sbRight, pl - sbFront - sbRear);
  ctx.setLineDash([]); // reset

  // Plot Dimension Labels
  ctx.fillStyle = '#64748b';
  ctx.font = '10px monospace';
  ctx.fillText(`PLOT: ${plot.width.toFixed(1)}m x ${plot.length.toFixed(1)}m`, p0.x + 8, p0.y - 8);
}

function renderRooms(ctx, rooms, pan, zoom) {
  if (!rooms) return;
  for (const r of rooms) {
    if (r.centerX !== undefined && r.centerY !== undefined) {
      const pos = worldToScreen({ x: r.centerX, y: r.centerY }, pan, zoom);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(r.name || 'Room', pos.x, pos.y);

      ctx.font = '10px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`${r.area ? r.area.toFixed(1) : '0'} m²`, pos.x, pos.y + 14);
    }
  }
}

function renderWalls(ctx, walls, doors, windows, selectedId, pan, zoom) {
  for (const w of walls) {
    const p1 = worldToScreen({ x: w.startX, y: w.startY }, pan, zoom);
    const p2 = worldToScreen({ x: w.endX, y: w.endY }, pan, zoom);
    const thickness = (w.thickness || 0.23) * zoom;
    const isSelected = w.id === selectedId;

    ctx.save();
    ctx.lineWidth = Math.max(3, thickness);
    ctx.lineCap = 'round';
    ctx.strokeStyle = isSelected ? '#38bdf8' : (w.wallType === 'EXTERIOR' ? '#d97706' : '#94a3b8');
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    // Wall Center line
    ctx.lineWidth = 1;
    ctx.strokeStyle = isSelected ? '#ffffff' : '#1e2430';
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.restore();

    // Render Doors on this wall
    const wallDoors = doors.filter((d) => d.wallId === w.id);
    for (const d of wallDoors) {
      renderDoorOnWall(ctx, w, d, p1, p2, zoom);
    }

    // Render Windows on this wall
    const wallWindows = windows.filter((win) => win.wallId === w.id);
    for (const win of wallWindows) {
      renderWindowOnWall(ctx, w, win, p1, p2, zoom);
    }
  }
}

function renderDoorOnWall(ctx, wall, door, p1, p2, zoom) {
  const wallLen = distance({ x: wall.startX, y: wall.startY }, { x: wall.endX, y: wall.endY });
  const t = door.offset / (wallLen || 1);
  const dx = p1.x + t * (p2.x - p1.x);
  const dy = p1.y + t * (p2.y - p1.y);
  const doorWidthPx = (door.width || 0.9) * zoom;

  // Door Opening Cutout
  ctx.save();
  ctx.fillStyle = '#0f1217';
  ctx.beginPath();
  ctx.arc(dx, dy, doorWidthPx * 0.5, 0, Math.PI * 2);
  ctx.fill();

  // Swing Arc
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(dx, dy, doorWidthPx, 0, Math.PI / 2);
  ctx.stroke();

  // Door leaf
  ctx.beginPath();
  ctx.moveTo(dx, dy);
  ctx.lineTo(dx + doorWidthPx, dy);
  ctx.stroke();
  ctx.restore();
}

function renderWindowOnWall(ctx, wall, win, p1, p2, zoom) {
  const wallLen = distance({ x: wall.startX, y: wall.startY }, { x: wall.endX, y: wall.endY });
  const t = win.offset / (wallLen || 1);
  const wx = p1.x + t * (p2.x - p1.x);
  const wy = p1.y + t * (p2.y - p1.y);
  const winWidthPx = (win.width || 1.2) * zoom;

  // Window frame & glass double line
  ctx.save();
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(wx - winWidthPx / 2, wy - 3, winWidthPx, 6);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  ctx.strokeRect(wx - winWidthPx / 2, wy - 3, winWidthPx, 6);
  ctx.restore();
}

function renderColumns(ctx, columns, selectedId, pan, zoom) {
  for (const c of columns) {
    const center = worldToScreen({ x: c.x, y: c.y }, pan, zoom);
    const w = (c.width || 0.3) * zoom;
    const d = (c.depth || 0.3) * zoom;
    const isSelected = c.id === selectedId;

    ctx.save();
    ctx.fillStyle = isSelected ? '#38bdf8' : '#f59e0b';
    ctx.fillRect(center.x - w / 2, center.y - d / 2, w, d);

    // Hatch cross
    ctx.strokeStyle = '#0f1217';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(center.x - w / 2, center.y - d / 2);
    ctx.lineTo(center.x + w / 2, center.y + d / 2);
    ctx.moveTo(center.x + w / 2, center.y - d / 2);
    ctx.lineTo(center.x - w / 2, center.y + d / 2);
    ctx.stroke();
    ctx.restore();
  }
}

function renderDimensions(ctx, dimensions, pan, zoom) {
  for (const d of dimensions) {
    const p1 = worldToScreen({ x: d.startX, y: d.startY }, pan, zoom);
    const p2 = worldToScreen({ x: d.endX, y: d.endY }, pan, zoom);

    ctx.save();
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 1.2;

    // Dimension line
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    // Witness ticks at endpoints
    const angleRad = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const perpAngle = angleRad + Math.PI / 2;
    const tickLen = 6;

    ctx.beginPath();
    ctx.moveTo(p1.x - Math.cos(perpAngle) * tickLen, p1.y - Math.sin(perpAngle) * tickLen);
    ctx.lineTo(p1.x + Math.cos(perpAngle) * tickLen, p1.y + Math.sin(perpAngle) * tickLen);
    ctx.moveTo(p2.x - Math.cos(perpAngle) * tickLen, p2.y - Math.sin(perpAngle) * tickLen);
    ctx.lineTo(p2.x + Math.cos(perpAngle) * tickLen, p2.y + Math.sin(perpAngle) * tickLen);
    ctx.stroke();

    // Text label
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    ctx.fillStyle = '#34d399';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(d.text || `${d.value.toFixed(2)} m`, midX, midY - 4);
    ctx.restore();
  }
}

function renderDraftGuide(ctx, start, current, tool, toolOptions, pan, zoom) {
  const p1 = worldToScreen(start, pan, zoom);
  const p2 = worldToScreen(current, pan, zoom);
  const dist = distance(start, current);

  ctx.save();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);

  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
  ctx.setLineDash([]);

  // Live distance tag
  const midX = (p1.x + p2.x) / 2;
  const midY = (p1.y + p2.y) / 2;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(midX - 30, midY - 14, 60, 18);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;
  ctx.strokeRect(midX - 30, midY - 14, 60, 18);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${dist.toFixed(2)} m`, midX, midY - 1);
  ctx.restore();
}

function renderSnapIndicator(ctx, snap, pan, zoom) {
  const pt = worldToScreen(snap.point, pan, zoom);
  ctx.save();
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 2;

  if (snap.type === 'ENDPOINT') {
    // Square icon
    ctx.strokeRect(pt.x - 5, pt.y - 5, 10, 10);
  } else if (snap.type === 'MIDPOINT') {
    // Triangle icon
    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y - 6);
    ctx.lineTo(pt.x + 6, pt.y + 5);
    ctx.lineTo(pt.x - 6, pt.y + 5);
    ctx.closePath();
    ctx.stroke();
  } else if (snap.type === 'GRID') {
    // Plus icon
    ctx.beginPath();
    ctx.moveTo(pt.x - 4, pt.y);
    ctx.lineTo(pt.x + 4, pt.y);
    ctx.moveTo(pt.x, pt.y - 4);
    ctx.lineTo(pt.x, pt.y + 4);
    ctx.stroke();
  }
  ctx.restore();
}
