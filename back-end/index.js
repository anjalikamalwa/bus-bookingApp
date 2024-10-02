import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url"; // Import to handle __dirname equivalent
import connectDB from "./dbconfig/dbconnection.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cors from "cors";
import router from "./routes/busRoute.js";
import bodyParser from "body-parser";
import { router1 } from "./routes/bookingRoutes.js";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from 'front-end/build'
app.use(express.static(path.join(__dirname, 'front-end', 'build')));
app.use('/api/assets', express.static(path.join(__dirname, 'assets')));

// API routes
app.use("/api/bus", router);
app.use("/api/booking", router1);

// Serve the frontend app for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'front-end', 'build', 'index.html'));
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
