import asyncHandler from "express-async-handler";
import Product from "../model/Product.js";

// Create new products
// POST/api/v1/products
export const createProductCtrl = asyncHandler(
    async (req , res) =>
    {
        const {
            name,
            description,
            category,
            sizes,
            colors,
            user,
            price,
            brand,
            totalQty
        } = req.body;

         // if product already exists throw error
        const productExists = await Product.findOne({name});
        if(productExists)
        {
            throw new Error("Product already Exists");
        }

        //Else create new product
        const product = await Product.create({
            name,
            description,
            category,
            sizes,
            colors,
            user : req.userAuthId,
            price,
            totalQty,
            brand,
        })

        // Push product into category
        res.json({
            status : "success",
            message : "Product created successfully",
            product,
        })
    }
);

export const getProductsCtrl = asyncHandler(
    async (req , res) =>
    {
        const products = await Product.find();

        res.json({
            status : "success",
            products
        })
    }
)