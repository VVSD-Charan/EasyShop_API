import asyncHandler from 'express-async-handler';
import Category from "../model/Category.js";

// category endpoint POST /api/v1/categories

export const createCategoryCtrl = asyncHandler(
    async (req , res) =>
    {
        const { name } = req.body;

        //Find category
        const categoryFound = await Category.findOne({name});

        // If category already exists dont create a new one
        if(categoryFound)
        {
            throw new Error("Category already exists");
        }

        //Create catgory
        const category = await Category.create({
            name ,
            user : req.userAuthId,
        });

        res.json({
            status : "success",
            message : "Category created successfully",
            category,
        })
    }
) ;

// Get all categories API end point : GET /api/v1/categories
export const getAllCategoriesCtrl = asyncHandler (
    async (req , res) =>
    {
        const categories =await Category.find();

        res.json({
            status : "success",
            message : " All categories have been fetched",
            categories
        })
    }
);

// Get single category API end point: GET /api/v1/categories/:id
export const getSingleCategoryCtrl = asyncHandler(
    async ( req , res) =>
    {
        const category = await Category.findById(req.params.id);

        res.json({
            status : "success",
            message : "Category has been fetched",
            category,
        })
    }
);

//Update category endpoint PUT /api/v1/categories/:id
export const updateCategoryCtrl = asyncHandler (
    async ( req , res) =>
    {
        const {name} = req.body;

        const category = await Category.findByIdAndUpdate(req.params.id,{name},{new:true});

        res.json({
            status : "success",
            message : "Category has been updated",
            category
        })
    }
);

// Delete category API end point DELETE /api/v1/categories/:id
export const deleteCategoryCtrl = asyncHandler(
    async (req , res) =>
    {
        const category = await Category.findByIdAndDelete(req.params.id);

        res.json({
            status : "success",
            message : "Category has been deleted successfully",
        })
    }
);