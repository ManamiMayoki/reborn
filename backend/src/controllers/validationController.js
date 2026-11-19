import { ValidationReport } from '../models/ValidationReport.js';
import { mockStore } from '../utils/mockStore.js';

export const getValidationReport = async (req, res, next) => {
  try {
    const { projectId } = req.query;
    let report = null;

    if (projectId) {
      try {
        report = await ValidationReport.findOne({ projectId });
      } catch {
        report = mockStore.getValidationReportByProjectId(projectId);
      }
      if (!report) report = mockStore.getValidationReportByProjectId(projectId);
    }

    if (!report) {
      report = Array.from(mockStore.validationReports.values())[0];
    }

    if (!report) {
      return res.status(404).json({ success: false, message: 'Validation report not found' });
    }

    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};
