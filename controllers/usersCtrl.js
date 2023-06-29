import User from "../model/User.js";
import  asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

// Register user router route end point : POST /flex/users/register
export const registerUserCtrl = asyncHandler(
    async( req , res) =>
    {
        const { fullname,email,password } = req.body;

        //Check if user exists
        const userExists = await User.findOne({ email });

        if(userExists)
        {
            // Then user cannot register again
            throw new Error("A user already exists with this email");
        }

        // If this mail is not used , register user
        // Hash password and register user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        // Add new user to DB
        const user = await User.create(
        {
            fullname,
            email,
            password : hashedPassword,
        }
   );

   res.status(201).json({
     status : "success",
     message : "User registered succesfully",
     data : user,
   });
}
);

// Login user router route end point : POST /flex/users/login
export const loginUserCtrl = asyncHandler
(
    async (req , res) =>
    {
        const {email,password}=req.body;

        const userFound = await User.findOne({email});
        const generatedToken = generateToken(userFound?._id);

        if(userFound && await bcrypt.compare(password,userFound.password))
        {
            res.json({
                status : "success" ,
                message : "Logged in succesfully !",
                userFound,
                token : generatedToken,
            });
        }
        else
        {
            throw new Error("Invalid login credentials");
        }
    }
);

export const getUserProfileCtrl = asyncHandler(
    async (req , res) =>
    {
       //Find user
       const user = await User.findById(req.userAuthId).populate('orders');

       res.json({
        status : "success",
        message : "User profile fetched successfully",
        user,
       });
    }
);

// API end point to update shipping address PUT /flex/users/update/shipping
export const updateShippingAddressCtrl = asyncHandler(
    async(req , res) =>
    {
        const {
            firstName,
            lastName,
            address,
            city,
            postalCode,
            province,
            phone
        } = req.body;

        const user = await User.findByIdAndUpdate(req.userAuthId,{
            shippingAddress : {
                firstName,
                lastName,
                address,
                city,
                postalCode,
                province,
                phone
            },
            hasShippingAddress : true
        },{
            new:true
        });

        res.json({
            status : "success",
            mesage : "Shipping address has been updated",
            user
        })
    }
);