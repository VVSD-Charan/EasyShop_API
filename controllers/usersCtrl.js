import User from "../model/User.js";
import  asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

// Register user router route end point : POST /api/v1/users/register
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

// Login user router route end point : POST /api/v1/users/login
export const loginUserCtrl = asyncHandler
(
    async (req , res) =>
    {
        const {email,password}=req.body;

        const userFound = await User.findOne({email});

        if(userFound && await bcrypt.compare(password,userFound.password))
        {
            res.json({
                status : "success" ,
                message : "Logged in succesfully !",
                userFound,
                token : generateToken(userFound?._id)
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
        const token = getTokenFromHeader(req);
        const verified = verifyToken(token);

        res.json(
            {
                msg : "Welcome to profile page!"
            }
        )
    }
)