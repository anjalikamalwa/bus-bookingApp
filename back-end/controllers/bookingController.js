// controllers/bookingController.js
import asyncHandler from 'express-async-handler';
import moment from 'moment';
import { Bus } from '../models/busModel.js';
import Booking from '../models/bookingModel.js';


export const createBooking = asyncHandler(async (req, res) => {
  const { busId, passengerDetails, totalCost } = req.body;



  if (!busId || !passengerDetails || !totalCost) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  passengerDetails.forEach(detail => {
    if (!detail.name || !detail.email || !detail.phone || !detail.seatNumber) {
      res.status(400);
      throw new Error("Each passenger must have a name, email, phone, and seat number");
    }
  });

  const bus = await Bus.findById(busId);
  if (!bus) {
    res.status(404);
    throw new Error("Bus not found");
  }

  const booking = await Booking.create({
    busId,
    passengerDetails,
    totalCost,
  });

  res.status(201).json({
    message: "Booking created successfully",
    booking,
  });
});
