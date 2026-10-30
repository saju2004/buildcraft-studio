import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useProjectStore } from '../../stores/projectStore';
import { useCADStore } from '../../stores/cadStore';

export default function Building3DScene() {
  const { 
    plot, 
    levels, 
    walls, 
    doors, 
    windows, 
    columns, 
    furniture 
  } = useProjectStore();

  const { selectedElementId, setSelectedElement } = useCADStore();

  // Create level lookup for elevation
  const levelMap = useMemo(() => {
    const map = {};
    for (const lvl of levels) {
      map[lvl.id] = lvl;
    }
    return map;
  }, [levels]);

  // Compute 3D wall meshes
  const wallMeshes = useMemo(() => {
    return walls.map((w) => {
      const lvl = levelMap[w.levelId] || { elevation: 0.0, height: 3.0 };
      const dx = w.endX - w.startX;
      const dy = w.endY - w.startY;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      const thickness = w.thickness || 0.23;
      const height = w.height || lvl.height || 3.0;
      const midX = (w.startX + w.endX) / 2;
      const midZ = (w.startY + w.endY) / 2; // Y in 2D maps to Z in 3D Three.js
      const elevation = lvl.elevation || 0.0;

      return {
        id: w.id,
        wallType: w.wallType,
        position: [midX, elevation + height / 2, midZ],
        rotation: [0, -angle, 0],
        dimensions: [length, height, thickness],
        color: w.wallType === 'EXTERIOR' ? '#cbd5e1' : '#94a3b8',
        elevation
      };
    });
  }, [walls, levelMap]);

  // Compute 3D column meshes
  const columnMeshes = useMemo(() => {
    return columns.map((c) => {
      const lvl = levelMap[c.levelId] || { elevation: 0.0, height: 3.0 };
      const width = c.width || 0.3;
      const depth = c.depth || 0.3;
      const height = c.height || lvl.height || 3.0;
      const elevation = lvl.elevation || 0.0;

      return {
        id: c.id,
        position: [c.x, elevation + height / 2, c.y],
        dimensions: [width, height, depth],
        elevation
      };
    });
  }, [columns, levelMap]);

  // Compute floor slab for each level
  const slabs = useMemo(() => {
    return levels.map((lvl) => {
      // Find bounding box of walls on this level
      const levelWalls = walls.filter((w) => w.levelId === lvl.id);
      if (levelWalls.length === 0) {
        return {
          id: `slab-${lvl.id}`,
          position: [plot.width / 2, lvl.elevation, plot.length / 2],
          dimensions: [plot.width * 0.7, 0.2, plot.length * 0.7]
        };
      }

      let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
      for (const w of levelWalls) {
        minX = Math.min(minX, w.startX, w.endX);
        maxX = Math.max(maxX, w.startX, w.endX);
        minZ = Math.min(minZ, w.startY, w.endY);
        maxZ = Math.max(maxZ, w.startY, w.endY);
      }

      const padding = 0.3;
      const width = Math.max(2, (maxX - minX) + padding * 2);
      const depth = Math.max(2, (maxZ - minZ) + padding * 2);
      const cx = (minX + maxX) / 2;
      const cz = (minZ + maxZ) / 2;

      return {
        id: `slab-${lvl.id}`,
        position: [cx, lvl.elevation - 0.1, cz],
        dimensions: [width, 0.2, depth]
      };
    });
  }, [levels, walls, plot]);

  return (
    <group>
      {/* 1. Ground Plot Plane */}
      <mesh position={[plot.width / 2, -0.05, plot.length / 2]} receiveShadow>
        <boxGeometry args={[plot.width, 0.1, plot.length]} />
        <meshStandardMaterial color="#1a202c" roughness={0.9} />
      </mesh>

      {/* Setback border wireframe in 3D */}
      <gridHelper 
        args={[Math.max(plot.width, plot.length) * 1.5, 30, '#334155', '#1e293b']} 
        position={[plot.width / 2, 0.01, plot.length / 2]} 
      />

      {/* 2. Floor Slabs */}
      {slabs.map((s) => (
        <mesh key={s.id} position={s.position} receiveShadow castShadow>
          <boxGeometry args={s.dimensions} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>
      ))}

      {/* 3. 3D Extruded Walls */}
      {wallMeshes.map((w) => {
        const isSelected = w.id === selectedElementId;
        return (
          <mesh
            key={w.id}
            position={w.position}
            rotation={w.rotation}
            castShadow
            receiveShadow
            onClick={(e) => {
              e.stopPropagation();
              setSelectedElement(w.id, 'WALL');
            }}
          >
            <boxGeometry args={w.dimensions} />
            <meshStandardMaterial 
              color={isSelected ? '#38bdf8' : w.color} 
              roughness={0.6}
              metalness={0.1}
            />
          </mesh>
        );
      })}

      {/* 4. Structural Columns */}
      {columnMeshes.map((c) => {
        const isSelected = c.id === selectedElementId;
        return (
          <mesh
            key={c.id}
            position={c.position}
            castShadow
            receiveShadow
            onClick={(e) => {
              e.stopPropagation();
              setSelectedElement(c.id, 'COLUMN');
            }}
          >
            <boxGeometry args={c.dimensions} />
            <meshStandardMaterial 
              color={isSelected ? '#38bdf8' : '#f59e0b'} 
              roughness={0.5} 
            />
          </mesh>
        );
      })}

      {/* 5. 3D Furniture Objects */}
      {furniture.map((f) => (
        <group key={f.id} position={[f.x, 0.4, f.y]}>
          {f.type === 'SOFA' && (
            <mesh castShadow receiveShadow>
              <boxGeometry args={[f.width || 2.0, 0.7, f.depth || 0.9]} />
              <meshStandardMaterial color="#0284c7" roughness={0.8} />
            </mesh>
          )}
          {f.type === 'BED' && (
            <mesh castShadow receiveShadow>
              <boxGeometry args={[f.width || 1.8, 0.6, f.depth || 2.0]} />
              <meshStandardMaterial color="#ec4899" roughness={0.8} />
            </mesh>
          )}
          {f.type === 'TABLE' && (
            <mesh castShadow receiveShadow>
              <boxGeometry args={[f.width || 1.5, 0.75, f.depth || 0.9]} />
              <meshStandardMaterial color="#d97706" roughness={0.4} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}
