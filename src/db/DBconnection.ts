import mongoose from "mongoose";
import { config } from "../config";

// MongoDB connection
export const connectMongo = () => {
  mongoose
    .set("strictQuery", false)
    .connect(config.MONGO_DB_URI, { enableUtf8Validation: false })
    .then(() => {
      console.log("🗄  MongoDB connected");
    })
    .catch((err) => {
      console.error("Error connecting with MongoDB", err);
      console.warn("Retrying to connect to MongoDB...");
      setTimeout(() => connectMongo(), 5000);
    });
};
