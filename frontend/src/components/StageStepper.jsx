import React from 'react';
import {
  FileText,
  Dna,
  Share2,
  Box,
  Zap,
  Activity,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const STAGES_CONFIG = [
  { id: 1, name: 'Project Setup', icon: FileText, label: '01. Setup' },
  { id: 2, name: 'Protein Input', icon: Dna, label: '02. Receptor' },
  { id: 3, name: 'Ligand Input', icon: Share2, label: '03. Ligands' },
  { id: 4, name: 'Docking', icon: Box, label: '04. Docking' },
  { id: 5, name: 'Interactions', icon: Zap, label: '05. Contacts' },
  { id: 6, name: 'ADMET & Ranking', icon: Activity, label: '06. ADMET' },
  { id: 7, name: 'Validation', icon: TrendingUp, label: '07. Dynamics' },
  { id: 8, name: 'Reporting', icon: CheckCircle2, label: '08. Report' },
];

export default function StageStepper({ currentStage, onSelectStage, workflow }) {
  const stagesData = workflow?.stages || [];

  return (
    <nav aria-label="Workflow Stages" className="w-full reborn-glass border-b border-reborn-border/60 py-2.5 px-4 md:px-8 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[760px] gap-1">
        {STAGES_CONFIG.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = currentStage === stage.id;
          const isPast = currentStage > stage.id;
          const stageRecord = stagesData.find((s) => s.stageNumber === stage.id);
          const isCompleted = stageRecord?.status === 'completed' || isPast;

          return (
            <React.Fragment key={stage.id}>
              <button
                onClick={() => onSelectStage(stage.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 select-none group relative ${
                  isActive
                    ? 'bg-reborn-navy border border-reborn-cyan text-white shadow-glow'
                    : isCompleted
                    ? 'hover:bg-reborn-navy/60 text-reborn-offwhite/85'
                    : 'text-reborn-offwhite/40 hover:text-reborn-offwhite/70'
                }`}
              >
                {/* Circle Icon Badge */}
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-reborn-cyan text-reborn-darkest font-bold'
                      : isCompleted
                      ? 'bg-reborn-emerald/20 text-reborn-emerald border border-reborn-emerald/40'
                      : 'bg-reborn-darkest border border-reborn-border text-reborn-offwhite/50 group-hover:border-reborn-gold/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>

                {/* Stage Label */}
                <div className="text-left">
                  <div className="text-[10px] font-mono leading-none text-reborn-gold">
                    {stage.label}
                  </div>
                  <div
                    className={`text-xs font-semibold leading-tight whitespace-nowrap mt-0.5 ${
                      isActive ? 'text-reborn-cyan' : isCompleted ? 'text-reborn-offwhite' : 'text-reborn-offwhite/60'
                    }`}
                  >
                    {stage.name}
                  </div>
                </div>

                {/* Active Indicator Pip */}
                {isActive && (
                  <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-reborn-cyan rounded-full shadow-glow"></span>
                )}
              </button>

              {/* Separator chevron */}
              {idx < STAGES_CONFIG.length - 1 && (
                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isPast ? 'text-reborn-emerald/60' : 'text-reborn-border'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}
