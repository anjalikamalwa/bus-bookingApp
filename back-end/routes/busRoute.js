import express from "express";
import { createBus, getAllBus, getBus, searchBuses } from "../controllers/busController.js";

const router = express.Router();


router.post("/",createBus);
router.get("/", getAllBus);
router.get("/search", searchBuses);
router.get("/:id", getBus);



export default router;
