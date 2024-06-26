import Router from "koa-router";
import Stripe from "stripe";
import { verifyToken } from "../utils/verifyToken.js";
import Cart from "../models/cartModel.js";
import Booking from "../models/bookingModel.js";
import User from "../models/usersModel.js";
import Hotel from "../models/hotelModel.js";

const router = new Router();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2023-10-16",
});

router.post("/payment", async (ctx) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            unit_amount: ctx.request.body.price * 100 * ctx.request.body.nights,
            product_data: {
              name: ctx.request.body.name,
            },
          },
          quantity: ctx.request.body.rooms,
        },
      ],
      metadata: {
        userId: ctx.request.body.userId,
        stayId: ctx.request.body.stayId,
        rooms: ctx.request.body.rooms,
        nights: ctx.request.body.nights,
        startDate: ctx.request.body.dates[0].startDate,
        endDate: ctx.request.body.dates[0].endDate,
      },
      mode: "payment",
      success_url: "https://apt-stays.vercel.app/",
      cancel_url: "http://apt-stays.vercel.app/stays",
    });
    if (session) {
      try {
        await Cart.deleteMany();
        ctx.status = 200;
        ctx.body = { sessionUrl: session.url };
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/webhook", async (ctx) => {
  try {
    const body = ctx.request.rawBody;
    const sig = ctx.request.headers["stripe-signature"];
    const endpointSecret = stripeWebhookSecret;

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
      console.log("1", event.type);
    } catch (err) {
      console.log(err);
      ctx.throw(400, err.message);
    }

    const data = event.data.object;

    if (event.type === "checkout.session.completed") {
      const { id, amount_total, metadata } = event.data.object;

      try {
        const { firstname, lastname, email } = await User.findById(
          metadata?.userId
        );

        try {
          const { name, cheapestPrice, photos } = await Hotel.findById(
            metadata?.stayId
          );

          const booking = {
            stripeId: id,
            user: {
              userId: metadata?.userId || "",
              userFirstName: firstname || "",
              userLastName: lastname || "",
              userEmail: email || "",
            },
            stay: {
              stayId: metadata?.stayId || "",
              stayName: name || "",
              stayPrice: parseInt(cheapestPrice) || 0,
              stayPhotos: photos || [],
            },
            rooms: parseInt(metadata?.rooms) || 0,
            nights: parseInt(metadata?.nights) || 0,
            dates:
              [
                {
                  startDate: new Date(metadata?.startDate) || new Date(),
                  endDate: new Date(metadata?.endDate) || new Date(),
                },
              ] || [],
            totalAmount: amount_total ? (amount_total / 100).toString() : "0",
          };

          try {
            const newBooking = await Booking(booking);
            try {
              const savedBooking = await newBooking.save();
              ctx.status = 200;
              ctx.body = {
                message: "Booking successfully saved!",
                savedBooking,
              };
            } catch (err) {
              ctx.throw(400, err.message);
            }
          } catch (err) {
            ctx.throw(400, err.message);
          }
        } catch (err) {
          console.log(err);
        }
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    ctx.throw(400, err.message);
  }
});

export default router;
