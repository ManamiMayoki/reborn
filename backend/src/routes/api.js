import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { getTargets, getTargetById, prepareTarget } from '../controllers/targetController.js';
import { getLigands, getLigandById, createLigand } from '../controllers/ligandController.js';
import { getWorkflow, advanceStage, runStageSimulation } from '../controllers/workflowController.js';
import { getDockingRuns, getDockingRunById, startDockingRun } from '../controllers/dockingController.js';
import { getInteractions } from '../controllers/interactionController.js';
import { getAdmetProfiles, evaluateCustomLigand, updateRankingWeights } from '../controllers/admetController.js';
import { getValidationReport } from '../controllers/validationController.js';
import { getReportSummary, exportReportData } from '../controllers/reportController.js';
import { seedDemoData } from '../utils/seedData.js';
import { getDbStatus } from '../config/db.js';

const router = express.Router();

// Health check & System Status
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'Reborn 3D Computational Drug Discovery Engine',
    version: '1.0.0',
    database: getDbStatus(),
    timestamp: new Date().toISOString(),
  });
});

// Seed endpoint
router.post('/seed', async (req, res, next) => {
  try {
    await seedDemoData();
    res.json({ success: true, message: 'Reborn computational benchmark projects successfully seeded.' });
  } catch (error) {
    next(error);
  }
});

// 1. Projects
router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

// 2. Targets / Macromolecules
router.get('/targets', getTargets);
router.get('/targets/:id', getTargetById);
router.post('/targets/:id/prepare', prepareTarget);

// 3. Ligands / Small Molecules
router.get('/ligands', getLigands);
router.get('/ligands/:id', getLigandById);
router.post('/ligands', createLigand);

// 4. Workflow Orchestration (8 Stages)
router.get('/workflows/:projectId', getWorkflow);
router.post('/workflows/:projectId/advance', advanceStage);
router.post('/workflows/run-stage', runStageSimulation);

// 5. Docking Runs & Poses
router.get('/docking', getDockingRuns);
router.get('/docking/:id', getDockingRunById);
router.post('/docking/run', startDockingRun);

// 6. Interaction Analysis
router.get('/interactions', getInteractions);

// 7. ADMET & Candidate Ranking
router.get('/admet', getAdmetProfiles);
router.post('/admet/evaluate', evaluateCustomLigand);
router.post('/admet/reweight', updateRankingWeights);

// 8. Advanced Validation (MD & Redocking)
router.get('/validation', getValidationReport);

// 9. Reporting & Provenance Dossier
router.get('/reports/summary', getReportSummary);
router.get('/reports/export', exportReportData);

export default router;
