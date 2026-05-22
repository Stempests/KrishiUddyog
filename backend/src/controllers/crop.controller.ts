import { Request, Response } from 'express';
import { cropService } from '../services/crop.service';
import { sendSuccess, asyncHandler } from '../utils/apiResponse';

export const cropController = {
  recommend: asyncHandler(async (req: Request, res: Response) => {
    const result = await cropService.recommend(req.user!._id, req.body);
    sendSuccess(res, result, 'Crop recommendations generated successfully 🌾', 201);
  }),

  getHistory: asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await cropService.getHistory(req.user!._id, page, limit);
    sendSuccess(res, result.data, 'History fetched', 200, { total: result.total, page: result.page, pages: result.pages });
  }),

  getSeasonalCalendar: asyncHandler(async (req: Request, res: Response) => {
    const userReq = req as Request & { user?: { _id: string; role: string; name: string; language: string; location?: { state: string } } };
    const state = req.query.state as string || userReq.user?.location?.state || 'Unknown';
    const calendar = cropService.getSeasonalCalendar(state);
    sendSuccess(res, { state, calendar }, 'Seasonal calendar fetched');
  }),
};
