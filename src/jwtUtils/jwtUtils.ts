import { GraphQLError } from "graphql";
import { config } from "../config";
import { UserModel } from "../models/UserModel";
import jwt from "jsonwebtoken";

type tokenPayload = Pick<UserModel, "id" | "name" | "email">;

const isUserJWT = (value: unknown): value is tokenPayload =>
  value !== undefined &&
  "id" in (value as tokenPayload) &&
  "name" in (value as tokenPayload) &&
  "email" in (value as tokenPayload);

export const generateToken = (user: tokenPayload): string => {
  const signedToken = jwt.sign(user, config.JWT_KEY, { expiresIn: "1d" });

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

export const generateServiceToken = (): string => {
  const payload = {
    name: "service",
  };

  return jwt.sign(payload, config.JWT_KEY, { expiresIn: "1m" });
};

export const parseJWT = (token: string): Promise<tokenPayload> => {
  return new Promise((res, rej) => {
    jwt.verify(token, config.JWT_KEY, (err, decoded) => {
      if (err) return rej(err);

      if (isUserJWT(decoded)) {
        return res(decoded);
      } else {
        rej(
          new GraphQLError("Invalid JWT", {
            extensions: {
              code: "INVALID_JWT",
              http: {
                status: 401,
              },
            },
          })
        );
      }
    });
  });
};
