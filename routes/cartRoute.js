import Router from "koa-router";
import Cart from "../models/cartModel.js";
import Hotel from "../models/hotelModel.js";

const router = new Router();

//Add to cart
router.post("/", async (ctx) => {
  try {
    const isCartFilled = (await Cart.find()).length > 0;
    if (isCartFilled) {
      ctx.status = 403;
      ctx.body = {
        isCartFilled,
        message:
          "Sorry, theres already an item to be checked out, Please finish that booking and return here.",
      };
      return;
    }
    const newCart = new Cart({
      stayId: ctx.request.body.stayId,
      rooms: ctx.request.body.rooms,
      dates: ctx.request.body.dates,
    });
    try {
      const savedCart = await newCart.save();
      try {
        const hotel = await Hotel.findById(ctx.request.body.stayId);
        ctx.status = 200;
        ctx.body = { message: "Successfully added to cart!", savedCart, hotel };
      } catch (error) {
        ctx.throw(400, error);
      }
    } catch (error) {
      ctx.throw(400, error);
    }
  } catch (error) {
    ctx.throw(400, error);
  }
});

// Get all items in cart
router.get("/", async (ctx) => {
  try {
    const cart = await Cart.find();
    if (cart.length === 0) {
      ctx.status = 200;
      ctx.body = { message: "Cart is empty!", cart };
      return;
    }
    try {
      const hotel = await Hotel.findById(cart[0].stayId);
      ctx.status = 200;
      ctx.body = { cart, hotel };
    } catch (error) {
      ctx.throw(400, error);
    }
  } catch (error) {
    ctx.throw(400, error);
  }
});

// Delete an item from cart
router.delete("/:id", async (ctx) => {
  try {
    const deletedCart = await Cart.findByIdAndDelete(ctx.params.id);
    try {
      const findCartItem = await Cart.findById(ctx.params.id);
      if (!findCartItem) {
        ctx.status = 200;
        ctx.body = { message: "Cart is empty!", deleted: true };
        return;
      }
    } catch (error) {
      ctx.throw(400, error);
    }
  } catch (error) {
    ctx.throw(400, error);
  }
});

export default router;
