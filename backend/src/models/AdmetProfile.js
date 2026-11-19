import mongoose from 'mongoose';

const admetProfileSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
    },
    ligandId: {
      type: String,
      required: true,
    },
    ligandName: {
      type: String,
      required: true,
    },
    smiles: String,
    rules: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    admetProperties: {
      absorption: {
        caco2Permeability_cm_s: Number,
        humanIntestinalAbsorptionPct: Number,
        pgpSubstrate: Boolean,
        pgpInhibitor: Boolean,
      },
      distribution: {
        bbbPermeable: Boolean,
        logBB: Number,
        plasmaProteinBindingPct: Number,
        volumeOfDistribution_L_kg: Number,
      },
      metabolism: {
        cyp1a2_inhibitor: Boolean,
        cyp2c9_inhibitor: Boolean,
        cyp2d6_inhibitor: Boolean,
        cyp3a4_inhibitor: Boolean,
        cyp3a4_substrate: Boolean,
      },
      excretion: {
        totalClearance_ml_min_kg: Number,
        halfLife_hours: Number,
        renalClearance_ml_min: Number,
      },
      toxicity: {
        hergRisk: { type: String, enum: ['Low', 'Moderate', 'High'] },
        amesMutagenic: Boolean,
        hepatotoxicityRisk: { type: String, enum: ['Low', 'Moderate', 'High'] },
        skinSensitization: Boolean,
        maximumRecommendedDailyDose_mg: Number,
      },
    },
    radarMetrics: {
      lipophilicity: Number, // 0 - 100
      size: Number,
      polarity: Number,
      solubility: Number,
      flexibility: Number,
      saturation: Number,
    },
    compositeScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    rank: {
      type: Number,
      default: 1,
    },
    candidateClassification: {
      type: String,
      enum: ['Lead Candidate', 'Backup Candidate', 'Requires Optimization', 'Deprioritized'],
      default: 'Lead Candidate',
    },
  },
  { timestamps: true }
);

export const AdmetProfile = mongoose.model('AdmetProfile', admetProfileSchema);
