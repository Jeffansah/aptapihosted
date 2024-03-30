import Router from "koa-router";
import SubscribedList from "../models/subscribedListModel.js";
import { verifyAdmin, verifyToken } from "../utils/verifyToken.js";

const router = new Router();

// Add a new email to list
router.post("/", async (ctx) => {
  const { email } = ctx.request.body;

  try {
    const newEmail = new SubscribedList({ email });
    const savedEmail = await newEmail.save();
    ctx.status = 200;
    ctx.body = { message: "Successfully added email to list", savedEmail };
  } catch (error) {
    ctx.throw(400, error);
  }
});

// Get all emails
router.get("/", verifyAdmin, async (ctx) => {
  try {
    const emails = await SubscribedList.find();
    ctx.status = 200;
    ctx.body = { message: "Found emails!", emails };
  } catch (error) {
    ctx.throw(400, error);
  }
});

// Delete an email
router.delete("/:id", verifyAdmin, async (ctx) => {
  try {
    const deletedEmail = await SubscribedList.findByIdAndDelete(ctx.params.id);
    ctx.status = 200;
    ctx.body = { message: "Successfully deleted email", deletedEmail };
  } catch (error) {
    ctx.throw(400, error);
  }
});

export default router;
