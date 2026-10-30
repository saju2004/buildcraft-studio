import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Building3DScene from './Building3DScene';
import { useProjectStore } from '../../stores/projectStore';
import { 
  Eye, 
  RotateCw, 
  Compass, 
  Sun, 
  Layers 
} from 'lucide-react';

export default function Model3DViewport() {
  const { plot } = useProjectStore();
  const controlsRef = useRef();

  const [cameraPreset, setCameraPreset] = useState('ISOMETRIC');

  const setViewPreset = (preset) => {
    setCameraPreset(preset);
    if (!controlsRef.current) return;

    const cx = plot.width / 2;
    const cz = plot.length / 2;
    controlsRef.current.target.set(cx, 1.5, cz);

    if (preset === 'ISOMETRIC') {
      controlsRef.current.object.position.set(cx + 20, 18, cz + 22);
    } else if (preset === 'TOP') {
      controlsRef.current.object.position.set(cx, 35, cz + 0.01);
    } else if (preset === 'FRONT') {
      controlsRef.current.object.position.set(cx, 4, cz + 25);
    } else if (preset === 'RIGHT') {
      controlsRef.current.object.position.set(cx + 25, 4, cz);
    }
    controlsRef.current.update();
  };

  return (
    <div className="relative w-full h-full bg-[#0a0c10] select-none overflow-hidden">
      <Canvas shadows>
        {/* Camera */}
        <PerspectiveCamera 
          makeDefault 
          position={[plot.width + 12, 16, plot.length + 15]} 
          fov={45} 
        />

        {/* Orbit, Pan, and Zoom Controls */}
        <OrbitControls 
          ref={controlsRef}
          makeDefault 
          target={[plot.width / 2, 1.5, plot.length / 2]}
          enableDamping 
          dampingFactor={0.08}
          maxPolarAngle={Math.PI / 2 - 0.02} // Don't flip below ground
          minDistance={3}
          maxDistance={120}
        />

        {/* Lighting */}
        <ambientLight intensity={0.65} />
        <directionalLight 
          position={[30, 45, 20]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={150}
          shadow-camera-left={-25}
          shadow-camera-right={25}
          shadow-camera-top={25}
          shadow-camera-bottom={-25}
        />
        <directionalLight position={[-20, 15, -15]} intensity={0.3} />

        {/* 3D Building Scene */}
        <Building3DScene />
      </Canvas>

      {/* Floating HUD: Camera Angle Presets */}
      <div className="absolute top-3 left-3 bg-[#141822]/90 backdrop-blur border border-[#232a3a] px-3 py-1.5 rounded-lg text-xs font-mono text-[#cbd5e1] shadow-lg flex items-center space-x-3">
        <span className="text-[#38bdf8] font-bold">3D BIM</span>
        <span className="text-[#64748b]">|</span>
        <span className="text-[#94a3b8]">Orbit: Left Click + Drag | Pan: Right Click</span>
      </div>

      {/* Camera View Switcher Buttons */}
      <div className="absolute top-3 right-3 bg-[#141822]/90 backdrop-blur border border-[#232a3a] p-1 rounded-lg text-xs flex items-center space-x-1 shadow-lg">
        {['ISOMETRIC', 'TOP', 'FRONT', 'RIGHT'].map((preset) => (
          <button
            key={preset}
            onClick={() => setViewPreset(preset)}
            className={`px-2 py-1 rounded text-[11px] font-mono transition-all ${
              cameraPreset === preset 
                ? 'bg-[#2563eb] text-white shadow-sm' 
                : 'text-[#94a3b8] hover:bg-[#1e2430] hover:text-white'
            }`}
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
}
