import { GQLContext } from "../../GQLContext";
import { UserModel } from "../../models/UserModel";
import { CreateUserInput } from "../../schemaTypes";
import { APIS } from "../../types/APIS";
import { isEmailValid } from "../../utils/validators";
import { UserDB, UserDBModel } from "./UserDBModels";
import { MongoDataSource } from "apollo-datasource-mongodb";
import bcrypt from "bcrypt";

export class UsersAPI extends MongoDataSource<UserDB> {
  constructor() {
    super({ modelOrCollection: UserDBModel });
  }

  async createUser(userInput: CreateUserInput): Promise<UserModel> {
    const { email, name, nickname, password } = userInput;

    const emailAreValid = isEmailValid(email);

    if (!emailAreValid) {
      throw new Error(`${APIS.UsersAPI}: invalid email`);
    }

    const existingEmail = await this.model.exists({ email }).lean();

    if (existingEmail) {
      throw new Error(`${APIS.UsersAPI}: This user already are register`);
    }

    if (name.length <= 2 && name.length >= 15) {
      throw new Error(`${APIS.UsersAPI}: invalid name`);
    }

    if (nickname.length <= 2 && nickname.length >= 15) {
      throw new Error(`${APIS.UsersAPI}: invalid nickname`);
    }

    userInput.password = await bcrypt.hash(password, 10);

    return await this.model.create(userInput);
  }
  async getByCredentials(
    {
      email,
      password,
    }: {
      email: string;
      password: string;
    },
    context: GQLContext
  ): Promise<UserModel> {
    if (!context.jwt) {
      throw new Error("Unauthorized");
    }

    const user = await this.model
      .findOne({ email: email.toLowerCase() })
      .select("+password")
      .lean();

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user.password ?? "");

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    return user;
  }
}
