import User from "../model/User.js";
import bcrypt from 'bcryptjs';

// Register user router route end point : POST /api/v1/users/register
export const registerUserCtrl = async( req , res) =>
{
   const { fullname,email,password } = req.body;

   //Check if user exists
   const userExists = await User.findOne({ email });

   if(userExists)
   {
      // Then user cannot register again
      res.json(
        {
            msg : `User already exists with email ${email}`
        }
      )
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
   ).then(()=>
   {
    console.log("Data inserted");
   });

   res.status(201).json({
     status : "success",
     message : "User registered succesfully",
     data : user,
   });
};

// Login user router route end point : POST /api/v1/users/login
export const loginUserCtrl = async (req , res) =>
{
    const {email,password}=req.body;

    const userFound = await User.findOne({email});

    if(userFound && await bcrypt.compare(password,userFound.password))
    {
        res.json({
            status : "success" ,
            message : "Logged in succesfully !",
            userFound
        });
    }
    else
    {
        res.json({
            msg : "Invalid Login credentials"
        });
    }
}