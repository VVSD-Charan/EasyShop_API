import asyncHandler from 'express-async-handler';
import Order from "../model/Order.js";
import User from '../model/User.js';
import Product from '../model/Product.js';

//Endpoint for orders /api/v1/orders
export const createOrderCtrl = asyncHandler(
    async(req , res) =>
    {
        //Get payload (customer , orderItems,shipping address,totalprice)
        const { orderItems, shippingAddress,totalPrice } = req.body;

        //Find user who is placing order
        const user = await User.findById(req.userAuthId);

        //Check if user has a shipping address
        if(! user?.hasShippingAddress){
            throw new Error("Please provide shipping address");
        }
        
        //Check if order is not empty
        if(orderItems.length <= 0){
            throw new Error("No order Items");
        }

        //Place order - save into DB
        const order = await Order.create({
            user : user?._id,
            orderItems,
            shippingAddress,
            totalPrice
        });

        //Update product quantity
        const products = await Product.find({_id : { $in : orderItems}});

        orderItems?.map(async (order)=>
        {
            const product = products?.find((product)=>
            {
                return product?._id?.toString() === order?._id?.toString();
            });

            if(product){
                product.totalSold += order.qty;
            }

            await product.save();
        });

        //Push order into user
        user.orders.push(order?._id);
        await user.save();


        //Make payment using stripe
        //Payment webhook
        //Update user order

        res.json({
            success : true,
            message : "Order created",
            order,
            user
        });
    }
);
