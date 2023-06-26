import asyncHandler from 'express-async-handler';
import Category from "../model/Category.js";

// category endpoint /api/v1/categories

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