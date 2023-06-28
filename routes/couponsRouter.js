import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createCouponCtrl } from '../controllers/couponsCtrl.js';

const couponRouter = express.Router();

couponRouter.post('/',isLoggedIn,createCouponCtrl);

export default couponRouter;