import mongoose from 'mongoose';

const ligandSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    compoundCode: {
      type: String,
      default: '',
    },
    smiles: {
      type: String,
      required: true,
    },
    formula: {
      type: String,
      default: '',
    },
    iupacName: {
      type: String,
      default: '',
    },
    molecularWeight: {
      type: Number,
      required: true,
    },
    logP: {
      type: Number,
      required: true,
    },
    hbd: {
      type: Number,
      default: 0,
    },
    hba: {
      type: Number,
      default: 0,
    },
    tpsa: {
      type: Number,
      default: 0,
    },
    rotatableBonds: {
      type: Number,
      default: 0,
    },
    heavyAtomCount: {
      type: Number,
      default: 0,
    },
    formalCharge: {
      type: Number,
      default: 0,
    },
    conformers: [
      {
        conformerId: { type: Number, default: 1 },
        energy_kcal_mol: { type: Number, default: 0 },
        atoms: [
          {
            id: Number,
            element: String,
            name: String,
            x: Number,
            y: Number,
            z: Number,
            charge: Number,
          },
        ],
        bonds: [
          {
            source: Number,
            target: Number,
            order: { type: Number, default: 1 }, // 1=single, 2=double, 3=triple, 1.5=aromatic
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export const Ligand = mongoose.model('Ligand', ligandSchema);
