import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Float, Center } from '@react-three/drei';
import * as THREE from 'three';
import {
  RotateCcw,
  Maximize2,
  Eye,
  Layers,
  Box,
  Zap,
  Info,
  Sparkles,
  Camera,
} from 'lucide-react';

// CPK Elemental Colors
const CPK_COLORS = {
  C: '#909090',
  N: '#3050F8', // Blue
  O: '#FF0D0D', // Red
  S: '#FFFF30', // Yellow
  P: '#FF8000', // Orange
  H: '#FFFFFF', // White
  F: '#90E050', // Light Green
  Cl: '#1FF01F', // Green
  Br: '#A62929', // Dark Red
  I: '#940094', // Purple
  Fe: '#E06633',
};

// Secondary Structure Colors for Ribbon
const SEC_STRUCT_COLORS = {
  helix: '#A33B26', // Terracotta
  sheet: '#A4773A', // Regal Gold
  loop: '#00E5FF',  // Cyan
};

/**
 * Single Atom Mesh with Hover Inspection
 */
function AtomSphere({ atom, renderMode, onHover, onClick, isSelected }) {
  const [hovered, setHovered] = useState(false);
  const color = CPK_COLORS[atom.element] || '#A0A0A0';
  const radius =
    renderMode === 'spacefill'
      ? (atom.element === 'C' ? 0.9 : 0.75)
      : (atom.element === 'C' ? 0.35 : 0.42);

  return (
    <mesh
      position={[atom.x, atom.y, atom.z]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover?.(atom);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        onHover?.(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(atom);
      }}
    >
      <sphereGeometry args={[radius, 16, 16]} />
      <meshStandardMaterial
        color={isSelected ? '#00E5FF' : hovered ? '#F59E0B' : color}
        roughness={0.25}
        metalness={0.3}
        emissive={isSelected ? '#00E5FF' : hovered ? '#F59E0B' : '#000000'}
        emissiveIntensity={isSelected ? 0.5 : hovered ? 0.4 : 0}
      />
    </mesh>
  );
}

/**
 * Molecular Bond Cylinder between two atoms
 */
function BondCylinder({ start, end, order = 1 }) {
  const p1 = new THREE.Vector3(start.x, start.y, start.z);
  const p2 = new THREE.Vector3(end.x, end.y, end.z);
  const distance = p1.distanceTo(p2);
  const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

  const orientation = new THREE.Matrix4();
  orientation.lookAt(p1, p2, new THREE.Vector3(0, 1, 0));
  const rotation = new THREE.Euler().setFromRotationMatrix(orientation);

  const radius = order === 2 ? 0.12 : 0.08;

  return (
    <mesh position={[midPoint.x, midPoint.y, midPoint.z]} rotation={rotation}>
      <cylinderGeometry args={[radius, radius, distance, 8]} />
      <meshStandardMaterial color="#64748B" roughness={0.4} metalness={0.2} />
    </mesh>
  );
}

/**
 * 3D Ribbon / Backbone Curve Trace for Protein Receptor
 */
function ProteinBackboneRibbon({ backbonePoints, renderMode }) {
  const curvePoints = useMemo(() => {
    if (!backbonePoints || backbonePoints.length < 2) return [];
    return backbonePoints.map((p) => new THREE.Vector3(p.x, p.y, p.z));
  }, [backbonePoints]);

  const curve = useMemo(() => {
    if (curvePoints.length < 2) return null;
    return new THREE.CatmullRomCurve3(curvePoints, false, 'centripetal', 0.5);
  }, [curvePoints]);

  if (!curve || renderMode === 'spacefill') return null;

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 120, 0.28, 8, false]} />
        <meshStandardMaterial
          color="#A4773A"
          roughness={0.35}
          metalness={0.3}
          wireframe={renderMode === 'wireframe'}
        />
      </mesh>

      {/* Secondary structure highlight beads */}
      {backbonePoints.map((pt, idx) => {
        if (idx % 4 !== 0) return null;
        const col = SEC_STRUCT_COLORS[pt.secStruct] || '#00E5FF';
        return (
          <mesh key={idx} position={[pt.x, pt.y, pt.z]}>
            <sphereGeometry args={[0.32, 12, 12]} />
            <meshStandardMaterial color={col} roughness={0.3} emissive={col} emissiveIntensity={0.2} />
          </mesh>
        );
      })}
    </group>
  );
}

/**
 * 3D Binding Interaction Contacts (Hydrogen bonds, Hydrophobic, Salt bridges)
 */
function BindingInteractionLines({ interactions, activePose }) {
  if (!interactions || interactions.length === 0) return null;

  return (
    <group>
      {interactions.map((contact, idx) => {
        // Find rough anchor coordinates for interaction line
        const isHBond = contact.type === 'hydrogen_bond';
        const isSaltBridge = contact.type === 'salt_bridge';
        const isPi = contact.type === 'pi_stacking';

        const color = isHBond ? '#00E5FF' : isSaltBridge ? '#F43F5E' : isPi ? '#A4773A' : '#F59E0B';

        const targetPos = new THREE.Vector3(22.5 + (idx % 3 - 1) * 1.5, 0.8 + (idx % 2 === 0 ? 1.4 : -1.4), 52.3 + (idx * 0.4));
        const ligandPos = new THREE.Vector3(22.5, 0.8, 52.3);

        const mid = new THREE.Vector3().addVectors(targetPos, ligandPos).multiplyScalar(0.5);
        const dist = targetPos.distanceTo(ligandPos);

        return (
          <group key={idx}>
            {/* 3D Contact Line */}
            <line>
              <bufferGeometry
                attach="geometry"
                onUpdate={(self) => {
                  self.setFromPoints([targetPos, ligandPos]);
                }}
              />
              <lineDashedMaterial
                attach="material"
                color={color}
                dashSize={0.4}
                gapSize={0.2}
                linewidth={2}
              />
            </line>

            {/* 3D Residue Billboard Label */}
            <Html position={[targetPos.x, targetPos.y + 0.6, targetPos.z]} center distanceFactor={15}>
              <div className="bg-reborn-darkest/90 border border-reborn-cyan/50 text-reborn-offwhite text-[10px] px-1.5 py-0.5 rounded shadow-glow whitespace-nowrap pointer-events-none flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></span>
                <span>{contact.residueName}{contact.residueSeq}</span>
                <span className="text-reborn-cyan font-bold">({contact.distance_angstrom || '2.8'}Å)</span>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

/**
 * Docking Grid Box Wireframe (Search space representation)
 */
function DockingSearchBox({ pocket, visible }) {
  if (!visible || !pocket) return null;

  const center = pocket.center || { x: 22.5, y: 0.8, z: 52.3 };
  const size = pocket.size || { x: 20.0, y: 20.0, z: 20.0 };

  return (
    <group position={[center.x, center.y, center.z]}>
      {/* Box wireframe cage */}
      <mesh>
        <boxGeometry args={[size.x, size.y, size.z]} />
        <meshBasicMaterial color="#00E5FF" wireframe opacity={0.35} transparent />
      </mesh>

      {/* Semi-transparent pocket volume envelope */}
      <mesh>
        <boxGeometry args={[size.x * 0.98, size.y * 0.98, size.z * 0.98]} />
        <meshStandardMaterial
          color="#A33B26"
          transparent
          opacity={0.06}
          roughness={0.8}
        />
      </mesh>

      {/* Axis crosshairs at pocket centroid */}
      <axesHelper args={[size.x * 0.35]} />

      <Html position={[0, size.y / 2 + 0.8, 0]} center distanceFactor={20}>
        <div className="bg-reborn-navy/90 border border-reborn-gold/60 text-reborn-gold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-mono font-bold shadow-glow-gold pointer-events-none">
          Docking Grid: {size.x}×{size.y}×{size.z} Å
        </div>
      </Html>
    </group>
  );
}

/**
 * Camera stage animator smoothly adapting camera pose based on active stage
 */
function CameraController({ currentStage, center, autoRotate }) {
  const controlsRef = useRef();

  useFrame(({ camera }) => {
    if (!controlsRef.current) return;

    // Target focal point is the binding pocket center
    const tx = center?.x || 22.5;
    const ty = center?.y || 0.8;
    const tz = center?.z || 52.3;

    controlsRef.current.target.lerp(new THREE.Vector3(tx, ty, tz), 0.05);

    // Calculate desired camera distance and angle per stage
    let targetDist = 32;
    let targetElev = 12;

    switch (currentStage) {
      case 1: // Project Setup - macro orbital
        targetDist = 42;
        targetElev = 16;
        break;
      case 2: // Protein Input - focus on receptor
        targetDist = 35;
        targetElev = 10;
        break;
      case 3: // Ligand Input - tight focus on ligand
        targetDist = 18;
        targetElev = 6;
        break;
      case 4: // Docking - grid box overview
        targetDist = 28;
        targetElev = 14;
        break;
      case 5: // Interaction - close-up on contact residues
        targetDist = 16;
        targetElev = 5;
        break;
      case 6: // ADMET & Ranking - medium overview
        targetDist = 26;
        targetElev = 10;
        break;
      case 7: // Validation - MD oscillation view
        targetDist = 24;
        targetElev = 8;
        break;
      case 8: // Reporting - beauty cinematic angle
        targetDist = 30;
        targetElev = 12;
        break;
      default:
        targetDist = 30;
        targetElev = 10;
    }

    const currentDist = camera.position.distanceTo(controlsRef.current.target);
    if (Math.abs(currentDist - targetDist) > 0.5) {
      const dir = new THREE.Vector3().subVectors(camera.position, controlsRef.current.target).normalize();
      const newPos = new THREE.Vector3().copy(controlsRef.current.target).add(dir.multiplyScalar(targetDist));
      newPos.y = THREE.MathUtils.lerp(camera.position.y, ty + targetElev, 0.05);
      camera.position.lerp(newPos, 0.05);
    }

    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      minDistance={6}
      maxDistance={80}
      autoRotate={autoRotate}
      autoRotateSpeed={1.2}
      makeDefault
    />
  );
}

/**
 * Main 3D Molecular Canvas Component
 */
export default function MolecularStage3D({
  target,
  ligands = [],
  activeLigandId,
  dockingRun,
  activePoseRank = 1,
  currentStage = 1,
  className = '',
}) {
  const [renderMode, setRenderMode] = useState('ribbon_stick'); // 'ribbon_stick', 'sticks', 'spacefill', 'wireframe'
  const [showGridBox, setShowGridBox] = useState(true);
  const [showContacts, setShowContacts] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [hoveredAtom, setHoveredAtom] = useState(null);
  const [selectedAtom, setSelectedAtom] = useState(null);
  const canvasContainerRef = useRef();

  const pocketCenter = target?.bindingPocket?.center || { x: 22.5, y: 0.8, z: 52.3 };

  // Select active ligand
  const activeLigand = useMemo(() => {
    if (activeLigandId) return ligands.find((l) => l._id === activeLigandId || l.id === activeLigandId);
    return ligands[0] || null;
  }, [ligands, activeLigandId]);

  // Active pose from docking run
  const activePose = useMemo(() => {
    if (!dockingRun?.poses || dockingRun.poses.length === 0) return null;
    return dockingRun.poses.find((p) => p.poseRank === activePoseRank) || dockingRun.poses[0];
  }, [dockingRun, activePoseRank]);

  // Target atoms and backbone
  const targetAtoms = target?.structureData?.atoms || [];
  const backbonePoints = target?.structureData?.backbonePoints || [];

  // Ligand atoms to render (from docking pose if available, else from conformer)
  const ligandAtoms = activePose?.atoms || activeLigand?.conformers?.[0]?.atoms || [];
  const ligandBonds = activePose?.bonds || activeLigand?.conformers?.[0]?.bonds || [];

  // Interactions for active pose
  const interactions = activePose?.interactions || [];

  return (
    <div
      ref={canvasContainerRef}
      className={`relative w-full h-full rounded-2xl overflow-hidden reborn-glass border border-reborn-border shadow-2xl flex flex-col ${className}`}
    >
      {/* 3D Viewport Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Badge: Molecular Information */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="reborn-glass px-3 py-1.5 rounded-xl border border-reborn-border flex items-center gap-2 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-reborn-cyan animate-pulse"></span>
            <span className="text-xs font-mono font-semibold text-reborn-offwhite">
              {target?.pdbId ? `PDB: ${target.pdbId}` : 'Target Receptor'}
            </span>
            <span className="text-reborn-border">|</span>
            <span className="text-xs font-mono text-reborn-gold font-medium truncate max-w-[140px]">
              {activeLigand?.name || 'Ligand Small Molecule'}
            </span>
            {activePose && (
              <span className="text-[10px] bg-reborn-maroon/60 text-reborn-offwhite px-1.5 py-0.5 rounded font-mono border border-reborn-terracotta/40">
                Mode #{activePose.poseRank} ({activePose.affinity_kcal_mol} kcal/mol)
              </span>
            )}
          </div>
        </div>

        {/* Right Controls: Render Styles, Toggles, Auto-rotate */}
        <div className="flex items-center gap-1.5 pointer-events-auto reborn-glass p-1.5 rounded-xl border border-reborn-border shadow-lg">
          {/* Render Mode Switcher */}
          <button
            onClick={() => {
              const modes = ['ribbon_stick', 'sticks', 'spacefill'];
              const next = modes[(modes.indexOf(renderMode) + 1) % modes.length];
              setRenderMode(next);
            }}
            title={`Toggle Render Style (Current: ${renderMode})`}
            className="p-1.5 rounded-lg text-reborn-offwhite/80 hover:text-white hover:bg-reborn-navy transition-all flex items-center gap-1 text-xs"
          >
            <Layers className="w-3.5 h-3.5 text-reborn-cyan" />
            <span className="hidden sm:inline capitalize">{renderMode.replace('_', ' + ')}</span>
          </button>

          {/* Docking Grid Toggle */}
          <button
            onClick={() => setShowGridBox(!showGridBox)}
            title="Toggle Docking Search Cage"
            className={`p-1.5 rounded-lg transition-all ${
              showGridBox ? 'bg-reborn-navy text-reborn-gold border border-reborn-gold/40' : 'text-reborn-offwhite/60 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
          </button>

          {/* Interaction Contacts Toggle */}
          <button
            onClick={() => setShowContacts(!showContacts)}
            title="Toggle Binding Interactions"
            className={`p-1.5 rounded-lg transition-all ${
              showContacts ? 'bg-reborn-navy text-reborn-cyan border border-reborn-cyan/40' : 'text-reborn-offwhite/60 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
          </button>

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title="Toggle Auto Rotation"
            className={`p-1.5 rounded-lg transition-all ${
              autoRotate ? 'bg-reborn-navy text-reborn-emerald border border-reborn-emerald/40' : 'text-reborn-offwhite/60 hover:text-white'
            }`}
          >
            <RotateCcw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Hover Inspection Callout Box (Bottom-Left) */}
      {hoveredAtom && (
        <div className="absolute bottom-4 left-4 z-20 reborn-glass px-3 py-2 rounded-xl border border-reborn-cyan/40 shadow-glow pointer-events-none font-mono text-xs max-w-xs animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between gap-3 text-reborn-cyan font-bold border-b border-reborn-border/50 pb-1 mb-1">
            <span>Atom: {hoveredAtom.name} ({hoveredAtom.element})</span>
            <span className="text-[10px] text-reborn-gold">{hoveredAtom.resName}{hoveredAtom.resSeq}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-2 text-[11px] text-reborn-offwhite/80">
            <span>B-Factor: {hoveredAtom.bFactor || '18.4'}</span>
            <span>Charge: {hoveredAtom.charge || '0.00'} e</span>
            <span className="col-span-2 text-[10px] text-reborn-offwhite/60">
              Pos: [{hoveredAtom.x.toFixed(1)}, {hoveredAtom.y.toFixed(1)}, {hoveredAtom.z.toFixed(1)}] Å
            </span>
          </div>
        </div>
      )}

      {/* Legend & 3D Stage Indicator (Bottom-Right) */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 pointer-events-none">
        <div className="reborn-glass px-3 py-1.5 rounded-xl border border-reborn-border/60 text-[11px] font-mono flex items-center gap-3 text-reborn-offwhite/70">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3050F8]"></span>
            <span>N</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF0D0D]"></span>
            <span>O</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#909090]"></span>
            <span>C</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-reborn-cyan"></span>
            <span>H-Bond</span>
          </div>
        </div>
      </div>

      {/* R3F Canvas */}
      <Canvas
        camera={{ position: [pocketCenter.x + 22, pocketCenter.y + 14, pocketCenter.z + 24], fov: 45 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* Cinematic Scientific Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[15, 25, 20]} intensity={1.2} />
        <directionalLight position={[-15, -10, -20]} intensity={0.6} color="#A4773A" />
        <pointLight position={[pocketCenter.x, pocketCenter.y + 10, pocketCenter.z]} intensity={0.8} color="#00E5FF" />

        {/* Dynamic Camera Choreography */}
        <CameraController currentStage={currentStage} center={pocketCenter} autoRotate={autoRotate} />

        {/* 1. Protein Receptor Backbone Cartoon / Ribbon */}
        <ProteinBackboneRibbon
          backbonePoints={backbonePoints}
          renderMode={renderMode}
        />

        {/* 2. Protein Active Site Residue Atoms */}
        <group>
          {targetAtoms.map((atom) => (
            <AtomSphere
              key={atom.id}
              atom={atom}
              renderMode={renderMode}
              onHover={setHoveredAtom}
              onClick={setSelectedAtom}
              isSelected={selectedAtom?.id === atom.id}
            />
          ))}
        </group>

        {/* 3. Small Molecule Ligand Atoms & Bonds */}
        <group>
          {ligandAtoms.map((atom) => (
            <AtomSphere
              key={`lig_${atom.id}`}
              atom={atom}
              renderMode={renderMode}
              onHover={setHoveredAtom}
              onClick={setSelectedAtom}
              isSelected={selectedAtom?.id === atom.id}
            />
          ))}

          {ligandBonds.map((bond, idx) => {
            const startAtom = ligandAtoms.find((a) => a.id === bond.source);
            const endAtom = ligandAtoms.find((a) => a.id === bond.target);
            if (!startAtom || !endAtom) return null;
            return (
              <BondCylinder
                key={`bond_${idx}`}
                start={startAtom}
                end={endAtom}
                order={bond.order || 1}
              />
            );
          })}
        </group>

        {/* 4. Binding Interactions (H-bonds, salt bridges, pi-stacking) */}
        {showContacts && (
          <BindingInteractionLines
            interactions={interactions}
            activePose={activePose}
          />
        )}

        {/* 5. Docking Box Cage */}
        <DockingSearchBox
          pocket={target?.bindingPocket}
          visible={showGridBox}
        />
      </Canvas>
    </div>
  );
}
