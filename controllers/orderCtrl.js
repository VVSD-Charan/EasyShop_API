import asyncHandler from 'express-async-handler';
import Order from "../model/Order.js";

//Endpoint for orders /api/v1/orders
export const createOrderCtrl = asyncHandler(
    async(req , res) =>
    {
        res.json({
            msg : "Order Controller",
        })
    }
);
