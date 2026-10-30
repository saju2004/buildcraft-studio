/**
 * BuildCraft Studio - CAD Precision Transforms & Geometry Utilities
 * Implements strict separation between Screen pixels and Engineering World meters.
 */

export function worldToScreen(worldPoint, pan, zoom) {
  return {
    x: worldPoint.x * zoom + pan.x,
    y: worldPoint.y * zoom + pan.y
  };
}

export function screenToWorld(screenPoint, pan, zoom) {
  return {
    x: (screenPoint.x - pan.x) / zoom,
    y: (screenPoint.y - pan.y) / zoom
  };
}

export function distance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

export function angle(p1, p2) {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

/**
 * Snap point to nearest orthogonal axis if ortho mode is enabled
 */
export function applyOrtho(start, current) {
  const dx = Math.abs(current.x - start.x);
  const dy = Math.abs(current.y - start.y);
  if (dx > dy) {
    return { x: current.x, y: start.y };
  } else {
    return { x: start.x, y: current.y };
  }
}

/**
 * Format metric or imperial measurement for dimension rendering
 */
export function formatMeasurement(valueInMeters, unitSystem = 'METRIC', lengthUnit = 'METERS') {
  if (valueInMeters == null || isNaN(valueInMeters)) return '0.00 m';

  if (unitSystem === 'IMPERIAL') {
    const totalInches = valueInMeters * 39.3701;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}' - ${inches}"`;
  }

  if (lengthUnit === 'MILLIMETERS') {
    return `${Math.round(valueInMeters * 1000)} mm`;
  }

  return `${valueInMeters.toFixed(2)} m`;
}

/**
 * Calculates point projection on line segment
 */
export function projectPointOnSegment(point, start, end) {
  const l2 = Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2);
  if (l2 === 0) return { point: { ...start }, t: 0, distance: distance(point, start) };

  let t = ((point.x - start.x) * (end.x - start.x) + (point.y - start.y) * (end.y - start.y)) / l2;
  t = Math.max(0, Math.min(1, t));

  const proj = {
    x: start.x + t * (end.x - start.x),
    y: start.y + t * (end.y - start.y)
  };

  return {
    point: proj,
    t: t,
    distance: distance(point, proj)
  };
}
