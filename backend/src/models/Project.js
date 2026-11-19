import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    diseaseIndication: {
      type: String,
      default: 'General Oncology / Target Validation',
    },
    targetId: {
      type: String,
      default: null,
    },
    activeWorkflowStep: {
      type: Number,
      default: 1,
      min: 1,
      max: 8,
    },
    status: {
      type: String,
      enum: ['draft', 'in_progress', 'docking_completed', 'validated', 'reported'],
      default: 'in_progress',
    },
    tags: [String],
    settings: {
      dockingEngine: { type: String, default: 'AutoDock Vina v1.2.5' },
      forceField: { type: String, default: 'Amber ff14SB / GAFF2' },
      exhaustiveness: { type: Number, default: 16 },
      randomSeed: { type: Number, default: 4242 },
    },
  },
  { timestamps: true }
);

export const Project = mongoose.model('Project', projectSchema);
