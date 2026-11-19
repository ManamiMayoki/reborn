import { WorkflowRun } from '../models/WorkflowRun.js';
import { Project } from '../models/Project.js';
import { mockStore } from '../utils/mockStore.js';

export const getWorkflow = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    let workflow = null;
    try {
      workflow = await WorkflowRun.findOne({ projectId });
    } catch {
      workflow = mockStore.getWorkflowByProjectId(projectId);
    }
    if (!workflow) {
      workflow = mockStore.getWorkflowByProjectId(projectId);
    }
    if (!workflow) {
      return res.status(404).json({ success: false, message: 'Workflow run not found for this project' });
    }
    res.json({ success: true, data: workflow });
  } catch (error) {
    next(error);
  }
};

export const advanceStage = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { stageNumber } = req.body;

    if (stageNumber < 1 || stageNumber > 8) {
      return res.status(400).json({ success: false, message: 'Stage number must be between 1 and 8' });
    }

    let workflow = mockStore.getWorkflowByProjectId(projectId);
    try {
      workflow = (await WorkflowRun.findOne({ projectId })) || workflow;
    } catch {}

    if (!workflow) {
      return res.status(404).json({ success: false, message: 'Workflow run not found' });
    }

    workflow.currentStage = stageNumber;
    if (workflow.stages && workflow.stages[stageNumber - 1]) {
      workflow.stages[stageNumber - 1].status = 'completed';
      workflow.stages[stageNumber - 1].completedAt = new Date();
    }

    const logEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date(),
      stage: stageNumber,
      level: 'info',
      message: `Active workflow stage transitioned to Stage ${stageNumber}: ${
        workflow.stages[stageNumber - 1]?.name || 'Pipeline Step'
      }`,
    };
    workflow.executionLogs.push(logEntry);

    try {
      await WorkflowRun.findOneAndUpdate({ projectId }, workflow);
      await Project.findByIdAndUpdate(projectId, { activeWorkflowStep: stageNumber });
    } catch {}
    mockStore.saveWorkflow(workflow);

    res.json({
      success: true,
      message: `Workflow advanced to Stage ${stageNumber}`,
      data: workflow,
    });
  } catch (error) {
    next(error);
  }
};

export const runStageSimulation = async (req, res, next) => {
  try {
    const { projectId, stageNumber } = req.body;
    let workflow = mockStore.getWorkflowByProjectId(projectId);
    try {
      workflow = (await WorkflowRun.findOne({ projectId })) || workflow;
    } catch {}

    if (!workflow) {
      return res.status(404).json({ success: false, message: 'Workflow not found' });
    }

    const stgIdx = stageNumber - 1;
    if (workflow.stages[stgIdx]) {
      workflow.stages[stgIdx].status = 'completed';
      workflow.stages[stgIdx].completedAt = new Date();
    }
    workflow.currentStage = Math.min(8, stageNumber + 1);

    const logEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date(),
      stage: stageNumber,
      level: 'success',
      message: `Stage ${stageNumber} computation finished with high convergence.`,
    };
    workflow.executionLogs.push(logEntry);

    try {
      await WorkflowRun.findOneAndUpdate({ projectId }, workflow);
    } catch {}
    mockStore.saveWorkflow(workflow);

    res.json({ success: true, message: `Stage ${stageNumber} completed`, data: workflow });
  } catch (error) {
    next(error);
  }
};
