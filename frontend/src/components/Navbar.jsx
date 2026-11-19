import React from 'react';
import {
  Atom,
  RotateCcw,
  Download,
  Shield,
  Layers,
  Github,
  ChevronDown,
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
    <header className="sticky top-0 z-40 w-full h-14 reborn-glass border-b border-reborn-border/60 px-4 md:px-6 flex items-center justify-between">
      {/* Brand Identity - Minimal & Crisp */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-reborn-navy border border-reborn-cyan/30 flex items-center justify-center shadow-glow">
          <Atom className="w-4 h-4 text-reborn-cyan" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-reborn-offwhite via-reborn-gold to-reborn-cyan font-sans">
            REBORN
          </span>
          <span className="text-[10px] font-mono text-reborn-gold/70 hidden sm:inline">
            v1.0
          </span>
        </div>
      </div>

      {/* Center: Clean Campaign Selector Pill */}
      <div className="flex items-center">
        <div className="relative flex items-center bg-reborn-card/80 border border-reborn-border/70 rounded-lg px-2.5 py-1 text-xs font-mono text-reborn-offwhite hover:border-reborn-gold/50 transition-colors">
          <Layers className="w-3.5 h-3.5 text-reborn-gold mr-2 shrink-0" />
          <select
            value={currentProject?.id || currentProject?._id || ''}
            onChange={(e) => onSelectProject(e.target.value)}
            className="bg-transparent text-xs font-mono font-medium text-reborn-offwhite focus:outline-none cursor-pointer pr-5 appearance-none max-w-[260px] sm:max-w-[340px] truncate"
            title="Switch Active Discovery Campaign"
          >
            {projects.map((p) => (
              <option key={p.id || p._id} value={p.id || p._id} className="bg-reborn-darkest text-white">
                {p.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-reborn-offwhite/50 absolute right-2 pointer-events-none" />
        </div>
      </div>

      {/* Right Actions - Sleek & Uncluttered */}
      <div className="flex items-center gap-2">
        {/* Scientific Scope Modal Trigger */}
        <button
          onClick={onOpenDisclaimer}
          className="h-8 px-2.5 rounded-lg border border-reborn-border/70 hover:border-reborn-gold/60 text-xs font-mono text-reborn-offwhite/80 hover:text-white flex items-center gap-1.5 transition-all"
          title="Scientific Scope & Validation Notice"
        >
          <Shield className="w-3.5 h-3.5 text-reborn-gold" />
          <span className="hidden md:inline">Scope</span>
        </button>

        {/* Reset / Seed Demo Data */}
        <button
          onClick={onResetSeed}
          disabled={isSeeding}
          className="h-8 px-2.5 rounded-lg border border-reborn-border/70 hover:border-reborn-cyan/60 text-xs font-mono text-reborn-offwhite/80 hover:text-white flex items-center gap-1.5 transition-all disabled:opacity-50"
          title="Reset and reload benchmark dataset"
        >
          <RotateCcw className={`w-3.5 h-3.5 text-reborn-cyan ${isSeeding ? 'animate-spin' : ''}`} />
          <span className="hidden md:inline">{isSeeding ? 'Resetting...' : 'Reset'}</span>
        </button>

        {/* Primary Action: Export Dossier */}
        <button
          onClick={onExportReport}
          className="h-8 px-3 rounded-lg bg-gradient-to-r from-reborn-terracotta to-reborn-gold text-white font-medium text-xs flex items-center gap-1.5 shadow-sm hover:opacity-95 transition-opacity"
          title="Export Discovery Report Dossier"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>

        {/* GitHub Repository Link */}
        <a
          href="https://github.com/ManamiMayoki/reborn"
          target="_blank"
          rel="noopener noreferrer"
          className="h-8 w-8 rounded-lg border border-reborn-border/70 hover:border-reborn-offwhite/40 flex items-center justify-center text-reborn-offwhite/70 hover:text-white transition-colors"
          title="View Source on GitHub"
        >
          <Github className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
}
