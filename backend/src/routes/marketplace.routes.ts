import { Router } from 'express';
import { marketplaceController } from '../controllers/marketplace.controller';
import { protect } from '../middleware/auth.middleware';
import { uploadMultiple } from '../middleware/upload.middleware';

const router = Router();

// Public routes
router.get('/listings', marketplaceController.getListings);
router.get('/listings/:id', marketplaceController.getListingById);

// Protected routes (farmer/buyer required)
router.post('/listings', protect, uploadMultiple, marketplaceController.createListing);
router.put('/listings/:id', protect, marketplaceController.updateListing);
router.delete('/listings/:id', protect, marketplaceController.deleteListing);

export default router;
