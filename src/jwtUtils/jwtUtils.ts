import { config } from "../config";
import { UserModel } from "../models/UserModel";
import jwt from "jsonwebtoken";

export const generateToken = (user: Omit<UserModel, "id">): string => {
  const userToken = {
    ...user,
  };

  const signedToken = jwt.sign(userToken, config.JWT_KEY, { expiresIn: "1d" });

  return signedToken;
};

// parseJWT
// verifyJWT
