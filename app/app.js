import dotenv from 'dotenv';
import Stripe from 'stripe';
dotenv.config();
import express from 'express';
import dbConnect from '../config/dbConnect.js';
import { globalErrHandler, notFound } from '../middlewares/globalErrHandler.js';
import userRoutes from '../routes/usersRoute.js';
import productsRouter from '../routes/productsRoute.js';
import categoriesRouter from '../routes/categoriesRouter.js';
import brandsRouter from '../routes/brandsRouter.js';
import colorsRouter from '../routes/colorRouter.js';
import reviewRouter from '../routes/reviewRouter.js';
import orderRouter from '../routes/ordersRouter.js';
import Order from '../model/Order.js';
import couponRouter from '../routes/couponsRouter.js';

dbConnect();
const app =express();

//Stripe web hook
const stripe = new Stripe(process.env.STRIPE_KEY);


// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_7f5c646f172ae871cfd0d34d829c0ad4590d5847dda0e3fdce1bf05acfee9e70";

app.post('/webhook', express.raw({type: 'application/json'}), 
  async (request, response) => {

  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    console.log("event");
  } catch (err) {
    console.log("err",err.message);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if(event.type === 'checkout.session.completed')
  {
    //Update order
    const session = event.data.object;
    const {orderId} = session.metadata;
    const paymentStatus = session.payment_status;
    const paymentMethod = session.payment_method_types[0];
    const totalAmount = session.amount_total;
    const currency = session.currency;

    //Find order 
    const order = await Order.findByIdAndUpdate(JSON.parse(orderId),{
      totalPrice : totalAmount / 100,
      currency,
      paymentMethod,
      paymentStatus
    },{new:true});

    console.log(order);

  }
  else
  {
    return ;
  }

  // // Handle the event
  // switch (event.type) {
  //   case 'payment_intent.succeeded':
  //     const paymentIntentSucceeded = event.data.object;
  //     // Then define and call a function to handle the event payment_intent.succeeded
  //     break;
  //   // ... handle other event types
  //   default:
  //     console.log(`Unhandled event type ${event.type}`);
  // }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

//Pass incoming data
app.use(express.json());

app.use("/flex/users/",userRoutes);
app.use("/flex/products/",productsRouter);
app.use("/flex/categories/",categoriesRouter);
app.use("/flex/brands/",brandsRouter);
app.use("/flex/colors/",colorsRouter);
app.use("/flex/reviews/",reviewRouter);
app.use("/flex/orders/",orderRouter);
app.use("/flex/coupons/",couponRouter);


app.use(notFound);
app.use(globalErrHandler);

export default app;