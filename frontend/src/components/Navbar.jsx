import React from 'react';
import {
  Atom,
  RotateCcw,
  Download,
  AlertCircle,
  Github,
  GitBranch,
  Sparkles,
  Layers,
  ChevronRight,
  Shield,
} from 'lucide-react';

export default function Navbar({
  projects = [],
  currentProject,
  onSelectProject,
  onResetSeed,
  onOpenDisclaimer,
  onExportReport,
  isSeeding,
}) {
  return (
    <header className="sticky top-0 z-40 w-full h-16 reborn-glass border-b border-reborn-border/80 px-4 md:px-8 flex items-center justify-between">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-reborn-maroon via-reborn-terracotta to-reborn-gold shadow-glow-gold">
          <Atom className="w-6 h-6 text-reborn-offwhite animate-spin-slow" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-reborn-cyan animate-ping"></span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight font-sans text-transparent bg-clip-text bg-gradient-to-r from-reborn-offwhite via-reborn-gold to-reborn-cyan">
              REBORN
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-reborn-navy border border-reborn-gold/40 text-reborn-gold font-bold uppercase tracking-wider">
              MoleculeX v1.0
            </span>
          </div>
          <p className="text-[10px] font-mono text-reborn-offwhite/60 hidden sm:block">
            3D Computational Drug Discovery & Structural Workflow Platform
          </p>
        </div>
      </div>

      {/* Center: Project Selector & Branch status */}
      <div className="hidden lg:flex items-center gap-3">
        <div className="reborn-glass px-3 py-1.5 rounded-xl border border-reborn-border flex items-center gap-2">
          <span className="text-xs text-reborn-offwhite/60 font-mono">Campaign:</span>
          <select
            value={currentProject?.id || currentProject?._id || ''}
            onChange={(e) => onSelectProject(e.target.value)}
            className="bg-transparent text-xs font-mono font-medium text-reborn-gold focus:outline-none cursor-pointer"
          >
            {projects.map((p) => (
              <option key={p.id || p._id} value={p.id || p._id} className="bg-reborn-darkest text-white">
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-reborn-navy/80 border border-reborn-border text-[11px] font-mono text-reborn-emerald">
          <GitBranch className="w-3.5 h-3.5 text-reborn-emerald" />
          <span>branch: development</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Scientific Disclaimer Button */}
        <button
          onClick={onOpenDisclaimer}
          className="px-2.5 py-1.5 rounded-xl reborn-glass border border-reborn-border hover:border-reborn-gold/60 text-xs font-mono text-reborn-gold flex items-center gap-1.5 transition-all"
          title="Open Scientific Predictor Scope Notice"
        >
          <Shield className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Scientific Scope</span>
        </button>

        {/* Seed Demo Data Button */}
        <button
          onClick={onResetSeed}
          disabled={isSeeding}
          className="px-3 py-1.5 rounded-xl bg-reborn-navy border border-reborn-cyan/40 hover:border-reborn-cyan text-xs font-mono text-reborn-cyan flex items-center gap-1.5 transition-all shadow-glow hover:bg-reborn-cyan/10 disabled:opacity-50"
          title="Reset and reload benchmark drug discovery campaign"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isSeeding ? 'Seeding...' : 'Seed Benchmark'}</span>
        </button>

        {/* Export Report Button */}
        <button
          onClick={onExportReport}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-reborn-terracotta via-reborn-maroon to-reborn-gold text-white font-medium text-xs font-sans flex items-center gap-1.5 shadow-glow-gold hover:opacity-95 transition-opacity"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Dossier</span>
        </button>
      </div>
    </header>
  );
}
