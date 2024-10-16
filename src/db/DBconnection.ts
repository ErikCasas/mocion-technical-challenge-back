import mongoose from "mongoose";
import { config } from "../config";

// MongoDB connection
export const connectMongo = () => {
  mongoose
    .set("strictQuery", false)
    .connect(config.MONGO_DB_URI, { enableUtf8Validation: false })
    .then(() => {
      // eslint-disable-next-line no-console
      console.log("🗄  MongoDB connected");
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error("Error connecting with MongoDB", err);
      // eslint-disable-next-line no-console
      console.warn("Retrying to connect to MongoDB...");
      setTimeout(() => connectMongo(), 5000);
    });
};
