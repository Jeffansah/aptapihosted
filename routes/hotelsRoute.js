import Router from "koa-router";
import Hotel from "../models/hotelModel.js";
import Room from "../models/roomModel.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = new Router();

// Add a new hotel
router.post("/", async (ctx) => {
  const newHotel = new Hotel(ctx.request.body);
  try {
    const savedHotel = await newHotel.save();
    ctx.status = 200;
    ctx.body = { message: "Successfully added a new hotel!", savedHotel };
  } catch (error) {
    ctx.throw(400, error);
  }
});

// Get all hotels
router.get("/", async (ctx) => {
  try {
    const hotels = await Hotel.find();
    ctx.status = 200;
    ctx.body = hotels;
  } catch (error) {
    ctx.throw(400, error);
  }
});

router.get("/search", async (ctx) => {
  let { type, guests } = ctx.query;
  guests = parseInt(guests);
  try {
    const hotels = await Hotel.find({
      type,
      guestLimit: { $gte: guests },
    });
    ctx.status = 200;
    if (hotels.length === 0) {
      ctx.body = { message: "No hotels found", hotels: [] };
      return;
    }

    ctx.body = { message: "No hotels found", hotels };
  } catch (error) {
    ctx.throw(400, error);
  }
});

// Update a hotel
router.put("/:id", async (ctx) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      ctx.params.id,
      { $set: ctx.request.body },
      { new: true }
    );
    ctx.status = 200;
    ctx.body = { message: "Successfully updated hotel!", updatedHotel };
  } catch (error) {
    ctx.throw(400, error);
  }
});

// Find a hotel by ID
router.get("/search/:id", async (ctx) => {
  try {
    const foundHotel = await Hotel.findById(ctx.params.id);
    if (!foundHotel) {
      ctx.throw(400, { message: "Hotel not found" });
      return;
    }

    ctx.status = 200;
    ctx.body = foundHotel;
  } catch (error) {
    ctx.throw(400, { message: "Hotel not found", error });
  }
});

// Get rooms for a particular hotel
router.get("/room/:id", async (ctx) => {
  try {
    const hotel = await Hotel.findById(ctx.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => Room.findById(room))
    );
    ctx.status = 200;
    ctx.body = list;
  } catch (error) {
    ctx.throw(400, error);
  }
});

// Delete a hotel
router.delete("/:id", async (ctx) => {
  try {
    const deletedHotel = await Hotel.findOneAndDelete(ctx.params.id);
    ctx.status = 200;
    ctx.body = { message: "successfully deleted hotel", deletedHotel };
  } catch (error) {
    ctx.throw(400, error);
  }
});

//Get featured hotels
router.get("/featured", async (ctx) => {
  try {
    const featuredHotels = await Hotel.find({ featured: true });
    ctx.status = 200;
    ctx.body = featuredHotels;
  } catch (error) {
    ctx.throw(400, error);
  }
});

//Get similar hotels
router.get("/similar", async (ctx) => {
  let { guests, id } = ctx.query;
  guests = parseInt(guests);
  try {
    const similarHotels = await Hotel.find({
      guestLimit: guests,
    }).limit(3);
    const filteredHotels = similarHotels.filter(
      (hotel) => hotel._id.toString() !== id
    );
    ctx.status = 200;
    ctx.body = { message: "hotels found!", filteredHotels };
  } catch (error) {
    ctx.throw(400, error);
  }
});

export default router;
