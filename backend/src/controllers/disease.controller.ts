import { Request, Response } from 'express';
import { diseaseService } from '../services/disease.service';
import { sendSuccess, sendError, asyncHandler } from '../utils/apiResponse';

export const diseaseController = {
  detect: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      sendError(res, 'Image is required for disease detection', 400);
      return;
    }

    const { cropType, state, district } = req.body;
    if (!cropType) {
      sendError(res, 'Crop type is required', 400);
      return;
    }

    const result = await diseaseService.detect(
      req.user!._id,
      req.file.buffer,
      cropType,
      { state: state || '', district: district || '' }
    );

    sendSuccess(res, result, 'Disease analysis complete 🔬', 201);
  }),

  getReports: asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await diseaseService.getReports(req.user!._id, page, limit);
    sendSuccess(res, result.data, 'Reports fetched', 200, { total: result.total, page: result.page, pages: result.pages });
  }),

  getReportById: asyncHandler(async (req: Request, res: Response) => {
    const report = await diseaseService.getReportById(req.user!._id, req.params.id);
    sendSuccess(res, report, 'Report fetched');
  }),
};
