import express  from "express";
import { createBooking } from "../controllers/bookingController.js";

 export const router1 = express();


router1.post("/",createBooking)