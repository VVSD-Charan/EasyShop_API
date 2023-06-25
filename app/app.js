import express from 'express';

import dotenv from 'dotenv';
dotenv.config();

import dbConnect from '../config/dbConnect.js';


dbConnect();
const app =express();

export default app;