import React, { useState } from 'react';
import { Play, Plus, Share2, Sparkles, AlertCircle, Check, Info } from 'lucide-react';

export default function Stage3LigandInput({ ligands = [], activeLigandId, onSelectLigand, onAddLigand, onNext }) {
  const [smilesInput, setSmilesInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputError, setInputError] = useState('');

  const activeLigand = ligands.find((l) => l.id === activeLigandId || l._id === activeLigandId) || ligands[0];

  const handleAddCustomLigand = async (e) => {
    e.preventDefault();
    if (!smilesInput.trim()) {
      setInputError('Please enter a valid chemical SMILES string');
      return;
    }
    setInputError('');
    setIsSubmitting(true);
    try {
      await onAddLigand?.({
        name: nameInput.trim() || 'Novel Designed Analogue',
        smiles: smilesInput.trim(),
      });
      setSmilesInput('');
      setNameInput('');
    } catch (err) {
      setInputError(err.message || 'Failed to parse SMILES molecule');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-reborn-gold uppercase tracking-wider">
          <span>Stage 03</span>
          <span>•</span>
          <span>Ligand Library Ingestion</span>
        </div>
        <h2 className="text-xl font-bold text-reborn-offwhite mt-1">
          Small Molecule Compounds & 3D Conformers
        </h2>
        <p className="text-xs text-reborn-offwhite/70 mt-1 leading-relaxed">
          Ingest small molecule candidate libraries via canonical SMILES. Reborn automatically evaluates Lipinski physicochemical descriptors and generates energy-minimized 3D conformer states.
        </p>
      </div>

      {/* Candidate Compounds List */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-reborn-offwhite/70 block uppercase">
          Screening Library Candidates ({ligands.length})
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {ligands.map((lig) => {
            const isSelected = (lig.id || lig._id) === (activeLigand?.id || activeLigand?._id);
            return (
              <div
                key={lig.id || lig._id}
                onClick={() => onSelectLigand?.(lig.id || lig._id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-reborn-navy border-reborn-gold shadow-glow-gold'
                    : 'reborn-glass border-reborn-border hover:border-reborn-border/90'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-reborn-offwhite">{lig.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-reborn-darkest text-reborn-gold border border-reborn-gold/30">
                      {lig.compoundCode || 'CMPD'}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-reborn-offwhite/60 truncate max-w-[240px] mt-0.5">
                    {lig.smiles}
                  </div>
                </div>

                <div className="text-right text-xs font-mono">
                  <div className="text-reborn-cyan font-bold">{lig.molecularWeight} g/mol</div>
                  <div className="text-[10px] text-reborn-offwhite/60">LogP: {lig.logP}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Compound Descriptor Card */}
      {activeLigand && (
        <div className="p-4 rounded-xl reborn-glass border border-reborn-border space-y-3">
          <div className="flex items-center justify-between border-b border-reborn-border/60 pb-2">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-reborn-gold" />
              <span className="text-sm font-semibold text-reborn-offwhite">
                {activeLigand.name} — Physicochemical Descriptors
              </span>
            </div>
            <span className="text-[10px] font-mono text-reborn-emerald bg-reborn-emerald/10 border border-reborn-emerald/30 px-2 py-0.5 rounded">
              3D Conformer Sampled
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2 rounded-lg bg-reborn-darkest/70 border border-reborn-border/60">
              <div className="text-[10px] text-reborn-offwhite/60">Mol Weight</div>
              <div className="text-xs font-bold text-reborn-cyan">{activeLigand.molecularWeight}</div>
              <div className="text-[9px] text-reborn-offwhite/40">≤ 500 Da</div>
            </div>
            <div className="p-2 rounded-lg bg-reborn-darkest/70 border border-reborn-border/60">
              <div className="text-[10px] text-reborn-offwhite/60">cLogP</div>
              <div className="text-xs font-bold text-reborn-gold">{activeLigand.logP}</div>
              <div className="text-[9px] text-reborn-offwhite/40">≤ 5.0</div>
            </div>
            <div className="p-2 rounded-lg bg-reborn-darkest/70 border border-reborn-border/60">
              <div className="text-[10px] text-reborn-offwhite/60">TPSA</div>
              <div className="text-xs font-bold text-reborn-emerald">{activeLigand.tpsa} Å²</div>
              <div className="text-[9px] text-reborn-offwhite/40">≤ 140 Å²</div>
            </div>
            <div className="p-2 rounded-lg bg-reborn-darkest/70 border border-reborn-border/60">
              <div className="text-[10px] text-reborn-offwhite/60">H-Donors (HBD)</div>
              <div className="text-xs font-bold text-reborn-offwhite">{activeLigand.hbd}</div>
              <div className="text-[9px] text-reborn-offwhite/40">≤ 5</div>
            </div>
            <div className="p-2 rounded-lg bg-reborn-darkest/70 border border-reborn-border/60">
              <div className="text-[10px] text-reborn-offwhite/60">H-Acceptors (HBA)</div>
              <div className="text-xs font-bold text-reborn-offwhite">{activeLigand.hba}</div>
              <div className="text-[9px] text-reborn-offwhite/40">≤ 10</div>
            </div>
            <div className="p-2 rounded-lg bg-reborn-darkest/70 border border-reborn-border/60">
              <div className="text-[10px] text-reborn-offwhite/60">Rotatable Bonds</div>
              <div className="text-xs font-bold text-reborn-terracotta">{activeLigand.rotatableBonds}</div>
              <div className="text-[9px] text-reborn-offwhite/40">≤ 10</div>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom SMILES Form */}
      <form onSubmit={handleAddCustomLigand} className="p-3.5 rounded-xl bg-reborn-navy/60 border border-reborn-border space-y-2">
        <span className="text-xs font-semibold text-reborn-offwhite flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5 text-reborn-cyan" />
          <span>Add Custom SMILES Compound</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            placeholder="Compound Name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="bg-reborn-darkest border border-reborn-border rounded-lg px-2.5 py-1.5 text-xs text-reborn-offwhite font-mono focus:border-reborn-cyan focus:outline-none"
          />
          <input
            type="text"
            placeholder="SMILES string (e.g. CC(=O)Oc1ccccc1C(=O)O)"
            value={smilesInput}
            onChange={(e) => setSmilesInput(e.target.value)}
            className="sm:col-span-2 bg-reborn-darkest border border-reborn-border rounded-lg px-2.5 py-1.5 text-xs text-reborn-offwhite font-mono focus:border-reborn-cyan focus:outline-none"
          />
        </div>

        {inputError && <p className="text-[10px] font-mono text-reborn-rose">{inputError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-1.5 rounded-lg bg-reborn-navy border border-reborn-cyan/50 text-reborn-cyan hover:bg-reborn-cyan/10 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <Sparkles className="w-3 h-3" />
          <span>{isSubmitting ? 'Generating 3D Conformer...' : 'Parse & Generate 3D Conformer'}</span>
        </button>
      </form>

      {/* Advance Action Button */}
      <button
        onClick={onNext}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-reborn-terracotta to-reborn-gold text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-glow hover:opacity-95 transition-all"
      >
        <span>Proceed to Molecular Docking</span>
        <Play className="w-4 h-4 fill-current" />
      </button>
    </div>
  );
}
