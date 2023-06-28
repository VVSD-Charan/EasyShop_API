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
            code : code?.toUpperCase() , startDate , endDate , discount,
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

//Get single coupon API end point GET /api/v1/coupons/:id
export const getSingleCouponCtrl = asyncHandler(
    async(req , res) =>
    {
        const coupon = await Coupon.findById(req.params.id);

        res.json({
            status : "success",
            message : "Coupon is fetched successfully",
            coupon
        });
    }
);

//Update coupon API end point PUT /api/v1/coupons/update/:id
export const updateCouponCtrl = asyncHandler(
    async(req , res) =>
    {
        const {code, startDate , endDate , discount} = req.body;
        const coupon = await Coupon.findByIdAndUpdate(req.params.id,{
            code : code?.toUpperCase(),
            discount,
            startDate,
            endDate,
        },{
            new : true,
        });

        res.json({
            status : "success",
            message : "Coupon fetched successfully",
            coupon
        });
    }
);

//Delete coupon API end point GET /api/v1/coupons/delete/:id
export const deleteCouponCtrl = asyncHandler(
    async(req , res) =>
    {
        const coupon =await Coupon.findByIdAndDelete(req.params.id);

        res.json({
            status : "success",
            message : "Coupon has been deleted successfully",
            coupon
        });
    }
);