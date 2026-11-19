/**
 * Reborn Frontend API Service Client
 * Handles communication with /api/v1 with robust error handling and fallbacks.
 */

const API_BASE = '/api/v1';

async function fetchJson(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn(`[Reborn API Client] Fetch error on ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // System Health & Seeding
  getHealth: () => fetchJson('/health'),
  seedDemo: () => fetchJson('/seed', { method: 'POST' }),

  // Projects
  getProjects: () => fetchJson('/projects'),
  getProjectById: (id) => fetchJson(`/projects/${id}`),
  createProject: (data) => fetchJson('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id, data) => fetchJson(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Targets
  getTargets: (projectId) => fetchJson(`/targets${projectId ? `?projectId=${projectId}` : ''}`),
  getTargetById: (id) => fetchJson(`/targets/${id}`),
  prepareTarget: (id, data) => fetchJson(`/targets/${id}/prepare`, { method: 'POST', body: JSON.stringify(data) }),

  // Ligands
  getLigands: (projectId) => fetchJson(`/ligands${projectId ? `?projectId=${projectId}` : ''}`),
  getLigandById: (id) => fetchJson(`/ligands/${id}`),
  createLigand: (data) => fetchJson('/ligands', { method: 'POST', body: JSON.stringify(data) }),

  // Workflows
  getWorkflow: (projectId) => fetchJson(`/workflows/${projectId}`),
  advanceStage: (projectId, stageNumber) =>
    fetchJson(`/workflows/${projectId}/advance`, {
      method: 'POST',
      body: JSON.stringify({ stageNumber }),
    }),
  runStage: (projectId, stageNumber) =>
    fetchJson('/workflows/run-stage', {
      method: 'POST',
      body: JSON.stringify({ projectId, stageNumber }),
    }),

  // Docking
  getDockingRuns: (projectId) => fetchJson(`/docking${projectId ? `?projectId=${projectId}` : ''}`),
  startDockingRun: (data) => fetchJson('/docking/run', { method: 'POST', body: JSON.stringify(data) }),

  // Interactions
  getInteractions: (dockingRunId, poseRank = 1) =>
    fetchJson(`/interactions?dockingRunId=${dockingRunId || ''}&poseRank=${poseRank}`),

  // ADMET
  getAdmetProfiles: (projectId) => fetchJson(`/admet${projectId ? `?projectId=${projectId}` : ''}`),
  evaluateAdmet: (data) => fetchJson('/admet/evaluate', { method: 'POST', body: JSON.stringify(data) }),
  reweightAdmet: (projectId, weights) =>
    fetchJson('/admet/reweight', {
      method: 'POST',
      body: JSON.stringify({ projectId, weights }),
    }),

  // Validation
  getValidationReport: (projectId) =>
    fetchJson(`/validation${projectId ? `?projectId=${projectId}` : ''}`),

  // Reports
  getReportSummary: (projectId) =>
    fetchJson(`/reports/summary${projectId ? `?projectId=${projectId}` : ''}`),
  exportReportUrl: (projectId, format = 'json') =>
    `${API_BASE}/reports/export?projectId=${projectId || ''}&format=${format}`,
};
