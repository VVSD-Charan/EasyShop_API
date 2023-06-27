import asyncHandler from 'express-async-handler';
import Review from "../model/Review.js";

export const createReviewCtrl = asyncHandler(
    async(req , res) =>
    {
        res.json({
            msg : "Review Ctrl"
        })
    }
);