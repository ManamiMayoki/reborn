import { DockingRun } from '../models/DockingRun.js';
import { mockStore } from '../utils/mockStore.js';

export const getInteractions = async (req, res, next) => {
  try {
    const { dockingRunId, poseRank } = req.query;
    let run = null;

    if (dockingRunId) {
      try {
        run = await DockingRun.findById(dockingRunId);
      } catch {
        run = mockStore.getDockingRunById(dockingRunId);
      }
      if (!run) run = mockStore.getDockingRunById(dockingRunId);
    }

    if (!run) {
      run = Array.from(mockStore.dockingRuns.values())[0];
    }

    if (!run || !run.poses || run.poses.length === 0) {
      return res.status(404).json({ success: false, message: 'No docking poses available to analyze interactions.' });
    }

    const rank = parseInt(poseRank || '1', 10);
    const pose = run.poses.find((p) => p.poseRank === rank) || run.poses[0];

    const interactions = pose.interactions || [];

    // Group contacts by type
    const grouped = {
      hydrogenBonds: interactions.filter((i) => i.type === 'hydrogen_bond'),
      hydrophobicContacts: interactions.filter((i) => i.type === 'hydrophobic'),
      saltBridges: interactions.filter((i) => i.type === 'salt_bridge'),
      piStacking: interactions.filter((i) => i.type === 'pi_stacking'),
      halogenBonds: interactions.filter((i) => i.type === 'halogen_bond'),
    };

    res.json({
      success: true,
      data: {
        poseRank: pose.poseRank,
        affinity_kcal_mol: pose.affinity_kcal_mol,
        totalContactsCount: interactions.length,
        contacts: interactions,
        grouped,
      },
    });
  } catch (error) {
    next(error);
  }
};
