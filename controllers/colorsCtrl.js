import asyncHandler from 'express-async-handler';
import Color from '../model/Color.js';

// Colors endpoint POST /api/v1/colors

export const createColorCtrl = asyncHandler(
    async (req , res) =>
    {
        const { name } = req.body;

        //Find Color
        const colorFound = await Color.findOne({name});

        // If Color already exists dont create a new one
        if(colorFound)
        {
            throw new Error("Color already exists");
        }

        //Create color
        const color = await Color.create({
            name : name.toLowerCase() ,
            user : req.userAuthId,
        });

        res.json({
            status : "success",
            message : "Color created successfully",
            color,
        })
    }
) ;

// Get all categories API end point : GET /api/v1/colors
export const getAllColorsCtrl = asyncHandler (
    async (req , res) =>
    {
        const colors =await Color.find();

        res.json({
            status : "success",
            message : " All colors have been fetched",
            colors
        })
    }
);

// Get single Color API end point: GET /api/v1/colors/:id
export const getSingleColorCtrl = asyncHandler(
    async ( req , res) =>
    {
        const color = await Color.findById(req.params.id);

        res.json({
            status : "success",
            message : "Color has been fetched",
            color,
        })
    }
);

//Update Color endpoint PUT /api/v1/colors/:id
export const updateColorCtrl = asyncHandler (
    async ( req , res) =>
    {
        const {name} = req.body;

        const color = await Color.findByIdAndUpdate(req.params.id,{name},{new:true});

        res.json({
            status : "success",
            message : "Color has been updated",
            color
        })
    }
);

// Delete Color API end point DELETE /api/v1/colors/:id
export const deleteColorCtrl = asyncHandler(
    async (req , res) =>
    {
        const color = await Color.findByIdAndDelete(req.params.id);

        res.json({
            status : "success",
            message : "Color has been deleted successfully",
        })
    }
);