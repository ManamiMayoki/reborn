import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import StageStepper from './components/StageStepper';
import MolecularStage3D from './scenes/MolecularStage3D';
import Stage1ProjectSetup from './components/stages/Stage1ProjectSetup';
import Stage2ProteinInput from './components/stages/Stage2ProteinInput';
import Stage3LigandInput from './components/stages/Stage3LigandInput';
import Stage4Docking from './components/stages/Stage4Docking';
import Stage5InteractionAnalysis from './components/stages/Stage5InteractionAnalysis';
import Stage6AdmetRanking from './components/stages/Stage6AdmetRanking';
import Stage7Validation from './components/stages/Stage7Validation';
import Stage8Reporting from './components/stages/Stage8Reporting';
import ScientificDisclaimerModal from './components/ScientificDisclaimerModal';
import WorkflowLogDrawer from './components/WorkflowLogDrawer';
import { api } from './services/api';
import { animateStageTransition } from './animations/gsapTransitions';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [target, setTarget] = useState(null);
  const [ligands, setLigands] = useState([]);
  const [activeLigandId, setActiveLigandId] = useState(null);
  const [workflow, setWorkflow] = useState(null);
  const [currentStage, setCurrentStage] = useState(1);
  const [dockingRun, setDockingRun] = useState(null);
  const [activePoseRank, setActivePoseRank] = useState(1);
  const [admetProfiles, setAdmetProfiles] = useState([]);
  const [validationReport, setValidationReport] = useState(null);
  const [executionLogs, setExecutionLogs] = useState([]);

  // UI state
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isLogDrawerOpen, setIsLogDrawerOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // GSAP animation container ref for stage transitions
  const stagePanelRef = useRef(null);

  // Initial load
  useEffect(() => {
    loadAllData();
  }, []);

  // Trigger GSAP animation whenever active stage changes
  useEffect(() => {
    animateStageTransition(stagePanelRef);
  }, [currentStage]);

  const loadAllData = async (preferredProjectId) => {
    try {
      const projRes = await api.getProjects().catch(() => ({ data: [] }));
      const projectList = projRes?.data || [];
      setProjects(projectList);

      const activeProj =
        (preferredProjectId ? projectList.find((p) => (p.id || p._id) === preferredProjectId) : null) ||
        projectList[0];
      setCurrentProject(activeProj);

      if (activeProj) {
        const projId = activeProj.id || activeProj._id;

        // Fetch targets, ligands, workflows, docking, admet, validation in parallel
        const [targetRes, ligRes, wfRes, dockRes, admetRes, valRes] = await Promise.all([
          api.getTargets(projId).catch(() => ({ data: [] })),
          api.getLigands(projId).catch(() => ({ data: [] })),
          api.getWorkflow(projId).catch(() => ({ data: null })),
          api.getDockingRuns(projId).catch(() => ({ data: [] })),
          api.getAdmetProfiles(projId).catch(() => ({ data: [] })),
          api.getValidationReport(projId).catch(() => ({ data: null })),
        ]);

        const loadedTarget = targetRes?.data?.[0] || null;
        const loadedLigands = ligRes?.data || [];
        const loadedWorkflow = wfRes?.data || null;
        const loadedDocking = dockRes?.data?.[0] || null;
        const loadedAdmet = admetRes?.data || [];
        const loadedVal = valRes?.data || null;

        setTarget(loadedTarget);
        setLigands(loadedLigands);
        setActiveLigandId(loadedLigands[0]?.id || loadedLigands[0]?._id);
        setWorkflow(loadedWorkflow);
        setCurrentStage(loadedWorkflow?.currentStage || 1);
        setDockingRun(loadedDocking);
        setActivePoseRank(1);
        setAdmetProfiles(loadedAdmet);
        setValidationReport(loadedVal);
        setExecutionLogs(loadedWorkflow?.executionLogs || []);
      }
    } catch (err) {
      console.error('[Reborn App] Error loading initial project data:', err);
    }
  };

  // Switch Project
  const handleSelectProject = (projectId) => {
    loadAllData(projectId);
  };

  // Reset / Seed Demo Data
  const handleResetSeed = async () => {
    setIsSeeding(true);
    try {
      await api.seedDemo();
      await loadAllData();
      setIsLogDrawerOpen(true);
    } catch (err) {
      console.error('[Reborn] Seeding error:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  // Advance Stage
  const handleStageSelect = async (stageNum) => {
    setCurrentStage(stageNum);
    if (currentProject) {
      try {
        const res = await api.advanceStage(currentProject.id || currentProject._id, stageNum);
        if (res?.data) {
          setWorkflow(res.data);
          setExecutionLogs(res.data.executionLogs || []);
        }
      } catch (err) {
        console.warn('[Reborn] Advance stage sync error:', err.message);
      }
    }
  };

  const handleNextStage = () => {
    if (currentStage < 8) {
      handleStageSelect(currentStage + 1);
    }
  };

  // Add custom small molecule ligand
  const handleAddLigand = async (ligandData) => {
    try {
      const res = await api.createLigand({
        projectId: currentProject?.id || currentProject?._id,
        ...ligandData,
      });
      if (res?.data) {
        setLigands((prev) => [res.data, ...prev]);
        setActiveLigandId(res.data.id || res.data._id);
        // Refresh ADMET profiles
        const admetRes = await api.getAdmetProfiles(currentProject?.id || currentProject?._id);
        if (admetRes?.data) setAdmetProfiles(admetRes.data);
      }
    } catch (err) {
      console.error('[Reborn] Add ligand failed:', err);
      throw err;
    }
  };

  // Execute or Re-run Docking
  const handleRunDocking = async (params) => {
    try {
      const res = await api.startDockingRun({
        projectId: currentProject?.id || currentProject?._id,
        targetId: target?.id || target?._id,
        ligandId: activeLigandId,
        ...params,
      });
      if (res?.data) {
        setDockingRun(res.data);
        setActivePoseRank(1);
      }
    } catch (err) {
      console.error('[Reborn] Docking execution failed:', err);
    }
  };

  // Reweight ADMET composite scoring
  const handleReweight = async (weights) => {
    try {
      const res = await api.reweightAdmet(currentProject?.id || currentProject?._id, weights);
      if (res?.data) {
        setAdmetProfiles(res.data);
      }
    } catch (err) {
      console.error('[Reborn] Reweight failed:', err);
    }
  };

  // Export JSON Report
  const handleExportJson = () => {
    const url = api.exportReportUrl(currentProject?.id || currentProject?._id, 'json');
    window.open(url, '_blank');
  };

  // Export CSV Report
  const handleExportCsv = () => {
    const url = api.exportReportUrl(currentProject?.id || currentProject?._id, 'csv');
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-reborn-darkest text-reborn-offwhite flex flex-col font-sans selection:bg-reborn-terracotta selection:text-white">
      {/* 1. Navbar */}
      <Navbar
        projects={projects}
        currentProject={currentProject}
        onSelectProject={handleSelectProject}
        onResetSeed={handleResetSeed}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
        onExportReport={() => handleStageSelect(8)}
        isSeeding={isSeeding}
      />

      {/* 2. Interactive 8-Stage Workflow Pipeline Header */}
      <StageStepper
        currentStage={currentStage}
        onSelectStage={handleStageSelect}
        workflow={workflow}
      />

      {/* 3. Main Workspace Split Layout */}
      <main className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1920px] w-full mx-auto pb-16">
        {/* Left Column: Interactive 3D Molecular & Workflow Stage (7 cols on desktop) */}
        <div className="lg:col-span-7 h-[540px] lg:h-[calc(100vh-175px)] min-h-[480px]">
          <MolecularStage3D
            target={target}
            ligands={ligands}
            activeLigandId={activeLigandId}
            dockingRun={dockingRun}
            activePoseRank={activePoseRank}
            currentStage={currentStage}
          />
        </div>

        {/* Right Column: Workflow Stage Control Panel (5 cols on desktop) */}
        <div
          ref={stagePanelRef}
          className="lg:col-span-5 reborn-glass rounded-2xl p-6 border border-reborn-border shadow-2xl overflow-y-auto max-h-[820px] lg:max-h-[calc(100vh-175px)]"
        >
          {currentStage === 1 && (
            <Stage1ProjectSetup
              project={currentProject}
              target={target}
              onNext={handleNextStage}
              onUpdateProject={(data) => {
                api.updateProject(currentProject?.id || currentProject?._id, data);
              }}
            />
          )}

          {currentStage === 2 && (
            <Stage2ProteinInput
              target={target}
              onNext={handleNextStage}
              onPrepareTarget={(prepData) => {
                if (target) api.prepareTarget(target.id || target._id, prepData);
              }}
            />
          )}

          {currentStage === 3 && (
            <Stage3LigandInput
              ligands={ligands}
              activeLigandId={activeLigandId}
              onSelectLigand={setActiveLigandId}
              onAddLigand={handleAddLigand}
              onNext={handleNextStage}
            />
          )}

          {currentStage === 4 && (
            <Stage4Docking
              dockingRun={dockingRun}
              activePoseRank={activePoseRank}
              onSelectPose={setActivePoseRank}
              onRunDocking={handleRunDocking}
              onNext={handleNextStage}
              target={target}
              activeLigand={ligands.find((l) => (l.id || l._id) === activeLigandId)}
            />
          )}

          {currentStage === 5 && (
            <Stage5InteractionAnalysis
              dockingRun={dockingRun}
              activePoseRank={activePoseRank}
              onNext={handleNextStage}
            />
          )}

          {currentStage === 6 && (
            <Stage6AdmetRanking
              admetProfiles={admetProfiles}
              onReweight={handleReweight}
              onNext={handleNextStage}
            />
          )}

          {currentStage === 7 && (
            <Stage7Validation
              validationReport={validationReport}
              onNext={handleNextStage}
            />
          )}

          {currentStage === 8 && (
            <Stage8Reporting
              project={currentProject}
              target={target}
              activeLigand={ligands.find((l) => (l.id || l._id) === activeLigandId)}
              dockingRun={dockingRun}
              admetProfiles={admetProfiles}
              validationReport={validationReport}
              onExportJson={handleExportJson}
              onExportCsv={handleExportCsv}
            />
          )}
        </div>
      </main>

      {/* 4. Live Computational Console Log Drawer */}
      <WorkflowLogDrawer
        logs={executionLogs}
        isOpen={isLogDrawerOpen}
        onToggle={() => setIsLogDrawerOpen(!isLogDrawerOpen)}
      />

      {/* 5. Scientific Predictive Scope & Disclaimer Modal */}
      <ScientificDisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />
    </div>
  );
}
