/**
 * In-Memory Fallback & Sync Store for Reborn.
 * Ensures the platform operates seamlessly both with live MongoDB
 * and in zero-setup/standalone environments.
 */

class MockStore {
  constructor() {
    this.projects = new Map();
    this.targets = new Map();
    this.ligands = new Map();
    this.workflows = new Map();
    this.dockingRuns = new Map();
    this.admetProfiles = new Map();
    this.validationReports = new Map();
  }

  // --- Projects ---
  getAllProjects() {
    return Array.from(this.projects.values());
  }

  getProjectById(id) {
    return this.projects.get(id) || null;
  }

  saveProject(project) {
    const p = {
      ...project,
      _id: project._id || project.id || `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      updatedAt: new Date(),
      createdAt: project.createdAt || new Date(),
    };
    p.id = p._id;
    this.projects.set(p.id, p);
    return p;
  }

  deleteProject(id) {
    return this.projects.delete(id);
  }

  // --- Targets ---
  getTargetsByProjectId(projectId) {
    return Array.from(this.targets.values()).filter((t) => t.projectId === projectId);
  }

  getTargetById(id) {
    return this.targets.get(id) || null;
  }

  saveTarget(target) {
    const t = {
      ...target,
      _id: target._id || target.id || `tgt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      updatedAt: new Date(),
      createdAt: target.createdAt || new Date(),
    };
    t.id = t._id;
    this.targets.set(t.id, t);
    return t;
  }

  // --- Ligands ---
  getLigandsByProjectId(projectId) {
    return Array.from(this.ligands.values()).filter((l) => l.projectId === projectId);
  }

  getLigandById(id) {
    return this.ligands.get(id) || null;
  }

  saveLigand(ligand) {
    const l = {
      ...ligand,
      _id: ligand._id || ligand.id || `lig_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      updatedAt: new Date(),
      createdAt: ligand.createdAt || new Date(),
    };
    l.id = l._id;
    this.ligands.set(l.id, l);
    return l;
  }

  // --- Workflows ---
  getWorkflowByProjectId(projectId) {
    for (const wf of this.workflows.values()) {
      if (wf.projectId === projectId) return wf;
    }
    return null;
  }

  saveWorkflow(workflow) {
    const wf = {
      ...workflow,
      _id: workflow._id || workflow.id || `wf_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      updatedAt: new Date(),
      createdAt: workflow.createdAt || new Date(),
    };
    wf.id = wf._id;
    this.workflows.set(wf.id, wf);
    return wf;
  }

  // --- Docking Runs ---
  getDockingRunsByProjectId(projectId) {
    return Array.from(this.dockingRuns.values()).filter((d) => d.projectId === projectId);
  }

  getDockingRunById(id) {
    return this.dockingRuns.get(id) || null;
  }

  saveDockingRun(dockingRun) {
    const dr = {
      ...dockingRun,
      _id: dockingRun._id || dockingRun.id || `dock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      updatedAt: new Date(),
      createdAt: dockingRun.createdAt || new Date(),
    };
    dr.id = dr._id;
    this.dockingRuns.set(dr.id, dr);
    return dr;
  }

  // --- ADMET Profiles ---
  getAdmetProfilesByProjectId(projectId) {
    return Array.from(this.admetProfiles.values()).filter((a) => a.projectId === projectId);
  }

  saveAdmetProfile(profile) {
    const ap = {
      ...profile,
      _id: profile._id || profile.id || `admet_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      updatedAt: new Date(),
      createdAt: profile.createdAt || new Date(),
    };
    ap.id = ap._id;
    this.admetProfiles.set(ap.id, ap);
    return ap;
  }

  // --- Validation Reports ---
  getValidationReportByProjectId(projectId) {
    for (const rep of this.validationReports.values()) {
      if (rep.projectId === projectId) return rep;
    }
    return null;
  }

  saveValidationReport(report) {
    const vr = {
      ...report,
      _id: report._id || report.id || `val_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      updatedAt: new Date(),
      createdAt: report.createdAt || new Date(),
    };
    vr.id = vr._id;
    this.validationReports.set(vr.id, vr);
    return vr;
  }

  clear() {
    this.projects.clear();
    this.targets.clear();
    this.ligands.clear();
    this.workflows.clear();
    this.dockingRuns.clear();
    this.admetProfiles.clear();
    this.validationReports.clear();
  }
}

export const mockStore = new MockStore();
