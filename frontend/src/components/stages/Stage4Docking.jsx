import React, { useState } from 'react';
import { Play, RotateCcw, Box, CheckCircle2, ChevronRight, Zap, Award, Sparkles } from 'lucide-react';

export default function Stage4Docking({
  dockingRun,
  activePoseRank,
  onSelectPose,
  onRunDocking,
  onNext,
  target,
  activeLigand,
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [dockingStep, setDockingStep] = useState(0); // 0 = idle, 1 = receptor grid, 2 = torsion sampling, 3 = monte carlo, 4 = clustering, 5 = done
  const [exhaustiveness, setExhaustiveness] = useState(dockingRun?.exhaustiveness || 16);

  const poses = dockingRun?.poses || [];

  const handleStartDocking = async () => {
    setIsRunning(true);
    setDockingStep(1);

    // Multi-stage simulated execution animation
    setTimeout(() => setDockingStep(2), 600);
    setTimeout(() => setDockingStep(3), 1200);
    setTimeout(() => setDockingStep(4), 1800);

    setTimeout(async () => {
      try {
        await onRunDocking?.({
          exhaustiveness,
          searchBox: target?.bindingPocket,
        });
        setDockingStep(5);
      } finally {
        setIsRunning(false);
      }
    }, 2400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-reborn-gold uppercase tracking-wider">
          <span>Stage 04</span>
          <span>•</span>
          <span>Molecular Docking Engine</span>
        </div>
        <h2 className="text-xl font-bold text-reborn-offwhite mt-1">
          AutoDock Vina Conformational Sampling
        </h2>
        <p className="text-xs text-reborn-offwhite/70 mt-1 leading-relaxed">
          Execute simulated AutoDock Vina physics-based docking inside the calibrated active site grid. Iterates Monte Carlo global search over flexible ligand torsions to rank conformational binding modes by free energy ($\Delta G$).
        </p>
      </div>

      {/* Docking Execution Control Bar */}
      <div className="p-4 rounded-xl reborn-glass border border-reborn-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-reborn-cyan" />
            <span className="text-sm font-semibold text-reborn-offwhite">
              Vina Grid Search Engine
            </span>
          </div>
          <span className="text-xs font-mono text-reborn-gold">
            Exhaustiveness: {exhaustiveness}
          </span>
        </div>

        {/* Live Simulation Progress Steps */}
        {isRunning && (
          <div className="p-3 rounded-xl bg-reborn-darkest/90 border border-reborn-cyan/40 space-y-2 animate-in fade-in font-mono text-xs">
            <div className="flex items-center justify-between text-reborn-cyan">
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Simulating Docking Pipeline...</span>
              </span>
              <span>Step {dockingStep} of 4</span>
            </div>
            <div className="w-full bg-reborn-navy h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-reborn-cyan via-reborn-gold to-reborn-emerald h-full transition-all duration-300"
                style={{ width: `${(dockingStep / 4) * 100}%` }}
              ></div>
            </div>
            <div className="text-[11px] text-reborn-offwhite/70">
              {dockingStep === 1 && 'Ingesting receptor rigid grid affinity maps...'}
              {dockingStep === 2 && 'Sampling rotatable bond torsions & conformer space...'}
              {dockingStep === 3 && 'Iterating Monte Carlo global energy minimization...'}
              {dockingStep === 4 && 'Clustering binding poses & scoring free energies (ΔG)...'}
            </div>
          </div>
        )}

        <button
          onClick={handleStartDocking}
          disabled={isRunning}
          className="w-full py-2.5 rounded-xl bg-reborn-navy border border-reborn-cyan text-reborn-cyan hover:bg-reborn-cyan hover:text-reborn-darkest font-mono text-xs font-bold transition-all shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Executing Docking Simulation...' : 'Re-Run AutoDock Vina Simulation'}</span>
        </button>
      </div>

      {/* Docking Poses Ranking Table */}
      <div className="p-4 rounded-xl reborn-glass border border-reborn-border space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-reborn-offwhite flex items-center gap-2">
            <Award className="w-4 h-4 text-reborn-gold" />
            <span>Ranked Binding Poses (Conformational Modes)</span>
          </h3>
          <span className="text-[10px] font-mono text-reborn-offwhite/50">
            Click mode to preview in 3D
          </span>
        </div>

        <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
          {poses.map((pose) => {
            const isSelected = pose.poseRank === activePoseRank;
            return (
              <div
                key={pose.poseRank}
                onClick={() => onSelectPose?.(pose.poseRank)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between font-mono text-xs select-none ${
                  isSelected
                    ? 'bg-reborn-navy border-reborn-cyan shadow-glow text-white'
                    : 'bg-reborn-darkest/60 border-reborn-border/60 hover:border-reborn-border text-reborn-offwhite/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                      pose.poseRank === 1
                        ? 'bg-reborn-gold text-reborn-darkest'
                        : isSelected
                        ? 'bg-reborn-cyan text-reborn-darkest'
                        : 'bg-reborn-navy text-reborn-offwhite/70'
                    }`}
                  >
                    #{pose.poseRank}
                  </div>
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      <span className="text-reborn-offwhite">Mode {pose.poseRank}</span>
                      {pose.poseRank === 1 && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-reborn-gold/20 text-reborn-gold border border-reborn-gold/40">
                          Lowest Energy
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-reborn-offwhite/50">
                      RMSD (l.b./u.b.): {pose.rmsd_lb.toFixed(2)} / {pose.rmsd_ub.toFixed(2)} Å
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-reborn-cyan">
                    {pose.affinity_kcal_mol} <span className="text-[10px] font-normal text-reborn-offwhite/60">kcal/mol</span>
                  </div>
                  <div className="text-[10px] text-reborn-emerald">
                    {pose.hBondCount || 3} H-bonds detected
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Advance Action Button */}
      <button
        onClick={onNext}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-reborn-terracotta to-reborn-gold text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-glow hover:opacity-95 transition-all"
      >
        <span>Proceed to Interaction Analysis</span>
        <Play className="w-4 h-4 fill-current" />
      </button>
    </div>
  );
}
