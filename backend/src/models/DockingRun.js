import mongoose from 'mongoose';

const dockingRunSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
    },
    targetId: {
      type: String,
      required: true,
    },
    ligandId: {
      type: String,
      required: true,
    },
    engine: {
      type: String,
      default: 'AutoDock Vina v1.2.5 spec',
    },
    scoringFunction: {
      type: String,
      default: 'Vina Empirical Free Energy (kcal/mol)',
    },
    searchBox: {
      center: { x: Number, y: Number, z: Number },
      size: { x: Number, y: Number, z: Number },
    },
    exhaustiveness: {
      type: Number,
      default: 16,
    },
    numModes: {
      type: Number,
      default: 9,
    },
    energyRange: {
      type: Number,
      default: 3.0,
    },
    seed: {
      type: Number,
      default: 424242,
    },
    poses: [
      {
        poseRank: Number,
        affinity_kcal_mol: Number,
        rmsd_lb: Number, // lower bound rmsd to mode 1
        rmsd_ub: Number, // upper bound rmsd to mode 1
        ligandEfficiency: Number, // affinity / heavy atoms
        torsionalStrain_kcal_mol: Number,
        hBondCount: Number,
        atoms: [
          {
            id: Number,
            element: String,
            name: String,
            x: Number,
            y: Number,
            z: Number,
          },
        ],
        bonds: [
          {
            source: Number,
            target: Number,
            order: Number,
          },
        ],
        interactions: [
          {
            type: {
              type: String,
              enum: ['hydrogen_bond', 'hydrophobic', 'salt_bridge', 'pi_stacking', 'halogen_bond'],
            },
            residueName: String,
            residueSeq: Number,
            chain: String,
            atomTarget: String,
            atomLigand: String,
            distance_angstrom: Number,
            energyContribution_kcal_mol: Number,
            description: String,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export const DockingRun = mongoose.model('DockingRun', dockingRunSchema);
