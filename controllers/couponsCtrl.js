import asyncHandler from 'express-async-handler';
import Coupon from "../model/Coupon.js";

//API end point to create coupon : POST /api/v1/coupons
export const createCouponCtrl = asyncHandler(
    async (req , res) =>
    {
        const {code, startDate , endDate , discount} = req.body;
        
        //Check if admin

        //Check if coupon already exists
        const couponExists = await Coupon.findOne({
            code
        });

        if(couponExists)
        {
            throw new Error("Coupon already exists");
        }

        //Check if discount is a number
        if(isNaN(discount))
        {
            throw new Error("Discount value must be a number");
        }

        //Create coupon
        const coupon = await Coupon.create({
            code, startDate , endDate , discount,
            user : req.userAuthId,
        });

        res.status(201).json({
            status : "success",
            message : "Coupon created successfully",
            coupon
        });
    }
);

//API endpoint to get all coupons : GET /api/v1/coupons
export const getAllCouponsCtrl = asyncHandler(
    async(req , res) =>
    {
        const coupons = await Coupon.find();

        res.status(200).json({
            status : "success",
            message : "All coupons",
            coupons
        });
    }
);