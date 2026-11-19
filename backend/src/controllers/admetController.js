import { AdmetProfile } from '../models/AdmetProfile.js';
import { Ligand } from '../models/Ligand.js';
import { mockStore } from '../utils/mockStore.js';
import { evaluateADMET } from '../services/computationalEngine.js';

export const getAdmetProfiles = async (req, res, next) => {
  try {
    const { projectId } = req.query;
    let profiles = [];
    try {
      profiles = projectId ? await AdmetProfile.find({ projectId }).sort({ rank: 1 }) : await AdmetProfile.find().sort({ rank: 1 });
    } catch {
      profiles = projectId ? mockStore.getAdmetProfilesByProjectId(projectId) : Array.from(mockStore.admetProfiles.values());
    }
    if (!profiles || profiles.length === 0) {
      profiles = projectId ? mockStore.getAdmetProfilesByProjectId(projectId) : Array.from(mockStore.admetProfiles.values());
    }
    res.json({ success: true, count: profiles.length, data: profiles });
  } catch (error) {
    next(error);
  }
};

export const evaluateCustomLigand = async (req, res, next) => {
  try {
    const { ligandId, customProperties } = req.body;
    let ligand = mockStore.getLigandById(ligandId);
    try {
      ligand = (await Ligand.findById(ligandId)) || ligand;
    } catch {}

    const ligandToEval = ligand ? { ...ligand, ...customProperties } : customProperties;
    if (!ligandToEval) {
      return res.status(400).json({ success: false, message: 'Valid ligand data required for ADMET assessment' });
    }

    const evaluation = evaluateADMET(ligandToEval);
    res.json({ success: true, data: evaluation });
  } catch (error) {
    next(error);
  }
};

export const updateRankingWeights = async (req, res, next) => {
  try {
    const { projectId, weights } = req.body;
    // Default weights: lipophilicity 20%, size 20%, polarity 15%, solubility 15%, flexibility 15%, rules 15%
    const w = {
      lipophilicity: weights?.lipophilicity ?? 0.2,
      size: weights?.size ?? 0.2,
      polarity: weights?.polarity ?? 0.15,
      solubility: weights?.solubility ?? 0.15,
      flexibility: weights?.flexibility ?? 0.15,
    };

    let profiles = mockStore.getAdmetProfilesByProjectId(projectId);
    if (!profiles || profiles.length === 0) {
      profiles = Array.from(mockStore.admetProfiles.values());
    }

    const reweighted = profiles.map((p) => {
      const rm = p.radarMetrics || { lipophilicity: 80, size: 75, polarity: 85, solubility: 70, flexibility: 80 };
      const score = Math.round(
        rm.lipophilicity * w.lipophilicity +
        rm.size * w.size +
        rm.polarity * w.polarity +
        rm.solubility * w.solubility +
        rm.flexibility * w.flexibility +
        (p.rules?.lipinski?.passed ? 10 : 0) +
        (p.rules?.pains?.passed ? 5 : 0)
      );
      return { ...p, compositeScore: Math.min(100, Math.max(0, score)) };
    });

    // Sort descending by new composite score
    reweighted.sort((a, b) => b.compositeScore - a.compositeScore);
    reweighted.forEach((p, idx) => {
      p.rank = idx + 1;
      p.candidateClassification = idx === 0 ? 'Lead Candidate' : idx === 1 ? 'Backup Candidate' : 'Requires Optimization';
      mockStore.saveAdmetProfile(p);
    });

    res.json({ success: true, message: 'Multi-criteria ranking recomputed', data: reweighted });
  } catch (error) {
    next(error);
  }
};
