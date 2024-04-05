import mongoose from "mongoose";
const { Schema } = mongoose;

const CartSchema = new Schema({
  stayId: {
    type: String,
    required: true,
  },
  dates: [
    {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
    },
  ],
  rooms: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Cart", CartSchema);
