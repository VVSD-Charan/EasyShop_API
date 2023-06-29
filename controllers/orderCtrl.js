import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
dotenv.config();
import Stripe from 'stripe';
import Order from "../model/Order.js";
import User from '../model/User.js';
import Product from '../model/Product.js';
import Coupon from '../model/Coupon.js';

//Stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

//Endpoint for orders /flex/orders
export const createOrderCtrl = asyncHandler(
    async(req , res) =>
    {

        //Get coupon
        const {coupon} =req?.query;

        const couponFound =await Coupon.findOne({
            code : coupon
        }); 

        if(couponFound?.isExpired)
        {
            throw new Error("Coupon has expired");
        }
        if(coupon.length>0 &&  !couponFound)
        {
            throw new Error("Coupon doesn't exist");
        }

        //Get discount
        const discount = couponFound? couponFound.discount/100 : 0;


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
            totalPrice : couponFound? totalPrice-totalPrice*discount:totalPrice
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

//API end point to get all orders: GET /flex/orders
export const getAllordersCtrl = asyncHandler(
    async(req , res) =>
    {
        const orders = await Order.find();

        res.json({
            success : true,
            message : "All orders",
            orders
        });
    }
);

//API end point to get a single order : /flex/orders/:id
export const getSingleOrderCtrl = asyncHandler(
    async(req , res) =>
    {
        const id = req.params.id;
        const order= await Order.findById(id);

        res.status(200).json({
            success : true,
            message : "Single order",
            order,
        });
    }
);

//API endpoint to update order : PUT /flex/orders/update/:id
export const updateOrderCtrl = asyncHandler(
    async(req , res) =>
    {
        const id = req.params.id;

        //Update order
        const updatedOrder = await Order.findByIdAndUpdate(id,{
            status : req.body.status,
        },{new : true});

        res.status(200).json({
            success : true,
            message : "Order updated",
            updatedOrder
        })
    }
);

// API end point to get total sales sum /flex/sales/stats
export const getOrderStatsCtrl = asyncHandler(
    async(req , res)=>
    {

        const orders = await Order.aggregate([
            {
                $group : {
                    _id : null,
                    minimumSale : {
                        $min : "$totalPrice",
                    },
                    totalSales : {
                        $sum : "$totalPrice",
                    },
                    maxSale : {
                        $max : "$totalPrice",
                    },
                    avgSale : {
                        $avg : "$totalPrice",
                    },
                }
            }
        ]);

        //Get todays sales
        const date=new Date();
        const today = new Date(date.getFullYear(),date.getMonth(),date.getDate());

        const saleToday = await Order.aggregate([{
            $match : {
                createdAt : {
                    $gte : today,
                },
            },
        },{
            $group : {
                _id : null,
                totalSales : {
                    $sum : "$totalPrice"
                }
            }
        }])

        res.status(200).json({
            success : true,
            message : "Sum , Minimum and maximum sales fetched",
            orders,
            saleToday
        });
    }
);