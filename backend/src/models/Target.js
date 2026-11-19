import mongoose from 'mongoose';

const targetSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    pdbId: {
      type: String,
      uppercase: true,
      trim: true,
    },
    title: {
      type: String,
      default: '',
    },
    organism: {
      type: String,
      default: 'Homo sapiens',
    },
    resolution: {
      type: Number,
      default: 2.0,
    },
    chains: [String],
    sequence: {
      type: String,
      default: '',
    },
    preparation: {
      isPrepared: { type: Boolean, default: true },
      missingAtomsFixed: { type: Boolean, default: true },
      hydrogensAdded: { type: Boolean, default: true },
      chargesAssigned: { type: Boolean, default: true },
      chargeModel: { type: String, default: 'Gasteiger / Kollman Unified' },
      protonationState: { type: String, default: 'pH 7.4 Physiological' },
      waterMoleculesStripped: { type: Boolean, default: true },
      energyMinimizationSteps: { type: Number, default: 500 },
      finalEnergy_kcal_mol: { type: Number, default: -1420.5 },
    },
    bindingPocket: {
      name: { type: String, default: 'Primary Orthosteric Catalytic Cleft' },
      center: {
        x: { type: Number, default: 22.5 },
        y: { type: Number, default: 0.8 },
        z: { type: Number, default: 52.3 },
      },
      size: {
        x: { type: Number, default: 20.0 },
        y: { type: Number, default: 20.0 },
        z: { type: Number, default: 20.0 },
      },
      volume: { type: Number, default: 850.0 }, // cubic angstroms
      druggabilityScore: { type: Number, default: 0.88 }, // 0 to 1
      keyResidues: [
        {
          name: String,
          number: Number,
          chain: String,
          role: String,
        },
      ],
    },
    structureData: {
      atomCount: { type: Number, default: 0 },
      residueCount: { type: Number, default: 0 },
      backbonePoints: [
        {
          x: Number,
          y: Number,
          z: Number,
          resName: String,
          resSeq: Number,
          chain: String,
          secStruct: String, // 'helix', 'sheet', 'loop'
        },
      ],
      atoms: [
        {
          id: Number,
          name: String,
          element: String,
          resName: String,
          resSeq: Number,
          chain: String,
          x: Number,
          y: Number,
          z: Number,
          bFactor: Number,
          charge: Number,
        },
      ],
    },
  },
  { timestamps: true }
);

export const Target = mongoose.model('Target', targetSchema);
