import express from 'express';
import { createOrderCtrl,
    getAllordersCtrl 
} from '../controllers/orderCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const orderRouter = express.Router();

orderRouter.post('/', isLoggedIn ,createOrderCtrl);
orderRouter.get('/',isLoggedIn, getAllordersCtrl);

export default orderRouter;