import Router from "koa-router";
import Hotel from "../models/hotelModel.js";
import Room from "../models/roomModel.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = new Router();

// Add a new hotel
router.post("/", verifyAdmin, async (ctx) => {
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
router.get("/", verifyAdmin, async (ctx) => {
  const { min, max, ...others } = ctx.query;
  try {
    const hotels = await Hotel.find({
      ...others,
      cheapestPrice: { $gte: min || 1, $lte: max || 999 },
    }).limit(parseInt(ctx.query.limit));
    ctx.status = 200;
    ctx.body = hotels;
  } catch (error) {
    ctx.throw(400, error);
  }
});

// Update a hotel
router.put("/:id", verifyAdmin, async (ctx) => {
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
    ctx.status = 200;
    ctx.body = foundHotel;
  } catch (error) {
    ctx.throw(400, "Cannot find hotel");
  }
});

// Find Number of hotels by City
router.get("/countByCity", async (ctx) => {
  const cities = ctx.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => Hotel.countDocuments({ city }))
    );
    ctx.status = 200;
    ctx.body = list;
  } catch (error) {
    ctx.throw(400, error);
  }
});

// Find Number of hotels by Type
router.get("/countByType", async (ctx) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "Hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "Apartment" });
    const resortCount = await Hotel.countDocuments({ type: "Resort" });
    const villaCount = await Hotel.countDocuments({ type: "Villa" });
    const cabinCount = await Hotel.countDocuments({ type: "Cabin" });
    const cottageCount = await Hotel.countDocuments({ type: "Cottage" });
    const vacationhomeCount = await Hotel.countDocuments({
      type: "Vacation home",
    });
    const guesthouseCount = await Hotel.countDocuments({ type: "Guest house" });
    const motelCount = await Hotel.countDocuments({ type: "Motel" });

    const data = [
      { type: "hotel", count: hotelCount },
      { type: "apartment", count: apartmentCount },
      { type: "resort", count: resortCount },
      { type: "villa", count: villaCount },
      { type: "cabin", count: cabinCount },
      { type: "cottage", count: cottageCount },
      { type: "vacation home", count: vacationhomeCount },
      { type: "guest house", count: guesthouseCount },
      { type: "motel", count: motelCount },
    ];

    ctx.status = 200;
    ctx.body = data;
  } catch (error) {
    ctx.throw(400, error.message);
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
router.delete("/:id", verifyAdmin, async (ctx) => {
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

export default router;
