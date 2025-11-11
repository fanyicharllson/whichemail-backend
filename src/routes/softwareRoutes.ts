import { Router } from 'express';
import { 
  getAllSoftware, 
  getSoftwareById, 
  getSoftwareBySlug,
  getAllCategories,
  getFeaturedSoftware
} from '../controllers/softwareController';

const router = Router();

// Software routes
router.get('/software', getAllSoftware);
router.get('/software/featured', getFeaturedSoftware); 
router.get('/software/:id', getSoftwareById);
router.get('/software/slug/:slug', getSoftwareBySlug);

// Category routes
router.get('/categories', getAllCategories);

export default router;