/**
 * Comprehensive Seed Data for Reborn
 * Prepares realistic computational drug discovery campaigns
 * with 3D structural data, docking results, ADMET profiles, and MD metrics.
 */

import mongoose from 'mongoose';
import { mockStore } from './mockStore.js';
import { Project } from '../models/Project.js';
import { Target } from '../models/Target.js';
import { Ligand } from '../models/Ligand.js';
import { WorkflowRun } from '../models/WorkflowRun.js';
import { DockingRun } from '../models/DockingRun.js';
import { AdmetProfile } from '../models/AdmetProfile.js';
import { ValidationReport } from '../models/ValidationReport.js';
import { calculateSMILESDescriptors, generateConformerCoordinates, evaluateADMET, simulateDockingPoses } from '../services/computationalEngine.js';

/**
 * Generate realistic protein backbone CA trace for 3D visualization
 */
export function generateProteinBackbone(center, residueCount = 120) {
  const backbone = [];
  const atoms = [];
  const resNames = ['LEU', 'VAL', 'GLY', 'ALA', 'MET', 'PHE', 'TYR', 'ASP', 'GLU', 'LYS', 'ARG', 'THR', 'SER', 'ILE', 'HIS', 'GLN', 'ASN', 'PRO'];

  let cx = center.x - 15;
  let cy = center.y - 12;
  let cz = center.z - 8;

  for (let i = 0; i < residueCount; i++) {
    const resSeq = 710 + i;
    const resName = resNames[i % resNames.length];
    const secStruct = i > 25 && i < 45 ? 'helix' : i > 55 && i < 70 ? 'sheet' : i > 85 && i < 105 ? 'helix' : 'loop';

    // Helical or sheet-like periodic trajectory in 3D
    if (secStruct === 'helix') {
      const theta = i * 0.95;
      cx += Math.cos(theta) * 2.2;
      cy += Math.sin(theta) * 2.2;
      cz += 0.8;
    } else if (secStruct === 'sheet') {
      cx += (i % 2 === 0 ? 3.4 : -0.5);
      cy += (i % 2 === 0 ? -0.8 : 3.4);
      cz += 0.3;
    } else {
      cx += Math.sin(i * 1.3) * 2.8;
      cy += Math.cos(i * 0.9) * 2.8;
      cz += Math.sin(i * 0.5) * 1.5;
    }

    const x = parseFloat(cx.toFixed(3));
    const y = parseFloat(cy.toFixed(3));
    const z = parseFloat(cz.toFixed(3));

    backbone.push({
      x,
      y,
      z,
      resName,
      resSeq,
      chain: 'A',
      secStruct,
    });

    // CA Atom
    atoms.push({
      id: i * 3 + 1,
      name: 'CA',
      element: 'C',
      resName,
      resSeq,
      chain: 'A',
      x,
      y,
      z,
      bFactor: parseFloat((18.0 + Math.sin(i) * 8.0).toFixed(2)),
      charge: 0.0,
    });

    // Nitrogen
    atoms.push({
      id: i * 3 + 2,
      name: 'N',
      element: 'N',
      resName,
      resSeq,
      chain: 'A',
      x: parseFloat((x - 0.7).toFixed(3)),
      y: parseFloat((y + 0.6).toFixed(3)),
      z: parseFloat((z + 0.4).toFixed(3)),
      bFactor: 19.5,
      charge: -0.28,
    });

    // Carbonyl Oxygen
    atoms.push({
      id: i * 3 + 3,
      name: 'O',
      element: 'O',
      resName,
      resSeq,
      chain: 'A',
      x: parseFloat((x + 0.8).toFixed(3)),
      y: parseFloat((y - 0.5).toFixed(3)),
      z: parseFloat((z - 0.3).toFixed(3)),
      bFactor: 21.0,
      charge: -0.38,
    });
  }

  return { backbone, atoms };
}

/**
 * Generate 100ns MD Simulation Time Series
 */
export function generateMDTimeseries() {
  const trajectoryTimeSeries = [];
  const rmsfPerResidue = [];

  for (let t = 0; t <= 100; t += 2) {
    // Backbone RMSD equilibrates around 1.35 - 1.55 A
    const backboneRmsd = parseFloat((0.85 + 0.55 * (1 - Math.exp(-t / 15)) + Math.sin(t * 0.3) * 0.08).toFixed(3));
    // Ligand RMSD stays stable around 0.95 - 1.25 A
    const ligandRmsd = parseFloat((0.65 + 0.45 * (1 - Math.exp(-t / 10)) + Math.cos(t * 0.25) * 0.06).toFixed(3));
    // Radius of Gyration Rg oscillates tightly around 19.8 A
    const radiusOfGyration = parseFloat((19.75 + Math.sin(t * 0.1) * 0.18).toFixed(3));
    // Hydrogen bonds count fluctuates between 3 and 5
    const hbondsCount = Math.round(4 + Math.sin(t * 0.4) * 0.8);

    trajectoryTimeSeries.push({
      timeNs: t,
      backboneRmsd,
      ligandRmsd,
      radiusOfGyration,
      hbondsCount,
    });
  }

  // RMSF per residue (fluctuations, pocket residues are much lower/rigid)
  const pocketResSeqs = [718, 745, 790, 793, 855, 856];
  for (let seq = 710; seq <= 810; seq++) {
    const isPocket = pocketResSeqs.includes(seq);
    const baseFluctuation = isPocket ? 0.55 : 1.25;
    const rmsf = parseFloat((baseFluctuation + Math.abs(Math.sin(seq * 0.8)) * (isPocket ? 0.3 : 1.4)).toFixed(3));
    rmsfPerResidue.push({
      residueSeq: seq,
      residueName: isPocket ? 'POCKET' : 'RES',
      rmsf,
      isPocketResidue: isPocket,
    });
  }

  return { trajectoryTimeSeries, rmsfPerResidue };
}

export async function seedDemoData() {
  console.log('[Reborn Seed] Initializing computational drug discovery benchmark projects...');

  // Clear in-memory store
  mockStore.clear();

  // 1. PROJECT: EGFR Kinase Inhibitor Campaign
  const p1 = {
    _id: 'proj_egfr_1m17',
    name: 'EGFR Kinase Domain (L858R / T790M) Inhibitor Campaign',
    slug: 'egfr-kinase-inhibitor-campaign',
    description:
      'Structure-based virtual screening and lead optimization targeting the ATP-binding cleft of Human Epidermal Growth Factor Receptor (EGFR) Kinase for next-generation NSCLC therapeutics.',
    diseaseIndication: 'Non-Small Cell Lung Cancer (NSCLC)',
    activeWorkflowStep: 5,
    status: 'docking_completed',
    tags: ['Kinase', 'Oncology', 'ATP-Cleft', 'AutoDock Vina', 'Lead Optimization'],
    settings: {
      dockingEngine: 'AutoDock Vina v1.2.5',
      forceField: 'Amber ff14SB / GAFF2',
      exhaustiveness: 16,
      randomSeed: 4242,
    },
  };

  // 2. TARGET: 1M17 EGFR Kinase
  const center1 = { x: 22.5, y: 0.8, z: 52.3 };
  const struct1 = generateProteinBackbone(center1, 140);

  const t1 = {
    _id: 'target_1m17',
    projectId: p1._id,
    name: 'Epidermal Growth Factor Receptor (EGFR) Kinase Domain',
    pdbId: '1M17',
    title: 'Crystal Structure of EGFR Kinase Domain in Complex with Quinazoline Inhibitor',
    organism: 'Homo sapiens',
    resolution: 2.6,
    chains: ['A'],
    sequence:
      'LGEGAFGKVYKALWIPEGEKVAIKTLKEATS...VHRDLAARNVLVKTQHRVKICDFGLARLLDIDETEYHADGGKVPIKWMALESILHR...MCLIK',
    preparation: {
      isPrepared: true,
      missingAtomsFixed: true,
      hydrogensAdded: true,
      chargesAssigned: true,
      chargeModel: 'Gasteiger-Marsili / Kollman Hybrid',
      protonationState: 'pH 7.4 Physiological (His773 protonated, Asp855 negative)',
      waterMoleculesStripped: true,
      energyMinimizationSteps: 1000,
      finalEnergy_kcal_mol: -1845.2,
    },
    bindingPocket: {
      name: 'ATP-Binding Pocket & Hinge Region (Met793 - Cys797)',
      center: center1,
      size: { x: 22.0, y: 22.0, z: 22.0 },
      volume: 890.0,
      druggabilityScore: 0.94,
      keyResidues: [
        { name: 'Met', number: 793, chain: 'A', role: 'Hinge H-Bond Acceptor / Adenine mimic' },
        { name: 'Lys', number: 745, chain: 'A', role: 'Catalytic Salt Bridge / Phosphate anchor' },
        { name: 'Thr', number: 790, chain: 'A', role: 'Gatekeeper Residue (Mutation Hotspot)' },
        { name: 'Leu', number: 718, chain: 'A', role: 'Hydrophobic Pocket P-Loop ceiling' },
        { name: 'Asp', number: 855, chain: 'A', role: 'Catalytic DFG Aspartate' },
        { name: 'Phe', number: 856, chain: 'A', role: 'DFG Phenylalanine Pi-Strap' },
      ],
    },
    structureData: {
      atomCount: struct1.atoms.length,
      residueCount: struct1.backbone.length,
      backbonePoints: struct1.backbone,
      atoms: struct1.atoms,
    },
  };

  p1.targetId = t1._id;

  // 3. LIGANDS: Gefitinib, Erlotinib, Osimertinib, Novel Analogue RB-01
  const l1Smiles = 'COc1cc2ncnc(Nc3ccc(F)c(Cl)c3)c2cc1OCCCN1CCOCC1'; // Gefitinib
  const l1Desc = calculateSMILESDescriptors(l1Smiles);
  const l1Coords = generateConformerCoordinates('Gefitinib', l1Smiles, center1);

  const lig1 = {
    _id: 'lig_gefitinib',
    projectId: p1._id,
    name: 'Gefitinib (Iressa)',
    compoundCode: 'RB-LIG-001',
    smiles: l1Smiles,
    formula: 'C22H24ClFN4O3',
    iupacName: 'N-(3-chloro-4-fluorophenyl)-7-methoxy-6-(3-morpholin-4-ylpropoxy)quinazolin-4-amine',
    molecularWeight: 446.9,
    logP: 3.2,
    hbd: 1,
    hba: 7,
    tpsa: 68.7,
    rotatableBonds: 6,
    heavyAtomCount: 31,
    formalCharge: 0,
    conformers: [
      {
        conformerId: 1,
        energy_kcal_mol: -48.2,
        atoms: l1Coords.atoms,
        bonds: l1Coords.bonds,
      },
    ],
  };

  const l2Smiles = 'COc1cc2ncnc(Nc3cccc(C#C)c3)c2cc1OCCOC'; // Erlotinib
  const l2Desc = calculateSMILESDescriptors(l2Smiles);
  const l2Coords = generateConformerCoordinates('Erlotinib', l2Smiles, center1);

  const lig2 = {
    _id: 'lig_erlotinib',
    projectId: p1._id,
    name: 'Erlotinib (Tarceva)',
    compoundCode: 'RB-LIG-002',
    smiles: l2Smiles,
    formula: 'C22H23N3O4',
    iupacName: 'N-(3-ethynylphenyl)-6,7-bis(2-methoxyethoxy)quinazolin-4-amine',
    molecularWeight: 393.44,
    logP: 2.7,
    hbd: 1,
    hba: 6,
    tpsa: 74.7,
    rotatableBonds: 7,
    heavyAtomCount: 29,
    formalCharge: 0,
    conformers: [
      {
        conformerId: 1,
        energy_kcal_mol: -44.8,
        atoms: l2Coords.atoms,
        bonds: l2Coords.bonds,
      },
    ],
  };

  const l3Smiles = 'CN(C)CC=CC(=O)Nc1cc(Nc2ncc(Cl)c(Nc3ccccc3S(=O)(=O)C)n2)c(OC)cc1N1CCN(C)CC1'; // Osimertinib-like
  const l3Desc = calculateSMILESDescriptors(l3Smiles);
  const l3Coords = generateConformerCoordinates('RB-01-Novel', l3Smiles, center1);

  const lig3 = {
    _id: 'lig_rb01_lead',
    projectId: p1._id,
    name: 'Reborn-01 (Covalent-Reversible Analogue)',
    compoundCode: 'RB-LEAD-001',
    smiles: l3Smiles,
    formula: 'C28H33N7O2',
    iupacName: 'N-(2-{[2-(dimethylamino)ethyl](methyl)amino}-4-methoxy-5-{[4-(1-methyl-1H-indol-3-yl)pyrimidin-2-yl]amino}phenyl)acrylamide',
    molecularWeight: 499.6,
    logP: 3.4,
    hbd: 2,
    hba: 8,
    tpsa: 85.3,
    rotatableBonds: 8,
    heavyAtomCount: 37,
    formalCharge: 0,
    conformers: [
      {
        conformerId: 1,
        energy_kcal_mol: -56.3,
        atoms: l3Coords.atoms,
        bonds: l3Coords.bonds,
      },
    ],
  };

  // 4. DOCKING RUNS
  const dockingPoses1 = simulateDockingPoses(t1, lig1, t1.bindingPocket, 16);
  const dockRun1 = {
    _id: 'dock_egfr_gefitinib',
    projectId: p1._id,
    targetId: t1._id,
    ligandId: lig1._id,
    engine: 'AutoDock Vina v1.2.5 spec',
    scoringFunction: 'Vina Empirical Binding Affinity (kcal/mol)',
    searchBox: t1.bindingPocket,
    exhaustiveness: 16,
    numModes: 9,
    energyRange: 3.0,
    seed: 424242,
    poses: dockingPoses1,
  };

  // 5. ADMET PROFILES
  const admet1 = {
    _id: 'admet_gefitinib',
    projectId: p1._id,
    ligandId: lig1._id,
    ligandName: lig1.name,
    smiles: lig1.smiles,
    ...evaluateADMET(lig1),
    rank: 2,
  };

  const admet2 = {
    _id: 'admet_erlotinib',
    projectId: p1._id,
    ligandId: lig2._id,
    ligandName: lig2.name,
    smiles: lig2.smiles,
    ...evaluateADMET(lig2),
    rank: 3,
  };

  const admet3 = {
    _id: 'admet_rb01',
    projectId: p1._id,
    ligandId: lig3._id,
    ligandName: lig3.name,
    smiles: lig3.smiles,
    ...evaluateADMET(lig3),
    compositeScore: 92,
    rank: 1,
    candidateClassification: 'Lead Candidate',
  };

  // 6. VALIDATION REPORT (MD Trajectory & Redocking)
  const mdData = generateMDTimeseries();
  const valRep1 = {
    _id: 'val_egfr_1m17',
    projectId: p1._id,
    targetName: t1.name,
    leadLigandName: lig1.name,
    redockingCheck: {
      performed: true,
      referencePoseRmsd: 1.18,
      fidelityThreshold: 2.0,
      isFidelityPassed: true,
      crystalOverlayAgreementPct: 94.2,
      notes:
        'Crystallographic pose reproduced within 1.18 Å root-mean-square deviation, successfully meeting the gold-standard redocking acceptance benchmark (< 2.0 Å).',
    },
    molecularDynamics: {
      simulatedTimeNs: 100,
      ensemble: 'NPT, T = 300 K, P = 1.0 bar (Amber ff14SB & GAFF2)',
      solventModel: 'TIP3P Explicit Water with 0.15 M NaCl ionic neutralization',
      timeStepFs: 2.0,
      averageBackboneRmsd_A: 1.45,
      averageLigandRmsd_A: 1.12,
      averageRadiusOfGyration_A: 19.8,
      persistentHBondsAverage: 4.2,
      bindingFreeEnergy_MMPBSA_kcal_mol: {
        deltaG_bind: -42.8,
        vanDerWaals: -54.2,
        electrostatic: -18.6,
        polarSolvation: 33.4,
        nonpolarSolvation: -3.4,
      },
      trajectoryTimeSeries: mdData.trajectoryTimeSeries,
      rmsfPerResidue: mdData.rmsfPerResidue,
    },
    provenance: {
      workflowRunId: 'wf_egfr_run_01',
      pipelineEngine: 'Reborn Orchestration Core v1.0.0',
      dockingSpecification: 'AutoDock Vina v1.2.5 compliant',
      rdkitSpecification: 'RDKit release 2024.03.1',
      amberSpecification: 'AmberTools23 / GAFF2 parameters',
      randomSeed: 424242,
      sha256InputChecksum: 'a7b3d91f24c3e80918efbc0128913bba491873dc23450e189f78d6b91c28f09a',
      auditTimestamp: new Date(),
      reproducibilityGrade: 'A+ (100% Deterministic Provenance)',
    },
  };

  // 7. WORKFLOW RUN (8 STAGES)
  const wf1 = {
    _id: 'wf_egfr_run_01',
    projectId: p1._id,
    currentStage: 5,
    status: 'completed',
    stages: [
      {
        stageNumber: 1,
        name: 'Project Setup',
        status: 'completed',
        title: 'Project Parameterization & Pipeline Initialization',
        description: 'Target definition, therapeutic indication selection, and parameter space configuration.',
        durationMs: 1420,
        metrics: { indication: p1.diseaseIndication, target: t1.name },
      },
      {
        stageNumber: 2,
        name: 'Protein Input & Prep',
        status: 'completed',
        title: 'Macromolecular Receptor Preparation',
        description: 'RCSB 1M17 retrieval, hydrogen addition, Kollman charge assignment, and catalytic pocket grid definition.',
        durationMs: 3850,
        metrics: { pdbId: '1M17', atoms: t1.structureData.atomCount, pocketVolume: '890.0 Å³' },
      },
      {
        stageNumber: 3,
        name: 'Ligand Input & Conformer Prep',
        status: 'completed',
        title: 'Ligand Parsing & 3D Conformer Generation',
        description: 'SMILES topological parsing, descriptor evaluation, and low-energy conformer sampling.',
        durationMs: 2710,
        metrics: { ligandsLoaded: 3, leadSmiles: lig1.smiles },
      },
      {
        stageNumber: 4,
        name: 'Molecular Docking',
        status: 'completed',
        title: 'AutoDock Vina Search Grid Execution',
        description: 'Exhaustiveness 16 iterated over 9 conformational modes within the catalytic cleft.',
        durationMs: 9140,
        metrics: { topAffinity: `${dockingPoses1[0].affinity_kcal_mol} kcal/mol`, modesSampled: 9 },
      },
      {
        stageNumber: 5,
        name: 'Interaction Analysis',
        status: 'completed',
        title: 'Receptor-Ligand Contact Fingerprinting',
        description: 'Quantification of hinge hydrogen bonds, hydrophobic ceiling contacts, and aromatic pi-stacking.',
        durationMs: 2200,
        metrics: { hBondsCount: dockingPoses1[0].hBondCount, keyHingeResidue: 'Met793 (2.82 Å)' },
      },
      {
        stageNumber: 6,
        name: 'ADMET & Multi-Criteria Ranking',
        status: 'completed',
        title: 'Drug-likeness & ADMET Filtering',
        description: 'Lipinski Rule of 5, Veber oral bioavailability, PAINS alerts, and multi-objective weighted ranking.',
        durationMs: 1800,
        metrics: { leadRank: 'RB-01 (Score: 92/100)', lipinskiStatus: 'Passed (0 violations)' },
      },
      {
        stageNumber: 7,
        name: 'Advanced Validation',
        status: 'completed',
        title: '100ns MD Simulation & Redocking Benchmark',
        description: 'Amber ff14SB explicit solvent stability, backbone RMSD convergence, and crystallographic pose validation.',
        durationMs: 12500,
        metrics: { redockingRmsd: '1.18 Å', averageBackboneRmsd: '1.45 Å', deltaG_MMPBSA: '-42.8 kcal/mol' },
      },
      {
        stageNumber: 8,
        name: 'Reproducible Reporting',
        status: 'completed',
        title: 'Provenance Audit Trail & Export Package',
        description: 'Curated dossier with cryptographic checksums, version stamps, and interactive report rendering.',
        durationMs: 1100,
        metrics: { reproducibilityGrade: 'A+ Gold Standard', exportFormats: ['JSON', 'CSV', 'Dossier'] },
      },
    ],
    executionLogs: [
      {
        id: 'log_1',
        timestamp: new Date(Date.now() - 36000),
        stage: 1,
        level: 'info',
        message: 'Campaign initialized: Target EGFR Kinase (L858R / T790M) for NSCLC.',
      },
      {
        id: 'log_2',
        timestamp: new Date(Date.now() - 32000),
        stage: 2,
        level: 'success',
        message: 'Target 1M17 prepared: Gasteiger charges assigned; binding pocket centered at (22.5, 0.8, 52.3).',
      },
      {
        id: 'log_3',
        timestamp: new Date(Date.now() - 28000),
        stage: 3,
        level: 'info',
        message: 'Small molecules loaded: 3 candidate scaffolds parsed; 3D conformer generation completed.',
      },
      {
        id: 'log_4',
        timestamp: new Date(Date.now() - 20000),
        stage: 4,
        level: 'success',
        message: `Docking complete: Pose 1 affinity achieved ${dockingPoses1[0].affinity_kcal_mol} kcal/mol.`,
      },
      {
        id: 'log_5',
        timestamp: new Date(Date.now() - 15000),
        stage: 5,
        level: 'success',
        message: 'Binding contacts resolved: Critical Met793 hinge H-bond confirmed at 2.82 Å.',
      },
      {
        id: 'log_6',
        timestamp: new Date(Date.now() - 10000),
        stage: 6,
        level: 'success',
        message: 'ADMET evaluation finished: Lead compound RB-01 achieved composite score of 92/100.',
      },
      {
        id: 'log_7',
        timestamp: new Date(Date.now() - 5000),
        stage: 7,
        level: 'success',
        message: '100ns MD trajectory evaluated: System equilibrated with 1.45 Å backbone RMSD and 1.18 Å redocking fidelity.',
      },
      {
        id: 'log_8',
        timestamp: new Date(),
        stage: 8,
        level: 'info',
        message: 'Full audit dossier compiled with deterministic provenance hash.',
      },
    ],
  };

  // Save to Mock Store
  mockStore.saveProject(p1);
  mockStore.saveTarget(t1);
  mockStore.saveLigand(lig1);
  mockStore.saveLigand(lig2);
  mockStore.saveLigand(lig3);
  mockStore.saveWorkflow(wf1);
  mockStore.saveDockingRun(dockRun1);
  mockStore.saveAdmetProfile(admet1);
  mockStore.saveAdmetProfile(admet2);
  mockStore.saveAdmetProfile(admet3);
  mockStore.saveValidationReport(valRep1);

  // If MongoDB is connected, also mirror to MongoDB collections safely
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    try {
      await Project.deleteMany({});
      await Target.deleteMany({});
      await Ligand.deleteMany({});
      await WorkflowRun.deleteMany({});
      await DockingRun.deleteMany({});
      await AdmetProfile.deleteMany({});
      await ValidationReport.deleteMany({});

      await Project.create(p1);
      await Target.create(t1);
      await Ligand.create([lig1, lig2, lig3]);
      await WorkflowRun.create(wf1);
      await DockingRun.create(dockRun1);
      await AdmetProfile.create([admet1, admet2, admet3]);
      await ValidationReport.create(valRep1);

      console.log('[Reborn Seed] Successfully synced seed data to MongoDB database!');
    } catch (err) {
      console.log('[Reborn Seed] MongoDB sync skipped:', err.message);
    }
  } else {
    console.log('[Reborn Seed] MongoDB not active; seed data primed in-memory fallback store successfully.');
  }

  console.log('[Reborn Seed] Seeding complete. All 8 workflow stages primed and ready for interactive demonstration.');
}

// Allow direct CLI execution: `node src/utils/seedData.js`
if (process.argv[1]?.endsWith('seedData.js')) {
  seedDemoData()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
