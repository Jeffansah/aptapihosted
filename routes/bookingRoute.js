import Router from "koa-router";
import Booking from "../models/bookingModel.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = new Router();

// Get all bookings
router.get("/", async (ctx) => {
  try {
    const bookings = await Booking.find();
    ctx.status = 200;
    ctx.body = bookings;
  } catch (error) {
    ctx.status = 400;
    ctx.body = { message: error.message };
  }
});

export default router;
