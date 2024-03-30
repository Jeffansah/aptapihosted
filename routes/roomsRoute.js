import Router from "koa-router";
import Room from "../models/roomModel.js";
import Hotel from "../models/hotelModel.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = new Router();

// Add a new room
router.post("/:hotelid", async (ctx) => {
  const hotelId = ctx.params.hotelid;
  const newRoom = new Room(ctx.request.body);

  try {
    const savedRoom = await newRoom.save();

    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (error) {
      ctx.throw(400, error);
    }
    ctx.status = 200;
    ctx.body = savedRoom;
  } catch (error) {
    ctx.throw(400, error);
  }
});

// Update a room
router.put("/:id", verifyAdmin, async (ctx) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      ctx.params.id,
      { $set: ctx.request.body },
      { new: true }
    );
    ctx.status = 200;
    ctx.body = { message: "Successfully updated room!", updatedRoom };
  } catch (error) {
    ctx.throw(400, error);
  }
});

// Update room availability
router.put("/availability/:id", async (ctx) => {
  try {
    await Room.updateOne(
      { "roomNumbers._id": ctx.params.id },
      {
        $push: {
          "roomNumbers.$.unavailableDates": ctx.request.body.date,
        },
      }
    );
    ctx.status = 200;
    ctx.body = "Room status has been updated.";
  } catch (err) {
    ctx.throw(400, err);
  }
});

// Get all rooms
router.get("/", async (ctx) => {
  try {
    const rooms = await Room.find();
    ctx.status = 200;
    ctx.body = { message: "Found rooms!", rooms };
  } catch (error) {
    ctx.throw(400, error);
  }
});

// Find a room by ID
router.get("/:id", async (ctx) => {
  try {
    const foundRoom = await Room.findById(ctx.params.id);
    ctx.status = 200;
    ctx.body = { message: "Found room!", foundRoom };
  } catch (error) {
    ctx.throw(400, "Cannot find room");
  }
});

// Delete a room
router.delete("/:hotelid/:id", verifyAdmin, async (ctx) => {
  const hotelId = ctx.params.hotelid;

  try {
    const deletedRoom = await Room.findByIdAndDelete(ctx.params.id);

    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: deletedRoom._id },
      });
    } catch (error) {
      ctx.throw(400, error);
    }
    ctx.status = 200;
    ctx.body = { message: "Successfully deleted room", deletedRoom };
  } catch (error) {
    ctx.throw(400, error);
  }
});

export default router;
