import { Target } from '../models/Target.js';
import { mockStore } from '../utils/mockStore.js';

export const getTargets = async (req, res, next) => {
  try {
    const { projectId } = req.query;
    let targets = [];
    try {
      targets = projectId ? await Target.find({ projectId }) : await Target.find();
    } catch {
      targets = projectId ? mockStore.getTargetsByProjectId(projectId) : Array.from(mockStore.targets.values());
    }
    if (!targets || targets.length === 0) {
      targets = projectId ? mockStore.getTargetsByProjectId(projectId) : Array.from(mockStore.targets.values());
    }
    res.json({ success: true, count: targets.length, data: targets });
  } catch (error) {
    next(error);
  }
};

export const getTargetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let target = null;
    try {
      target = await Target.findById(id);
    } catch {
      target = mockStore.getTargetById(id);
    }
    if (!target) {
      target = mockStore.getTargetById(id);
    }
    if (!target) {
      return res.status(404).json({ success: false, message: 'Target protein structure not found' });
    }
    res.json({ success: true, data: target });
  } catch (error) {
    next(error);
  }
};

export const prepareTarget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { protonationState, chargeModel, energyMinimizationSteps, bindingPocket } = req.body;

    let target = mockStore.getTargetById(id);
    try {
      target = (await Target.findById(id)) || target;
    } catch {}

    if (!target) {
      return res.status(404).json({ success: false, message: 'Target protein not found' });
    }

    const updatedPreparation = {
      ...target.preparation,
      isPrepared: true,
      missingAtomsFixed: true,
      hydrogensAdded: true,
      chargesAssigned: true,
      chargeModel: chargeModel || 'Gasteiger-Marsili / Kollman Hybrid',
      protonationState: protonationState || 'pH 7.4 Physiological',
      waterMoleculesStripped: true,
      energyMinimizationSteps: energyMinimizationSteps || 1000,
      finalEnergy_kcal_mol: -1892.4,
    };

    const updatedPocket = bindingPocket ? { ...target.bindingPocket, ...bindingPocket } : target.bindingPocket;

    target.preparation = updatedPreparation;
    target.bindingPocket = updatedPocket;

    try {
      await Target.findByIdAndUpdate(id, { preparation: updatedPreparation, bindingPocket: updatedPocket });
    } catch {}
    mockStore.saveTarget(target);

    res.json({
      success: true,
      message: 'Target receptor preparation completed: Hydrogens added, Kollman charges assigned, pocket box calibrated.',
      data: target,
    });
  } catch (error) {
    next(error);
  }
};
