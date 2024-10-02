import asyncHandler from "express-async-handler";
import { Bus } from "../models/busModel.js";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

const generateBusNumber = () => {
  return `BUS${uuidv4().split("-")[0]}`;
};

const formatToAMPM = (date) => {
  return moment(date).format("h:mm A");
};

export const createBus = asyncHandler(async (req, res) => {
  const {
    bus_name,
    bus_image,
    source,
    destination,
    journey_date,
    departure_time,
    arrival_time,
    fare,
    seat_capacity,
    bus_type,
    seatPrices, 
  } = req.body;

  console.log("req.body:", req.body);
  console.log("req.file:", req.file);


  if (
    !bus_name ||
    !bus_image ||
    !source ||
    !destination ||
    !journey_date ||
    !departure_time ||
    !arrival_time ||
    !fare ||
    !seat_capacity ||
    !bus_type ||  !seatPrices || 
    seatPrices.length !== seat_capacity 
  ) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }


  const formattedJourneyDate = moment(journey_date, "DD-MM-YYYY").toDate();
  const formattedDepartureTime = moment(
    `${journey_date} ${departure_time}`,
    "DD-MM-YYYY hh:mm A"
  ).toDate();
  const formattedArrivalTime = moment(
    `${journey_date} ${arrival_time}`,
    "DD-MM-YYYY hh:mm A"
  ).toDate();

  const fareValue = parseFloat(fare.replace("$", ""));

  const busTypesArray = bus_type
    .split(",")
    .map((type) => type.trim())
    .filter((type) =>
      ["AC", "Non-AC", "Sleeper", "Seater", "Volvo"].includes(type)
    );

  const bus_number = generateBusNumber();

  const bus = await Bus.create({
    bus_number,
    bus_name,
    bus_image,
    source,
    destination,
    journey_date: formattedJourneyDate,
    departure_time: formattedDepartureTime,
    arrival_time: formattedArrivalTime,
    fare: fareValue,
    seat_capacity,
    bus_type: busTypesArray,
    seatPrices: seatPrices.map(price => parseFloat(price)),
  });

  res.status(201).json({
    message: "Bus post created successfully",
    bus: {
      ...bus._doc,
      departure_time: formatToAMPM(formattedDepartureTime), 
      arrival_time: formatToAMPM(formattedArrivalTime),
    },
  });
});

// @dess Get a Bus
// @route Get /api/bus/:id
// @access public
export const getBus = asyncHandler(async (req, res) => {
  const bus = await Bus.findById(req.params.id);
  if (!bus) {
    res.status(404);
    throw new Error("Bus not Found");
  }
  res.status(200).json(bus);
});

// @dess Get all Bus
// @route Get /api/bus/
// @access public
export const getAllBus = asyncHandler(async (req, res) => {
  try {
    const bus = await Bus.find();
    res.status(200).json(bus);
  } catch (error) {
    console.error("Error fetching Bus:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @dess Get Search Bus
// @route Get /api/bus/
// @access public
export const searchBuses = asyncHandler(async (req, res) => {
  const { departureCity, arrivalCity, date } = req.query;

  try {
    const query = {};

    if (departureCity) {
      query.source = new RegExp(departureCity, 'i');
    }
    if (arrivalCity) {
      query.destination = new RegExp(arrivalCity, 'i');
    }

    if (date) {
      const journeyDate = moment(date, 'YYYY-MM-DD').startOf('day');
      const nextDay = moment(journeyDate).endOf('day');

      query.journey_date = { $gte: journeyDate.toDate(), $lt: nextDay.toDate() };
    }

    console.log("MongoDB Query:", query);

    const buses = await Bus.find(query);

    if (buses.length > 0) {
      res.status(200).json(buses);
    } else {
      res.status(404).json({ message: "No buses found for the given search criteria" });
    }
  } catch (error) {
    console.error("Error fetching buses:", error);
    res.status(500).json({ message: "Server error while searching for buses" });
  }
});
