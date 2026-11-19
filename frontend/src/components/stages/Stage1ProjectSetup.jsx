import React, { useState } from 'react';
import { Play, Sparkles, Sliders, Shield, BookOpen, Layers, CheckCircle } from 'lucide-react';

export default function Stage1ProjectSetup({ project, target, onNext, onUpdateProject }) {
  const [indication, setIndication] = useState(project?.diseaseIndication || 'Non-Small Cell Lung Cancer (NSCLC)');
  const [engine, setEngine] = useState(project?.settings?.dockingEngine || 'AutoDock Vina v1.2.5');
  const [forceField, setForceField] = useState(project?.settings?.forceField || 'Amber ff14SB / GAFF2');
  const [exhaustiveness, setExhaustiveness] = useState(project?.settings?.exhaustiveness || 16);

  const handleSaveAndAdvance = () => {
    onUpdateProject?.({
      diseaseIndication: indication,
      settings: {
        dockingEngine: engine,
        forceField,
        exhaustiveness: Number(exhaustiveness),
        randomSeed: 4242,
      },
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-reborn-gold uppercase tracking-wider">
          <span>Stage 01</span>
          <span>•</span>
          <span>Pipeline Initialization</span>
        </div>
        <h2 className="text-xl font-bold text-reborn-offwhite mt-1">
          Project Definition & Computational Parameters
        </h2>
        <p className="text-xs text-reborn-offwhite/70 mt-1 leading-relaxed">
          Configure the therapeutic indication, target macromolecule context, molecular mechanics force field, and simulation seeds for reproducible execution.
        </p>
      </div>

      {/* Campaign Details Card */}
      <div className="p-4 rounded-xl reborn-glass border border-reborn-border space-y-4">
        <h3 className="text-sm font-semibold text-reborn-offwhite flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-reborn-cyan" />
          <span>Therapeutic Campaign Scope</span>
        </h3>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-mono text-reborn-offwhite/70 block mb-1">
              Therapeutic Indication / Disease
            </label>
            <select
              value={indication}
              onChange={(e) => setIndication(e.target.value)}
              className="w-full bg-reborn-darkest border border-reborn-border rounded-lg px-3 py-2 text-xs text-reborn-offwhite font-mono focus:border-reborn-cyan focus:outline-none"
            >
              <option value="Non-Small Cell Lung Cancer (NSCLC)">
                Non-Small Cell Lung Cancer (NSCLC) - EGFR Kinase
              </option>
              <option value="COVID-19 / SARS-CoV-2 Antiviral">
                COVID-19 / SARS-CoV-2 Antiviral - Main Protease (Mpro)
              </option>
              <option value="Solid Tumors (KRAS G12C)">
                Colorectal & Lung Adenocarcinoma - KRAS G12C Switch II
              </option>
              <option value="Targeted Oncology - CDK4/6">
                Targeted Oncology - CDK4/6 Cyclin Dependent Kinase
              </option>
            </select>
          </div>

          <div>
            <label className="text-xs font-mono text-reborn-offwhite/70 block mb-1">
              Campaign Description & Objective
            </label>
            <p className="text-xs font-sans text-reborn-offwhite/80 bg-reborn-darkest/60 border border-reborn-border/60 p-2.5 rounded-lg leading-relaxed">
              {project?.description ||
                'Structure-based virtual screening and lead optimization targeting the catalytic ATP-binding pocket to discover potent, drug-like kinase inhibitors with optimized ADMET clearance.'}
            </p>
          </div>
        </div>
      </div>

      {/* Simulation Engine Parameters */}
      <div className="p-4 rounded-xl reborn-glass border border-reborn-border space-y-4">
        <h3 className="text-sm font-semibold text-reborn-offwhite flex items-center gap-2">
          <Sliders className="w-4 h-4 text-reborn-gold" />
          <span>Biophysical Simulation Engines</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-mono text-reborn-offwhite/70 block mb-1">
              Docking Scoring Function
            </label>
            <select
              value={engine}
              onChange={(e) => setEngine(e.target.value)}
              className="w-full bg-reborn-darkest border border-reborn-border rounded-lg px-3 py-2 text-xs text-reborn-offwhite font-mono focus:border-reborn-gold focus:outline-none"
            >
              <option value="AutoDock Vina v1.2.5">AutoDock Vina v1.2.5 (Empirical ΔG)</option>
              <option value="Vinardo Scoring Core">Vinardo Scoring Core (Refined contacts)</option>
              <option value="AD4 Scoring Engine">AD4 Forcefield (Zinc & metalloprotein)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-mono text-reborn-offwhite/70 block mb-1">
              Molecular Dynamics Force Field
            </label>
            <select
              value={forceField}
              onChange={(e) => setForceField(e.target.value)}
              className="w-full bg-reborn-darkest border border-reborn-border rounded-lg px-3 py-2 text-xs text-reborn-offwhite font-mono focus:border-reborn-gold focus:outline-none"
            >
              <option value="Amber ff14SB / GAFF2">Amber ff14SB & GAFF2 (Gold standard)</option>
              <option value="CHARMM36m">CHARMM36m (Protein & small molecule)</option>
              <option value="OPLS-AA/M">OPLS-AA/M (Refined torsion potentials)</option>
            </select>
          </div>
        </div>

        {/* Exhaustiveness Slider */}
        <div className="pt-2">
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-reborn-offwhite/70">Vina Exhaustiveness (Sampling Granularity):</span>
            <span className="text-reborn-cyan font-bold">{exhaustiveness} conformational modes</span>
          </div>
          <input
            type="range"
            min="8"
            max="64"
            step="8"
            value={exhaustiveness}
            onChange={(e) => setExhaustiveness(Number(e.target.value))}
            className="w-full accent-reborn-cyan h-1.5 bg-reborn-darkest rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-reborn-offwhite/50 mt-1">
            <span>8 (Fast screening)</span>
            <span>16 (Default standard)</span>
            <span>32 (Thorough)</span>
            <span>64 (Exhaustive)</span>
          </div>
        </div>
      </div>

      {/* Reproducibility Stamp */}
      <div className="p-3 rounded-xl bg-reborn-navy/60 border border-reborn-border flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-reborn-offwhite/70">
          <Shield className="w-4 h-4 text-reborn-emerald" />
          <span>Deterministic Random Seed:</span>
          <span className="text-reborn-emerald font-bold">4242</span>
        </div>
        <span className="text-[10px] text-reborn-offwhite/50">SHA-256 Provenance Active</span>
      </div>

      {/* Advance Action Button */}
      <button
        onClick={handleSaveAndAdvance}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-reborn-terracotta to-reborn-gold text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-glow hover:opacity-95 transition-all"
      >
        <span>Proceed to Protein Preparation</span>
        <Play className="w-4 h-4 fill-current" />
      </button>
    </div>
  );
}
