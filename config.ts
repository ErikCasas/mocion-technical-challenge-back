export const config = {
  PORT: process.env.PORT || 4000,
  MONGO_DB_URI:
    process.env.MONGO_DB_URI || "mongodb://0.0.0.0:27017/mocion-local",
  JWT_KEY: process.env.JWT_KEY || "mocion-JWT",
};
