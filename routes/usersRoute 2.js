import Router from "koa-router";
import User from "../models/usersModel.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = new Router();

// Get all users
router.get("/", verifyAdmin, async (ctx, next) => {
  try {
    const users = await User.find();
    ctx.status = 200;
    ctx.body = { users };
  } catch (error) {
    return next(error);
  }
});

// Get a single user
router.get("/:id", async (ctx, next) => {
  try {
    const foundUser = await User.findById(ctx.params.id);
    ctx.status = 200;
    console.log(ctx.cookies.get("access_token"));
    ctx.body = { message: "Found user!", foundUser };
  } catch (error) {
    error.message = "Cannot find user";
    return next(error);
  }
});

// Update a user
router.put("/:id", verifyUser, async (ctx, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      ctx.params.id,
      { $set: ctx.request.body },
      { new: true }
    );
    ctx.status = 200;
    ctx.body = { message: "Successfully updated user!", updatedUser };
  } catch (error) {
    return next(error);
  }
});

// Delete a user
router.delete("/:id", verifyUser, async (ctx, next) => {
  try {
    const deletedUser = await User.findOneAndDelete(ctx.params.id);
    ctx.status = 200;
    ctx.body = { message: "Successfully deleted user", deletedUser };
  } catch (error) {
    return next(error);
  }
});

//Delete all users
router.delete("/", verifyAdmin, async (ctx, next) => {
  try {
    const deletedUsers = await User.deleteMany();
    ctx.status = 200;
    ctx.body = { message: "Successfully deleted all users", deletedUsers };
  } catch (error) {
    return next(error);
  }
});

export default router;
