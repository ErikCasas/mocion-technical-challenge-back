import { GraphQLError } from "graphql";
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

// TODO: this can be better
export const isValidJWT = (token: string): boolean => {
  jwt.verify(token, config.JWT_KEY, (err) => {
    if (err) {
      throw new GraphQLError("JWT invalid");
    }
  });
  return true;
};
