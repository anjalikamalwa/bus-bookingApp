import mongoose from "mongoose";

const busSchema = new mongoose.Schema(
  {
    bus_number: {
      type: String,
      unique: true,
    },
    bus_name: {
      type: String,
      required: [true, "Bus name is required"],
    },
    bus_image: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: [true, "Source location is required"],
    },
    destination: {
      type: String,
      required: [true, "Destination is required"],
    },
    journey_date: {
      type: Date,
      required: [true, "Journey date is required"],
    },
    departure_time: {
      type: Date,
      required: [true, "Departure time is required"],
    },
    arrival_time: {
      type: Date,
      required: [true, "Arrival time is required"],
    },
    fare: {
      type: Number,
      required: [true, "Fare amount is required"],
    },
    seat_capacity: {
      type: Number,
      required: [true, "Seat capacity is required"],
    },
    bus_type: [
      {
        type: String,
        enum: ["AC", "Non-AC", "Sleeper", "Seater", "Volvo"],
      },
    ],
    seatPrices: {
      type: [Number], 
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Bus = mongoose.model("Bus", busSchema);
