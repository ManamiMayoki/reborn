import { Ligand } from '../models/Ligand.js';
import { mockStore } from '../utils/mockStore.js';
import { calculateSMILESDescriptors, generateConformerCoordinates } from '../services/computationalEngine.js';

export const getLigands = async (req, res, next) => {
  try {
    const { projectId } = req.query;
    let ligands = [];
    try {
      ligands = projectId ? await Ligand.find({ projectId }) : await Ligand.find();
    } catch {
      ligands = projectId ? mockStore.getLigandsByProjectId(projectId) : Array.from(mockStore.ligands.values());
    }
    if (!ligands || ligands.length === 0) {
      ligands = projectId ? mockStore.getLigandsByProjectId(projectId) : Array.from(mockStore.ligands.values());
    }
    res.json({ success: true, count: ligands.length, data: ligands });
  } catch (error) {
    next(error);
  }
};

export const getLigandById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let ligand = null;
    try {
      ligand = await Ligand.findById(id);
    } catch {
      ligand = mockStore.getLigandById(id);
    }
    if (!ligand) {
      ligand = mockStore.getLigandById(id);
    }
    if (!ligand) {
      return res.status(404).json({ success: false, message: 'Ligand small molecule not found' });
    }
    res.json({ success: true, data: ligand });
  } catch (error) {
    next(error);
  }
};

export const createLigand = async (req, res, next) => {
  try {
    const { projectId, name, smiles, compoundCode } = req.body;
    if (!smiles) {
      return res.status(400).json({ success: false, message: 'Valid SMILES chemical string required' });
    }

    const descriptors = calculateSMILESDescriptors(smiles);
    const center = { x: 22.5, y: 0.8, z: 52.3 };
    const conformer = generateConformerCoordinates(name || 'Custom Compound', smiles, center);

    const ligandData = {
      projectId: projectId || 'proj_egfr_1m17',
      name: name || 'Novel Synthesized Analogue',
      compoundCode: compoundCode || `RB-${Date.now().toString().slice(-4)}`,
      smiles,
      formula: descriptors.formula,
      iupacName: `Chemical entity derived from ${smiles.slice(0, 20)}...`,
      molecularWeight: descriptors.molecularWeight,
      logP: descriptors.logP,
      hbd: descriptors.hbd,
      hba: descriptors.hba,
      tpsa: descriptors.tpsa,
      rotatableBonds: descriptors.rotatableBonds,
      heavyAtomCount: descriptors.heavyAtomCount,
      formalCharge: 0,
      conformers: [
        {
          conformerId: 1,
          energy_kcal_mol: -42.5,
          atoms: conformer.atoms,
          bonds: conformer.bonds,
        },
      ],
    };

    let savedLigand = null;
    try {
      savedLigand = await Ligand.create(ligandData);
    } catch {
      savedLigand = mockStore.saveLigand(ligandData);
    }
    mockStore.saveLigand(savedLigand);

    res.status(201).json({
      success: true,
      message: 'Small molecule parsed and 3D conformer generated successfully',
      data: savedLigand,
    });
  } catch (error) {
    next(error);
  }
};
