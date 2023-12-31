import asyncHandler from "express-async-handler";
import Product from "../model/Product.js";
import Category from "../model/Category.js";
import Brand from "../model/Brand.js";

// Create new products
// POST/flex/products
export const createProductCtrl = asyncHandler(
    async (req , res) =>
    {
        const convertedImgs = req.files.map((file) => file?.path)
        console.log(convertedImgs);
        const {
            name,
            description,
            category,
            sizes,
            colors,
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

        //Check if brand exists
        const brandFound = await Brand.findOne({
            name: brand?.toLowerCase(),
        });
        //If brand doesn't exists then ask user to create a brand
        if(!brandFound){
            throw new Error("Brand not found! Please create a new brand or check brand name")
        }

        //Find category of product
        const categoryFound = await Category.findOne({name:category});

        //If category of product is not found, ask user to create a category or add existing category
        if(!categoryFound)
        {
            throw new Error("Category not found!. Create a new category or add existing category");
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
            images : convertedImgs
        })

        // Push product into category
        categoryFound.products.push(product._id);
        // save category
        await categoryFound.save();

        //Push product into brand
        brandFound.products.push(product._id);
        await brandFound.save();

        res.json({
            status : "success",
            message : "Product created successfully",
            product,
        })
    }
);

//API end point for get products GET /flex/products
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

        //Pagination
        //Page numbers in products (default is 1)
        const page = parseInt(req.query.page)? parseInt(req.query.page):1;
        //Limit to number of products per page
        const limit=parseInt(req.query.limit)? parseInt(req.query.limit):10;
        // Start index of product in a page
        const startIndex = (page-1)*limit;
        //End index of product in a page
        const endIndex = (page*limit);
        //Total number of documents
        const total = await Product.countDocuments();

        //Pagination results
        const pagination = {};

        if(endIndex < total)
        {
            pagination.next = {
                page : page+1 ,
                limit 
            };
        }

        if(startIndex > 0)
        {
            pagination.next = {
                page : page-1 ,
                limit
            };
        }

        productQuery=productQuery.skip(startIndex).limit(limit);
        const products = await productQuery.populate('reviews');

        res.json({
            status : "success",
            total,
            results : products.length,
            pagination,
            message : "Products fetched succesfully",
            products
        });
    }
);

// API endpoint for get single product GET /flex/products/:id
export const getProductCtrl = asyncHandler(
    async (req , res) =>
    {
        const product = await Product.findById(req.params.id).populate("reviews");

        if(!product)
        {
            throw new Error(`There is not product with id ${req.params.id}`)
        }

        res.json({
            status : "success",
            message : "Product fetched successfully",
            product
        })
    }
); 


//API end point to update product : PUT /flex/products/:id
export const updateProductCtrl = asyncHandler(
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

        //Update product
        const product = await Product.findByIdAndUpdate(req.params.id , {
            name,
            description,
            category,
            sizes,
            colors,
            user,
            price,
            brand,
            totalQty 
        },{
            new:true
        });

        res.json({
            status : "success",
            message : "Product updated successfully",
            product,
        });
    }
);


//API endpoint to delete product : DELETE /flex/products/:id/delete
export const deleteProductCtrl = asyncHandler(
    async(req , res) => {
        const product = await Product.findByIdAndDelete(req.params.id);

        res.json({
            status : "success",
            message : "Product deleted successfully",
        })
    }
);