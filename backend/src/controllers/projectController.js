import { Project } from '../models/Project.js';
import { mockStore } from '../utils/mockStore.js';
import { Target } from '../models/Target.js';

export const getProjects = async (req, res, next) => {
  try {
    let projects = [];
    try {
      projects = await Project.find().sort({ updatedAt: -1 });
    } catch {
      projects = mockStore.getAllProjects();
    }
    if (!projects || projects.length === 0) {
      projects = mockStore.getAllProjects();
    }
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let project = null;
    try {
      project = await Project.findById(id);
    } catch {
      project = mockStore.getProjectById(id);
    }
    if (!project) {
      project = mockStore.getProjectById(id);
    }
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { name, description, diseaseIndication, targetPdbId, targetName } = req.body;
    const slug = (name || 'campaign').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const newProjData = {
      name: name || 'Novel Lead Optimization Campaign',
      slug,
      description: description || 'Computational structure-based screening pipeline.',
      diseaseIndication: diseaseIndication || 'General Therapeutics',
      activeWorkflowStep: 1,
      status: 'in_progress',
      tags: ['Screening', 'Virtual Docking', diseaseIndication || 'Therapeutics'],
      settings: {
        dockingEngine: 'AutoDock Vina v1.2.5',
        forceField: 'Amber ff14SB / GAFF2',
        exhaustiveness: 16,
        randomSeed: 4242,
      },
    };

    let savedProject = null;
    try {
      savedProject = await Project.create(newProjData);
    } catch {
      savedProject = mockStore.saveProject(newProjData);
    }
    mockStore.saveProject(savedProject);

    res.status(201).json({ success: true, data: savedProject });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    let updated = null;
    try {
      updated = await Project.findByIdAndUpdate(id, req.body, { new: true });
    } catch {
      const existing = mockStore.getProjectById(id) || {};
      updated = mockStore.saveProject({ ...existing, ...req.body, _id: id });
    }
    if (!updated) {
      const existing = mockStore.getProjectById(id) || {};
      updated = mockStore.saveProject({ ...existing, ...req.body, _id: id });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      await Project.findByIdAndDelete(id);
    } catch {
      mockStore.deleteProject(id);
    }
    mockStore.deleteProject(id);
    res.json({ success: true, message: 'Project removed successfully' });
  } catch (error) {
    next(error);
  }
};
