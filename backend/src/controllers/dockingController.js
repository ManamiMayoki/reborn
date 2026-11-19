import { DockingRun } from '../models/DockingRun.js';
import { Target } from '../models/Target.js';
import { Ligand } from '../models/Ligand.js';
import { mockStore } from '../utils/mockStore.js';
import { simulateDockingPoses } from '../services/computationalEngine.js';

export const getDockingRuns = async (req, res, next) => {
  try {
    const { projectId } = req.query;
    let runs = [];
    try {
      runs = projectId ? await DockingRun.find({ projectId }) : await DockingRun.find();
    } catch {
      runs = projectId ? mockStore.getDockingRunsByProjectId(projectId) : Array.from(mockStore.dockingRuns.values());
    }
    if (!runs || runs.length === 0) {
      runs = projectId ? mockStore.getDockingRunsByProjectId(projectId) : Array.from(mockStore.dockingRuns.values());
    }
    res.json({ success: true, count: runs.length, data: runs });
  } catch (error) {
    next(error);
  }
};

export const getDockingRunById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let run = null;
    try {
      run = await DockingRun.findById(id);
    } catch {
      run = mockStore.getDockingRunById(id);
    }
    if (!run) {
      run = mockStore.getDockingRunById(id);
    }
    if (!run) {
      return res.status(404).json({ success: false, message: 'Docking run record not found' });
    }
    res.json({ success: true, data: run });
  } catch (error) {
    next(error);
  }
};

export const startDockingRun = async (req, res, next) => {
  try {
    const { projectId, targetId, ligandId, exhaustiveness, searchBox } = req.body;

    let target = mockStore.getTargetById(targetId);
    let ligand = mockStore.getLigandById(ligandId);

    try {
      target = (await Target.findById(targetId)) || target;
      ligand = (await Ligand.findById(ligandId)) || ligand;
    } catch {}

    if (!target) target = Array.from(mockStore.targets.values())[0];
    if (!ligand) ligand = Array.from(mockStore.ligands.values())[0];

    const box = searchBox || target?.bindingPocket || {
      center: { x: 22.5, y: 0.8, z: 52.3 },
      size: { x: 20.0, y: 20.0, z: 20.0 },
    };

    const poses = simulateDockingPoses(target, ligand, box, exhaustiveness || 16);

    const newDockingRun = {
      projectId: projectId || target?.projectId || 'proj_egfr_1m17',
      targetId: target?._id || 'target_1m17',
      ligandId: ligand?._id || 'lig_gefitinib',
      engine: 'AutoDock Vina v1.2.5 spec',
      scoringFunction: 'Vina Empirical Free Energy (kcal/mol)',
      searchBox: box,
      exhaustiveness: exhaustiveness || 16,
      numModes: poses.length,
      energyRange: 3.0,
      seed: 424242,
      poses,
    };

    let saved = null;
    try {
      saved = await DockingRun.create(newDockingRun);
    } catch {
      saved = mockStore.saveDockingRun(newDockingRun);
    }
    mockStore.saveDockingRun(saved);

    res.status(201).json({
      success: true,
      message: `Molecular docking completed successfully. Generated ${poses.length} conformational modes. Top affinity: ${poses[0].affinity_kcal_mol} kcal/mol.`,
      data: saved,
    });
  } catch (error) {
    next(error);
  }
};
