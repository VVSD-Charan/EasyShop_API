import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import dbConnect from '../config/dbConnect.js';
import { globalErrHandler, notFound } from '../middlewares/globalErrHandler.js';
import userRoutes from '../routes/usersRoute.js';
import productsRouter from '../routes/productsRoute.js';


dbConnect();
const app =express();

//Pass incoming data
app.use(express.json());

app.use("/api/v1/users/",userRoutes);
app.use("/api/v1/products/",productsRouter);

app.use(notFound);
app.use(globalErrHandler);

export default app;