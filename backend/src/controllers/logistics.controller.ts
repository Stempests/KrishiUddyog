import { Request, Response } from 'express';
import { z } from 'zod';
import { TransportRouteModel } from '../models/TransportRoute.model';
import { sendSuccess, sendError, asyncHandler } from '../utils/apiResponse';

export const createRouteSchema = z.object({
  pickupLocation: z.string().min(2, 'Pickup location is required'),
  dropoffLocation: z.string().min(2, 'Dropoff location is required'),
  date: z.string().min(1, 'Date is required'),
  weight: z.string().min(1, 'Weight is required'),
});

export const logisticsController = {
  createRoute: asyncHandler(async (req: Request, res: Response) => {
    const { pickupLocation, dropoffLocation, date, weight } = req.body;

    const newRoute = await TransportRouteModel.create({
      userId: req.user!._id,
      pickupLocation,
      dropoffLocation,
      date: new Date(date),
      weight,
      // Default driver assignment to the user's name or leave unassigned
      driverName: req.user!.name,
    });

    sendSuccess(res, newRoute, 'Transport request created successfully', 201);
  }),

  getRoutes: asyncHandler(async (req: Request, res: Response) => {
    const { search } = req.query;
    
    let query: any = { status: 'active' };
    
    if (search && typeof search === 'string') {
      // Simple regex search on route string
      query.route = { $regex: search, $options: 'i' };
    }

    const routes = await TransportRouteModel.find(query)
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 })
      .limit(50);

    sendSuccess(res, routes, 'Routes fetched successfully');
  }),
};
