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
        let productQuery = Product.find();

        //Searching products by name
        if(req.query.name)
        {
            productQuery=productQuery.find({
                name : {$regex : req.query.name , $options:"i"},
            })
        }

        //filtering products by name
        if(req.query.brand)
        {
            productQuery=productQuery.find({
                brand : {$regex : req.query.brand , $options:"i"},
            })
        }

        //filtering products by category
        if(req.query.category)
        {
            productQuery=productQuery.find({
                category : {$regex : req.query.category , $options:"i"},
            })
        }

        //filtering products by color
        if(req.query.colors)
        {
            productQuery=productQuery.find({
                colors : {$regex : req.query.colors , $options:"i"},
            })
        }

        //filtering products by sizes
        if(req.query.sizes)
        {
            productQuery=productQuery.find({
                sizes : {$regex : req.query.sizes , $options:"i"},
            })
        }

        //filter by price range
        //Price range url end point is {BaseURL}/products/price=a-b
        if(req.query.price)
        {
            //Split a-b with - to get a and b
            const priceRange = req.query.price.split("-");
            productQuery=productQuery.find({
                price : { $gte: priceRange[0] , $lte : priceRange[1]}
            });
        }


        const products = await productQuery;

        res.json({
            status : "success",
            products
        })
    }
)