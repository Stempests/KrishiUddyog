import { Request, Response } from 'express';
import { mandiService } from '../services/mandi.service';
import { sendSuccess, asyncHandler } from '../utils/apiResponse';

export const mandiController = {
  getPrices: asyncHandler(async (req: Request, res: Response) => {
    const { commodity, state, district } = req.query as Record<string, string>;
    const result = await mandiService.getPrices({ commodity, state, district });
    sendSuccess(res, result.data, `Mandi prices fetched (${result.source})`, 200, { source: result.source });
  }),

  getTrending: asyncHandler(async (req: Request, res: Response) => {
    const result = await mandiService.getTrending();
    sendSuccess(res, result, 'Trending commodities fetched');
  }),

  getCommodities: asyncHandler(async (_req: Request, res: Response) => {
    const commodities = mandiService.getCommodities();
    sendSuccess(res, commodities, 'Commodities list fetched');
  }),
};
