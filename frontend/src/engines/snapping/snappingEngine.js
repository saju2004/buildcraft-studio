import { distance, applyOrtho } from '../geometry/transforms';

/**
 * Snapping Engine for 2D CAD
 * Detects Grid, Endpoint, Midpoint, and Orthogonal constraints.
 */
export function findSnapPoint({
  rawWorldPoint,
  elements = [],
  gridSpacing = 0.5,
  isGridSnapEnabled = true,
  isObjectSnapEnabled = true,
  isOrthoEnabled = false,
  originPoint = null,
  snapThresholdPixels = 12,
  zoom = 50
}) {
  let snapResult = {
    point: { ...rawWorldPoint },
    type: 'NONE',
    targetElementId: null
  };

  // Convert pixel threshold to world threshold based on zoom
  const worldThreshold = snapThresholdPixels / zoom;

  // 1. Orthogonal constraint if origin point is specified
  let constrainedPoint = { ...rawWorldPoint };
  if (isOrthoEnabled && originPoint) {
    constrainedPoint = applyOrtho(originPoint, rawWorldPoint);
    snapResult.point = constrainedPoint;
    snapResult.type = 'ORTHO';
  }

  // 2. Object snapping (Endpoint & Midpoint) - highest precision priority
  if (isObjectSnapEnabled && elements.length > 0) {
    let closestDist = Infinity;
    let closestSnap = null;

    for (const el of elements) {
      // Wall or Line endpoints
      if (el.startX !== undefined && el.startY !== undefined) {
        // Start point
        const pStart = { x: el.startX, y: el.startY };
        const dStart = distance(constrainedPoint, pStart);
        if (dStart < worldThreshold && dStart < closestDist) {
          closestDist = dStart;
          closestSnap = { point: pStart, type: 'ENDPOINT', targetElementId: el.id };
        }

        // End point
        const pEnd = { x: el.endX, y: el.endY };
        const dEnd = distance(constrainedPoint, pEnd);
        if (dEnd < worldThreshold && dEnd < closestDist) {
          closestDist = dEnd;
          closestSnap = { point: pEnd, type: 'ENDPOINT', targetElementId: el.id };
        }

        // Mid point
        const pMid = { x: (el.startX + el.endX) / 2, y: (el.startY + el.endY) / 2 };
        const dMid = distance(constrainedPoint, pMid);
        if (dMid < worldThreshold && dMid < closestDist) {
          closestDist = dMid;
          closestSnap = { point: pMid, type: 'MIDPOINT', targetElementId: el.id };
        }
      }

      // Column centers/corners
      if (el.x !== undefined && el.y !== undefined) {
        const pCenter = { x: el.x, y: el.y };
        const dCenter = distance(constrainedPoint, pCenter);
        if (dCenter < worldThreshold && dCenter < closestDist) {
          closestDist = dCenter;
          closestSnap = { point: pCenter, type: 'ENDPOINT', targetElementId: el.id };
        }
      }
    }

    if (closestSnap) {
      return closestSnap;
    }
  }

  // 3. Grid Snapping
  if (isGridSnapEnabled && gridSpacing > 0) {
    const gridX = Math.round(constrainedPoint.x / gridSpacing) * gridSpacing;
    const gridY = Math.round(constrainedPoint.y / gridSpacing) * gridSpacing;
    const pGrid = { x: gridX, y: gridY };

    return {
      point: pGrid,
      type: 'GRID',
      targetElementId: null
    };
  }

  return snapResult;
}
