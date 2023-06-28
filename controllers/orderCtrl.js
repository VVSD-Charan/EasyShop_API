import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
dotenv.config();
import Stripe from 'stripe';
import Order from "../model/Order.js";
import User from '../model/User.js';
import Product from '../model/Product.js';

//Stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

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

        //Convert orderItems to have same structure that stripe wants
        const convertedOrders =orderItems.map((item)=>
        {
            return {
                price_data : {
                    currency : "inr",
                    product_data : {
                        name : item?.name,
                        description: item?.description,   
                    },
                    unit_amount : item?.price * 100,
                },
                quantity : item?.qty,
            }
        });

        //Make payment using stripe
        const session = await stripe.checkout.sessions.create({
            line_items : convertedOrders,
            metadata : {
                orderId : JSON.stringify(order?._id),
            },
            mode : 'payment',
            success_url:'http://localhost:3000/success',
            cancel_url:'http://localhost:3000/cancel',
        });

        res.send({url : session.url});
    }
);

export const getAllordersCtrl = asyncHandler(
    async(req , res) =>
    {
        res.json({
            msg : "All orders"
        })
    }
);
