import { Request, Response } from 'express';
import { marketplaceService } from '../services/marketplace.service';
import { sendSuccess, asyncHandler } from '../utils/apiResponse';

export const marketplaceController = {
  getListings: asyncHandler(async (req: Request, res: Response) => {
    const { crop, state, district, quality, page, limit, lat, lng, maxDistanceKm } = req.query as Record<string, string>;
    const result = await marketplaceService.getListings({
      crop, state, district, quality,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 12,
      lat: lat ? parseFloat(lat) : undefined,
      lng: lng ? parseFloat(lng) : undefined,
      maxDistanceKm: maxDistanceKm ? parseInt(maxDistanceKm) : 200,
    });
    sendSuccess(res, result.data, 'Listings fetched', 200, { total: result.total, page: result.page, pages: result.pages });
  }),

  createListing: asyncHandler(async (req: Request, res: Response) => {
    const files = (req.files as Express.Multer.File[]) || [];
    const imageBuffers = files.map((f) => f.buffer);
    const listing = await marketplaceService.createListing(req.user!._id, req.body, imageBuffers);
    sendSuccess(res, listing, 'Listing created successfully 🛒', 201);
  }),

  updateListing: asyncHandler(async (req: Request, res: Response) => {
    const listing = await marketplaceService.updateListing(req.user!._id, req.params.id, req.body);
    sendSuccess(res, listing, 'Listing updated');
  }),

  deleteListing: asyncHandler(async (req: Request, res: Response) => {
    const result = await marketplaceService.deleteListing(req.user!._id, req.params.id);
    sendSuccess(res, result, 'Listing deleted');
  }),

  getListingById: asyncHandler(async (req: Request, res: Response) => {
    const { ListingModel } = await import('../models/Listing.model');
    const listing = await ListingModel.findById(req.params.id).populate('sellerId', 'name phone location');
    if (!listing) { res.status(404).json({ success: false, message: 'Listing not found', data: null }); return; }
    await marketplaceService.incrementViews(req.params.id);
    sendSuccess(res, listing, 'Listing fetched');
  }),
};
