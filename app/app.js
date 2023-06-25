import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import dbConnect from '../config/dbConnect.js';
import { globalErrHandler } from '../middlewares/globalErrHandler.js';
import userRoutes from '../routes/usersRoute.js';


dbConnect();
const app =express();

//Pass incoming data
app.use(express.json());

app.use("/",userRoutes);
app.use(globalErrHandler);

export default app;