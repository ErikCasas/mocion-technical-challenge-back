import { UserModel } from "../../models/UserModel";
import { DataSource } from "apollo-datasource";
import { getRawContext } from "./rawContext";
import { generateServiceToken, generateToken } from "../../jwtUtils/jwtUtils";
import { isEmailValid } from "../../utils/validators";
import { HTTPError } from "../../models/HTTPError";
import { GQLContext } from "../../GQLContext";

export class AuthAPI extends DataSource {
  async registerUser({
    name,
    email,
    password,
    nickname,
  }: {
    name: string;
    email: string;
    password: string;
    nickname: string;
  }): Promise<Pick<UserModel, "id">> {
    const emailIsValid = isEmailValid(email);

    if (!emailIsValid) {
      throw new Error("AuthAPI: invalid email");
    }

    if (name.length >= 4 && name.length <= 12) {
      throw new Error("AuthAPI: invalid name");
    }

    if (nickname.length >= 4 && nickname.length <= 12) {
      throw new Error("AuthAPI: invalid nickName");
    }

    if (password.length >= 7 && password.length <= 16) {
      throw new Error("AuthAPI: invalid passowrd");
    }

    const user = {
      name,
      email,
      nickname,
    };
    const token = generateToken(user);
    const context = getRawContext(token, this);

    const { id } = await context.dataSources.usersAPI.createUser({
      email,
      name,
      nickname,
      password,
    });

    return { id };
  }

  async signInWithCredentials({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    try {
      if (
        !email ||
        typeof email !== "string" ||
        email.length === 0 ||
        !password ||
        typeof password !== "string" ||
        password.length === 0
      ) {
        throw new HTTPError({
          status: 400,
          message: "Invalid username or password",
        });
      }

      const serviceToken = generateServiceToken();
      const context: GQLContext = getRawContext(serviceToken, this);

      const user = await context.dataSources.usersAPI.getByCredentials(
        { email, password },
        context
      );

      if (!user) {
        throw new HTTPError({
          status: 400,
          message: "Invalid username or password",
        });
      }

      return generateToken(user);
    } catch (err) {
      const msg =
        err instanceof HTTPError && "message" in err ? err.message : "";
      // eslint-disable-next-line no-console
      console.warn("AuthAPI: sign in error", {
        err,
        msg,
        email,
      });
      throw err;
    }
  }
}
