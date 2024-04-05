import mongoose from "mongoose";
const { Schema } = mongoose;

const HotelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  photos: {
    type: [String],
  },
  title: {
    type: String,
    required: true,
  },
  extract: {
    type: [[String]],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  roomAmenities: {
    type: [[String]],
    required: true,
  },
  included: {
    type: [[String]],
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  cheapestPrice: {
    type: Number,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  guestLimit: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Hotel", HotelSchema);
