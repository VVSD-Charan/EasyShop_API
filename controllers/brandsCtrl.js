import asyncHandler from 'express-async-handler';
import Brand from '../model/Brand.js';

// category endpoint POST /api/v1/categories

export const createBrandCtrl = asyncHandler(
    async (req , res) =>
    {
        const { name } = req.body;

        //Find category
        const brandFound = await Brand.findOne({name});

        // If category already exists dont create a new one
        if(brandFound)
        {
            throw new Error("Brand already exists");
        }

        //Create catgory
        const brand = await Brand.create({
            name : name.toLowerCase() ,
            user : req.userAuthId,
        });

        res.json({
            status : "success",
            message : "Brand created successfully",
            brand,
        })
    }
) ;

// Get all categories API end point : GET /api/v1/categories
export const getAllBrandsCtrl = asyncHandler (
    async (req , res) =>
    {
        const brands =await Brand.find();

        res.json({
            status : "success",
            message : " All brands have been fetched",
            brands
        })
    }
);

// Get single category API end point: GET /api/v1/categories/:id
export const getSingleBrandCtrl = asyncHandler(
    async ( req , res) =>
    {
        const brand = await Brand.findById(req.params.id);

        res.json({
            status : "success",
            message : "Brand has been fetched",
            brand,
        })
    }
);

//Update category endpoint PUT /api/v1/categories/:id
export const updateBrandCtrl = asyncHandler (
    async ( req , res) =>
    {
        const {name} = req.body;

        const brand = await Brand.findByIdAndUpdate(req.params.id,{name},{new:true});

        res.json({
            status : "success",
            message : "Brand has been updated",
            brand
        })
    }
);

// Delete category API end point DELETE /api/v1/categories/:id
export const deleteBrandCtrl = asyncHandler(
    async (req , res) =>
    {
        const brand = await Brand.findByIdAndDelete(req.params.id);

        res.json({
            status : "success",
            message : "Brand has been deleted successfully",
        })
    }
);