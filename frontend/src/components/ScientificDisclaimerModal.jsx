import React from 'react';
import { AlertTriangle, ShieldCheck, Microscope, Database, X } from 'lucide-react';

export default function ScientificDisclaimerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl reborn-glass-card rounded-2xl p-6 border border-reborn-gold/40 shadow-glow-gold overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-reborn-border/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-reborn-maroon/50 text-reborn-rose border border-reborn-terracotta/40">
              <AlertTriangle className="w-6 h-6 text-reborn-amber" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-reborn-offwhite font-sans flex items-center gap-2">
                Scientific Scope & Predictive Disclaimer
              </h2>
              <p className="text-xs text-reborn-gold font-mono">
                MoleculeX / Reborn Computational Methodology Notice
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-reborn-offwhite/60 hover:text-white hover:bg-reborn-navy transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-5 space-y-4 text-xs text-reborn-offwhite/85 leading-relaxed font-sans">
          <div className="p-3.5 rounded-xl bg-reborn-navy/80 border border-reborn-border flex items-start gap-3">
            <Microscope className="w-5 h-5 text-reborn-cyan shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-reborn-offwhite text-sm">Hypothesis Generation & In Silico Triage</h4>
              <p className="mt-1 text-reborn-offwhite/75">
                All binding energies ($\Delta G$ in kcal/mol), predicted docking poses, ADMET filters, and molecular dynamics stability metrics within <strong className="text-reborn-gold">Reborn</strong> are computed using empirical physics-based scoring and machine-learning models. They serve exclusively for <em>candidate prioritization, virtual screening, and structural hypothesis design</em>.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-reborn-navy/80 border border-reborn-border flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-reborn-emerald shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-reborn-offwhite text-sm">Wet-Lab Experimental Verification</h4>
              <p className="mt-1 text-reborn-offwhite/75">
                Computational models cannot replace physical biological assays. High-scoring leads must undergo wet-lab biochemical validation—including target binding affinity assays (Surface Plasmon Resonance, Isothermal Titration Calorimetry), cellular cytotoxicity assays, and clinical PK/PD profiling before biological efficacy or therapeutic safety can be claimed.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-reborn-navy/80 border border-reborn-border flex items-start gap-3">
            <Database className="w-5 h-5 text-reborn-gold shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-reborn-offwhite text-sm">Auditability & Provenance Guarantee</h4>
              <p className="mt-1 text-reborn-offwhite/75">
                Every workflow execution logs software parameterization, fixed random seeds, and cryptographic SHA-256 checksums to ensure 100% reproducible computational provenance in compliance with modern open-science standards.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-reborn-border/60 flex items-center justify-between">
          <span className="text-[11px] font-mono text-reborn-offwhite/50">
            Reborn Engine • v1.0.0
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-reborn-terracotta to-reborn-gold text-white font-medium text-xs shadow-glow hover:opacity-95 transition-opacity"
          >
            I Acknowledge & Understand
          </button>
        </div>
      </div>
    </div>
  );
}
