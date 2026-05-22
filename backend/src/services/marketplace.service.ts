import { v2 as cloudinary } from 'cloudinary';
import { ListingModel } from '../models/Listing.model';
import { logger } from '../utils/logger';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const CROP_HINDI: Record<string, string> = {
  Wheat: 'गेहूँ', Rice: 'चावल', Cotton: 'कपास', Sugarcane: 'गन्ना',
  Onion: 'प्याज', Potato: 'आलू', Tomato: 'टमाटर', Maize: 'मक्का',
  Soybean: 'सोयाबीन', Mustard: 'सरसों',
};

export const marketplaceService = {
  getListings: async (params: {
    crop?: string; state?: string; district?: string;
    quality?: string; page?: number; limit?: number;
    lat?: number; lng?: number; maxDistanceKm?: number;
  }) => {
    const { page = 1, limit = 12, lat, lng, maxDistanceKm = 200 } = params;
    const skip = (page - 1) * limit;

    let query: Record<string, unknown> = { status: 'active' };
    if (params.crop) query.cropName = new RegExp(params.crop, 'i');
    if (params.state) query['location.state'] = new RegExp(params.state, 'i');
    if (params.district) query['location.district'] = new RegExp(params.district, 'i');
    if (params.quality) query.quality = params.quality;

    let listings;
    if (lat && lng) {
      // Geo-near query
      listings = await ListingModel.aggregate([
        {
          $geoNear: {
            near: { type: 'Point', coordinates: [lng, lat] },
            distanceField: 'distance',
            maxDistance: maxDistanceKm * 1000,
            query,
            spherical: true,
          },
        },
        { $skip: skip },
        { $limit: limit },
      ]);
    } else {
      listings = await ListingModel.find(query)
        .populate('sellerId', 'name phone location')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    }

    const total = await ListingModel.countDocuments(query);

    return { data: listings, total, page, pages: Math.ceil(total / limit) };
  },

  createListing: async (
    sellerId: string,
    data: Partial<typeof ListingModel.prototype>,
    imageBuffers: Buffer[]
  ) => {
    const imageUrls: string[] = [];

    // Upload images to Cloudinary
    for (const buffer of imageBuffers.slice(0, 5)) {
      try {
        const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'krishiuddyog/marketplace' },
            (err, res) => { if (err || !res) reject(err); else resolve(res as { secure_url: string }); }
          );
          stream.end(buffer);
        });
        imageUrls.push(result.secure_url);
      } catch (e) {
        logger.warn('Image upload failed for listing');
      }
    }

    const cropName = (data as Record<string, string>).cropName || '';
    const listing = await ListingModel.create({
      sellerId,
      ...data,
      cropNameHindi: CROP_HINDI[cropName] || '',
      images: imageUrls,
    });

    return listing;
  },

  updateListing: async (sellerId: string, listingId: string, updates: Record<string, unknown>) => {
    const listing = await ListingModel.findOneAndUpdate(
      { _id: listingId, sellerId },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!listing) throw Object.assign(new Error('Listing not found or unauthorized'), { statusCode: 404 });
    return listing;
  },

  deleteListing: async (sellerId: string, listingId: string) => {
    const listing = await ListingModel.findOneAndDelete({ _id: listingId, sellerId });
    if (!listing) throw Object.assign(new Error('Listing not found or unauthorized'), { statusCode: 404 });
    return { deleted: true };
  },

  incrementViews: async (listingId: string) => {
    await ListingModel.findByIdAndUpdate(listingId, { $inc: { views: 1 } });
  },
};
