import mongoose from "mongoose";
const { Schema } = mongoose;

const BookingSchema = new Schema(
  {
    stripeId: {
      type: String,
      required: true,
    },
    user: {
      userId: {
        type: String,
        required: true,
      },
      userFirstName: {
        type: String,
        required: true,
      },
      userFirstName: {
        type: String,
        required: true,
      },
      userEmail: {
        type: String,
        required: true,
      },
    },
    stay: {
      stayId: {
        type: String,
        required: true,
      },
      stayName: {
        type: String,
        required: true,
      },
      stayPrice: {
        type: Number,
        required: true,
      },
      stayPhotos: {
        type: Array,
        required: true,
      },
    },
    rooms: {
      type: Number,
      required: true,
    },
    nights: {
      type: Number,
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
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Booking", BookingSchema);
