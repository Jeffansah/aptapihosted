import mongoose from "mongoose";
const { Schema } = mongoose;

const SubscribedListSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SubscribedList", SubscribedListSchema);
