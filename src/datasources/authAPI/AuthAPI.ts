import { UserModel } from "../../models/UserModel";
import { DataSource } from "apollo-datasource";
import { getRawContext } from "./rawContext";
import { generateToken } from "../../jwtUtils/jwtUtils";
import { isEmailValid } from "../../utils/validators";

export class AuthAPI extends DataSource {
  async registerUser({
    name,
    email,
    password,
    nickName,
  }: {
    name: string;
    email: string;
    password: string;
    nickName: string;
  }): Promise<Pick<UserModel, "id">> {
    const emailIsValid = isEmailValid(email);

    if (!emailIsValid) {
      throw new Error("AuthAPI: invalid email");
    }

    if (name.length >= 4 && name.length <= 12) {
      throw new Error("AuthAPI: invalid name");
    }

    if (nickName.length >= 4 && nickName.length <= 12) {
      throw new Error("AuthAPI: invalid nickName");
    }

    if (password.length >= 7 && password.length <= 16) {
      throw new Error("AuthAPI: invalid passowrd");
    }

    const user = {
      name,
      email,
      nickName,
    };
    const token = generateToken(user);
    const context = getRawContext(token, this);

    const { id } = await context.dataSources.usersAPI.createUser({
      email,
      name,
      nickName,
      password,
    });

    return { id };
  }
}
