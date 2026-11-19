import mongoose from 'mongoose';

const workflowRunSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
    },
    currentStage: {
      type: Number,
      default: 1,
      min: 1,
      max: 8,
    },
    status: {
      type: String,
      enum: ['idle', 'running', 'completed', 'paused', 'failed'],
      default: 'idle',
    },
    stages: [
      {
        stageNumber: Number,
        name: String,
        status: {
          type: String,
          enum: ['pending', 'in_progress', 'completed', 'warning'],
          default: 'pending',
        },
        title: String,
        description: String,
        startedAt: Date,
        completedAt: Date,
        durationMs: Number,
        metrics: mongoose.Schema.Types.Mixed,
      },
    ],
    executionLogs: [
      {
        id: String,
        timestamp: { type: Date, default: Date.now },
        stage: Number,
        level: {
          type: String,
          enum: ['info', 'success', 'warning', 'error'],
          default: 'info',
        },
        message: String,
        details: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true }
);

export const WorkflowRun = mongoose.model('WorkflowRun', workflowRunSchema);
