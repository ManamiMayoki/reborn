import React, { useState } from 'react';
import { Play, CheckCircle2, Sliders, Dna, Database, RefreshCw, Layers } from 'lucide-react';

export default function Stage2ProteinInput({ target, onNext, onPrepareTarget }) {
  const [pdbIdInput, setPdbIdInput] = useState(target?.pdbId || '1M17');
  const [isPrepping, setIsPrepping] = useState(false);
  const [protonation, setProtonation] = useState('pH 7.4 Physiological');
  const [chargeModel, setChargeModel] = useState('Gasteiger-Marsili / Kollman Hybrid');

  // Pocket coordinates
  const [boxCenter, setBoxCenter] = useState(target?.bindingPocket?.center || { x: 22.5, y: 0.8, z: 52.3 });
  const [boxSize, setBoxSize] = useState(target?.bindingPocket?.size || { x: 20.0, y: 20.0, z: 20.0 });

  const handleRunPreparation = async () => {
    setIsPrepping(true);
    try {
      await onPrepareTarget?.({
        protonationState: protonation,
        chargeModel,
        bindingPocket: {
          center: boxCenter,
          size: boxSize,
        },
      });
    } finally {
      setIsPrepping(false);
    }
  };

  const keyResidues = target?.bindingPocket?.keyResidues || [
    { name: 'Met', number: 793, chain: 'A', role: 'Hinge H-Bond Acceptor' },
    { name: 'Lys', number: 745, chain: 'A', role: 'Catalytic Salt Bridge' },
    { name: 'Thr', number: 790, chain: 'A', role: 'Gatekeeper Residue' },
    { name: 'Leu', number: 718, chain: 'A', role: 'Hydrophobic P-Loop' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-reborn-gold uppercase tracking-wider">
          <span>Stage 02</span>
          <span>•</span>
          <span>Receptor Ingestion & Prep</span>
        </div>
        <h2 className="text-xl font-bold text-reborn-offwhite mt-1">
          Macromolecule Structure & Binding Pocket
        </h2>
        <p className="text-xs text-reborn-offwhite/70 mt-1 leading-relaxed">
          Prepare the crystallographic receptor structure by adding polar hydrogens, assigning partial atomic charges, stripping crystallographic waters, and defining the catalytic search space.
        </p>
      </div>

      {/* Target Identity & PDB card */}
      <div className="p-4 rounded-xl reborn-glass border border-reborn-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dna className="w-4 h-4 text-reborn-cyan" />
            <span className="text-sm font-semibold text-reborn-offwhite">
              {target?.name || 'Receptor Structure'}
            </span>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-reborn-navy text-reborn-cyan border border-reborn-cyan/30">
            PDB ID: {target?.pdbId || pdbIdInput}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 text-center">
          <div className="p-2 rounded-lg bg-reborn-darkest/70 border border-reborn-border/60">
            <div className="text-[10px] font-mono text-reborn-offwhite/60">Resolution</div>
            <div className="text-xs font-mono font-bold text-reborn-gold">{target?.resolution || 2.6} Å</div>
          </div>
          <div className="p-2 rounded-lg bg-reborn-darkest/70 border border-reborn-border/60">
            <div className="text-[10px] font-mono text-reborn-offwhite/60">Residues</div>
            <div className="text-xs font-mono font-bold text-reborn-cyan">{target?.structureData?.residueCount || 140}</div>
          </div>
          <div className="p-2 rounded-lg bg-reborn-darkest/70 border border-reborn-border/60">
            <div className="text-[10px] font-mono text-reborn-offwhite/60">Atoms</div>
            <div className="text-xs font-mono font-bold text-reborn-emerald">{target?.structureData?.atomCount || 420}</div>
          </div>
        </div>
      </div>

      {/* Protein Preparation Checklist */}
      <div className="p-4 rounded-xl reborn-glass border border-reborn-border space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-reborn-offwhite flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-reborn-emerald" />
            <span>Preparation Pipeline Checklist</span>
          </h3>
          <span className="text-[10px] font-mono text-reborn-emerald font-bold">100% Prepared</span>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between p-2 rounded-lg bg-reborn-darkest/60 border border-reborn-border/40">
            <span className="text-reborn-offwhite/80">Missing Atoms & Sidechains</span>
            <span className="text-reborn-emerald flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Rebuilt
            </span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-reborn-darkest/60 border border-reborn-border/40">
            <span className="text-reborn-offwhite/80">Polar Hydrogens Added</span>
            <span className="text-reborn-emerald flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> pH 7.4
            </span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-reborn-darkest/60 border border-reborn-border/40">
            <span className="text-reborn-offwhite/80">Kollman Partial Charges</span>
            <span className="text-reborn-emerald flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Assigned
            </span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-reborn-darkest/60 border border-reborn-border/40">
            <span className="text-reborn-offwhite/80">Non-Cofactor Solvent Waters</span>
            <span className="text-reborn-emerald flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Stripped
            </span>
          </div>
        </div>
      </div>

      {/* Binding Pocket Grid Calibration */}
      <div className="p-4 rounded-xl reborn-glass border border-reborn-border space-y-3">
        <h3 className="text-sm font-semibold text-reborn-offwhite flex items-center gap-2">
          <Sliders className="w-4 h-4 text-reborn-gold" />
          <span>Active Site Pocket Calibration</span>
        </h3>

        <div className="space-y-3 text-xs font-mono">
          <div>
            <div className="flex justify-between text-reborn-offwhite/70 mb-1">
              <span>Grid Center Coordinates [X, Y, Z]:</span>
              <span className="text-reborn-gold">
                [{boxCenter.x.toFixed(1)}, {boxCenter.y.toFixed(1)}, {boxCenter.z.toFixed(1)}] Å
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                step="0.5"
                value={boxCenter.x}
                onChange={(e) => setBoxCenter({ ...boxCenter, x: Number(e.target.value) })}
                className="bg-reborn-darkest border border-reborn-border rounded px-2 py-1 text-center text-reborn-offwhite"
              />
              <input
                type="number"
                step="0.5"
                value={boxCenter.y}
                onChange={(e) => setBoxCenter({ ...boxCenter, y: Number(e.target.value) })}
                className="bg-reborn-darkest border border-reborn-border rounded px-2 py-1 text-center text-reborn-offwhite"
              />
              <input
                type="number"
                step="0.5"
                value={boxCenter.z}
                onChange={(e) => setBoxCenter({ ...boxCenter, z: Number(e.target.value) })}
                className="bg-reborn-darkest border border-reborn-border rounded px-2 py-1 text-center text-reborn-offwhite"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-reborn-offwhite/70 mb-1">
              <span>Search Box Dimensions [ΔX, ΔY, ΔZ]:</span>
              <span className="text-reborn-cyan font-bold">
                {boxSize.x} × {boxSize.y} × {boxSize.z} Å
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                min="10"
                max="40"
                value={boxSize.x}
                onChange={(e) => setBoxSize({ ...boxSize, x: Number(e.target.value) })}
                className="bg-reborn-darkest border border-reborn-border rounded px-2 py-1 text-center text-reborn-cyan"
              />
              <input
                type="number"
                min="10"
                max="40"
                value={boxSize.y}
                onChange={(e) => setBoxSize({ ...boxSize, y: Number(e.target.value) })}
                className="bg-reborn-darkest border border-reborn-border rounded px-2 py-1 text-center text-reborn-cyan"
              />
              <input
                type="number"
                min="10"
                max="40"
                value={boxSize.z}
                onChange={(e) => setBoxSize({ ...boxSize, z: Number(e.target.value) })}
                className="bg-reborn-darkest border border-reborn-border rounded px-2 py-1 text-center text-reborn-cyan"
              />
            </div>
          </div>
        </div>

        {/* Pocket Residues List */}
        <div className="pt-2">
          <label className="text-[10px] font-mono text-reborn-offwhite/60 block mb-1.5 uppercase">
            Identified Catalytic Pocket Residues
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {keyResidues.map((res, i) => (
              <div
                key={i}
                className="p-1.5 rounded bg-reborn-darkest/70 border border-reborn-border/60 text-[11px] font-mono flex items-center justify-between"
              >
                <span className="text-reborn-gold font-bold">
                  {res.name}{res.number} ({res.chain})
                </span>
                <span className="text-[9px] text-reborn-offwhite/60 truncate max-w-[90px]">{res.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advance Action Button */}
      <button
        onClick={onNext}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-reborn-terracotta to-reborn-gold text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-glow hover:opacity-95 transition-all"
      >
        <span>Proceed to Ligand Input & Conformers</span>
        <Play className="w-4 h-4 fill-current" />
      </button>
    </div>
  );
}
