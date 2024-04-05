import Koa from "koa";
import dotenv from "dotenv";
import { connectToDatabase } from "./mongo/index.js";
import Router from "koa-router";
import authRoute from "./routes/authRoute.js";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import usersRoute from "./routes/usersRoute.js";
import hotelsRoute from "./routes/hotelsRoute.js";
import subscribeRoute from "./routes/subscribeRoute.js";
import cartRoute from "./routes/cartRoute.js";
import stripeRoute from "./routes/stripeRoute.js";
import bookingRoute from "./routes/bookingRoute.js";

// Load environment variables
dotenv.config();
const port = process.env.PORT || 3000;

// Creating new Koa instance
const app = new Koa();

// initializing router
const router = new Router();

// Middlewares
app.use(cors());
app.use(bodyParser());

// Registering routes
router.use("/api/auth", authRoute.routes());
router.use("/api/users", usersRoute.routes());
router.use("/api/hotels", hotelsRoute.routes());
router.use("/api/subscribe", subscribeRoute.routes());
router.use("/api/cart", cartRoute.routes());
router.use("/api/stripe", stripeRoute.routes());
router.use("/api/bookings", bookingRoute.routes());

app.use(router.routes()).use(router.allowedMethods());

// Error handling middleware
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      success: false,
      message: err.message,
      stack: err.stack,
    };
  }
});

// Database connection and server start
connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`listening on port: ${port}`);
  });
});
