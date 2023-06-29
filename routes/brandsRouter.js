import express from 'express';
import { createBrandCtrl,
    getAllBrandsCtrl,
    getSingleBrandCtrl,
    deleteBrandCtrl,
    updateBrandCtrl
} from '../controllers/brandsCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import isAdmin from '../middlewares/isAdmin.js';

const brandsRouter = express.Router();

brandsRouter.post('/',isLoggedIn, isAdmin ,createBrandCtrl);
brandsRouter.get('/',getAllBrandsCtrl);
brandsRouter.get('/:id',getSingleBrandCtrl);
brandsRouter.delete('/:id',isLoggedIn, isAdmin ,deleteBrandCtrl);
brandsRouter.put('/:id',isLoggedIn, isAdmin ,updateBrandCtrl);

export default brandsRouter;