export const config = {
  PORT: process.env.PORT || 4000,
  MONGO_DB_URI:
    process.env.MONGO_DB_URI || "mongodb://127.0.0.1:27017/mocion-local",
  JWT_KEY: process.env.JWT_KEY || "mocion-JWT",
  PERSISTENCE: process.env.PERSISTENCE || "86400",
  NODE_ENV: process.env.NODE_ENV || "development",
  COMIC_VINE_API_KEY:
    process.env.COMIC_VINE_API_KEY ||
    "4c6d8955233e117396523b389659016675e94323",
};
