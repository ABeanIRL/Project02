import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import { RedisStore } from "connect-redis";
import { createClient } from "redis";
import driverRoutes from "./routes/driver.js";
import restaurantRoutes from "./routes/restaurant.js";
import trackingRoutes from "./routes/tracking.js";
import errorMiddleware from "./middlewares/error-middleware.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const redisClient = createClient();
redisClient.connect().catch(console.error);
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "restaurant-site:",
});

mongoose
  .connect(
    process.env.NODE_ENV === "DEV" ? process.env.DEVDB : process.env.MONGODB_URI
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) =>
    console.error("Error occurred while connecting to MongoDB", err)
  );

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.TOKEN_SECRET,
    resave: false,
    saveUninitialized: false,
    store: redisStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/driver", driverRoutes);
app.use("/restaurant", restaurantRoutes);
app.use("/tracking", trackingRoutes);
app.use(errorMiddleware);

app.listen(port, () => {
  console.log("Server is running on port", port);
});
