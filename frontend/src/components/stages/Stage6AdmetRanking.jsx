import React, { useState } from 'react';
import { Play, Activity, ShieldCheck, AlertTriangle, Sliders, CheckCircle2, Award, Zap } from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export default function Stage6AdmetRanking({ admetProfiles = [], onReweight, onNext }) {
  const [selectedProfileId, setSelectedProfileId] = useState(admetProfiles[0]?._id || admetProfiles[0]?.id);
  const [weights, setWeights] = useState({
    lipophilicity: 0.25,
    size: 0.2,
    polarity: 0.2,
    solubility: 0.2,
    flexibility: 0.15,
  });

  const activeProfile =
    admetProfiles.find((p) => p._id === selectedProfileId || p.id === selectedProfileId) || admetProfiles[0];

  // Radar data format for Recharts
  const radarData = activeProfile?.radarMetrics
    ? [
        { subject: 'Lipophilicity', score: activeProfile.radarMetrics.lipophilicity, fullMark: 100 },
        { subject: 'Size / MW', score: activeProfile.radarMetrics.size, fullMark: 100 },
        { subject: 'Polarity / TPSA', score: activeProfile.radarMetrics.polarity, fullMark: 100 },
        { subject: 'Solubility', score: activeProfile.radarMetrics.solubility, fullMark: 100 },
        { subject: 'Flexibility', score: activeProfile.radarMetrics.flexibility, fullMark: 100 },
        { subject: 'Saturation', score: activeProfile.radarMetrics.saturation, fullMark: 100 },
      ]
    : [];

  const handleWeightChange = (key, value) => {
    const updated = { ...weights, [key]: Number(value) };
    setWeights(updated);
    onReweight?.(updated);
  };

  const lipinski = activeProfile?.rules?.lipinski;
  const veber = activeProfile?.rules?.veber;
  const pains = activeProfile?.rules?.pains;
  const admetProps = activeProfile?.admetProperties;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-reborn-gold uppercase tracking-wider">
          <span>Stage 06</span>
          <span>•</span>
          <span>ADMET Profiling & Ranking</span>
        </div>
        <h2 className="text-xl font-bold text-reborn-offwhite mt-1">
          Drug-Likeness Filters & Multi-Criteria Ranking
        </h2>
        <p className="text-xs text-reborn-offwhite/70 mt-1 leading-relaxed">
          Filter candidates by Lipinski Rule of 5, Veber oral bioavailability, PAINS alerts, Caco-2 permeability, and hERG safety. Weight scoring dimensions to prioritize your lead series.
        </p>
      </div>

      {/* Candidate Ranking Carousel / Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-reborn-offwhite/70 block uppercase">
          Ranked Candidates Leaderboard
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {admetProfiles.map((p) => {
            const isSelected = (p._id || p.id) === (activeProfile?._id || activeProfile?.id);
            const isLead = p.rank === 1;

            return (
              <div
                key={p._id || p.id}
                onClick={() => setSelectedProfileId(p._id || p.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-reborn-navy border-reborn-cyan shadow-glow'
                    : 'reborn-glass border-reborn-border hover:border-reborn-border/90'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded flex items-center justify-center text-xs font-mono font-bold ${
                        isLead ? 'bg-reborn-gold text-reborn-darkest' : 'bg-reborn-navy text-reborn-cyan'
                      }`}
                    >
                      #{p.rank || 1}
                    </span>
                    <span className="text-xs font-bold text-reborn-offwhite truncate max-w-[120px]">
                      {p.ligandName}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-reborn-cyan">
                    {p.compositeScore}/100
                  </span>
                </div>

                <div className="mt-2 text-[10px] font-mono flex items-center justify-between text-reborn-offwhite/60">
                  <span className={p.rules?.lipinski?.passed ? 'text-reborn-emerald' : 'text-reborn-rose'}>
                    Lipinski: {p.rules?.lipinski?.passed ? 'Passed' : 'Violated'}
                  </span>
                  <span className="text-reborn-gold">{p.candidateClassification || 'Candidate'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Radar Chart & Key ADMET Rules Card */}
      {activeProfile && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Radar Visualization */}
          <div className="p-4 rounded-xl reborn-glass border border-reborn-border flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-reborn-gold">
                Drug-Likeness Hexagon Profile
              </span>
              <span className="text-[10px] font-mono text-reborn-cyan">Normalized 0-100</span>
            </div>

            <div className="w-full h-48 py-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#1E2D58" />
                  <PolarAngleAxis dataKey="subject" stroke="#A4773A" tick={{ fill: '#F7F4EB', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#1E2D58" />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#00E5FF"
                    fill="#00E5FF"
                    fillOpacity={0.4}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#060B18',
                      borderColor: '#00E5FF',
                      fontSize: '11px',
                      borderRadius: '8px',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="text-[10px] font-mono text-center text-reborn-offwhite/60">
              Optimal oral bioavailability envelope corresponds to scores &gt; 70.
            </div>
          </div>

          {/* ADMET Checklist Card */}
          <div className="p-4 rounded-xl reborn-glass border border-reborn-border space-y-3 font-mono text-xs">
            <span className="text-xs font-mono font-bold text-reborn-cyan block">
              ADMET Safety & Toxicity Screen
            </span>

            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-reborn-darkest/70 border border-reborn-border/60 flex items-center justify-between">
                <span>Lipinski Rule of 5:</span>
                <span className={lipinski?.passed ? 'text-reborn-emerald font-bold' : 'text-reborn-rose font-bold'}>
                  {lipinski?.passed ? 'Passed (0 Violations)' : `${lipinski?.violations} Violations`}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-reborn-darkest/70 border border-reborn-border/60 flex items-center justify-between">
                <span>Veber Oral Criteria:</span>
                <span className={veber?.passed ? 'text-reborn-emerald font-bold' : 'text-reborn-amber font-bold'}>
                  {veber?.passed ? 'Compliant (RotB ≤10, TPSA ≤140)' : 'Borderline'}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-reborn-darkest/70 border border-reborn-border/60 flex items-center justify-between">
                <span>PAINS Assay Alerts:</span>
                <span className="text-reborn-emerald font-bold">
                  {pains?.passed ? 'Zero Alerts (Clean)' : 'Alert Detected'}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-reborn-darkest/70 border border-reborn-border/60 flex items-center justify-between">
                <span>Caco-2 Permeability:</span>
                <span className="text-reborn-cyan font-bold">
                  {admetProps?.absorption?.caco2Permeability_cm_s || 2.4} × 10⁻⁶ cm/s
                </span>
              </div>

              <div className="p-2 rounded-lg bg-reborn-darkest/70 border border-reborn-border/60 flex items-center justify-between">
                <span>Blood-Brain Barrier (BBB):</span>
                <span className="text-reborn-gold font-bold">
                  {admetProps?.distribution?.bbbPermeable ? 'Permeable' : 'Non-Permeable (Peripherally Restricted)'}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-reborn-darkest/70 border border-reborn-border/60 flex items-center justify-between">
                <span>hERG Cardiotoxicity Risk:</span>
                <span className="text-reborn-emerald font-bold">
                  {admetProps?.toxicity?.hergRisk || 'Low'} Risk
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Criteria Weight Tuning Sliders */}
      <div className="p-4 rounded-xl reborn-glass border border-reborn-border space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-reborn-offwhite flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-reborn-gold" />
            <span>Multi-Objective Scoring Weights (Dynamic Prioritization)</span>
          </span>
          <span className="text-[10px] text-reborn-offwhite/50">Adjust to re-rank candidates</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-[11px] text-reborn-offwhite/70 mb-1">
              <span>Lipophilicity Weight:</span>
              <span className="text-reborn-gold">{(weights.lipophilicity * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.05"
              value={weights.lipophilicity}
              onChange={(e) => handleWeightChange('lipophilicity', e.target.value)}
              className="w-full accent-reborn-gold h-1 bg-reborn-darkest rounded"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-reborn-offwhite/70 mb-1">
              <span>Molecular Size / MW Weight:</span>
              <span className="text-reborn-cyan">{(weights.size * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.05"
              value={weights.size}
              onChange={(e) => handleWeightChange('size', e.target.value)}
              className="w-full accent-reborn-cyan h-1 bg-reborn-darkest rounded"
            />
          </div>
        </div>
      </div>

      {/* Advance Action Button */}
      <button
        onClick={onNext}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-reborn-terracotta to-reborn-gold text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-glow hover:opacity-95 transition-all"
      >
        <span>Proceed to Molecular Dynamics Validation</span>
        <Play className="w-4 h-4 fill-current" />
      </button>
    </div>
  );
}
