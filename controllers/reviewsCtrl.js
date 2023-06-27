import asyncHandler from 'express-async-handler';
import Review from "../model/Review.js";
import Product from '../model/Product.js';

export const createReviewCtrl = asyncHandler(
    async(req , res) =>
    {
        const {productID} =req.params;
        const {product , message , rating}=req.body;

        const productFound = await Product.findById(productID);

        if(!productFound)
        {
            throw new Error("Product Not Found");
        }

        //Check if user already reviewed this product

        //Create review
        const review = await Review.create({
            message,
            rating,
            product: productFound?._id,
            user: req.userAuthId
        });

        //Push review into product found
        productFound.reviews.push(review?._id);

        //resave
        productFound.save();

        res.status(201).json({
            success : true,
            message : "Review created successfully"
        })
    }
);