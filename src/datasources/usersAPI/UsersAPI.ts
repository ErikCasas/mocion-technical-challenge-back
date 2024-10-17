import { isMongoId } from "validator";
import { GQLContext } from "../../GQLContext";
import { parseJWT } from "../../jwtUtils/jwtUtils";
import { UserModel } from "../../models/UserModel";
import { CreateUserInput } from "../../schemaTypes";
import { APIS } from "../../types/APIS";
import { isEmailValid } from "../../utils/validators";
import { UserDB, UserDBModel } from "./UserDBModels";
import { MongoDataSource } from "apollo-datasource-mongodb";
import bcrypt from "bcrypt";
import { ComicModel } from "../../models/ComicModel";

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
      .select("+password");

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user.password ?? "");

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    return user;
  }

  async getUser(context: GQLContext) {
    if (!context.jwt) {
      throw new Error("Unauthorized");
    }

    const { id } = await parseJWT(context.jwt);

    const user = await this.model.findById(id);

    if (!user) {
      throw new Error(`${APIS.UsersAPI}: User not found`);
    }

    return user;
  }
  async isLikedByCurrentUser(
    comicId: string,
    context: GQLContext
  ): Promise<boolean> {
    if (!context.jwt) {
      throw new Error(`${APIS.UsersAPI}: Unauthorized`);
    }

    const { id } = await parseJWT(context.jwt);

    if (!isMongoId(comicId)) {
      throw new Error(`${APIS.UsersAPI}: Comic Id invalid`);
    }

    const isLiked = await this.model.exists({
      _id: id,
      favoriteComicsIds: { $in: comicId },
    });

    return !!isLiked;
  }

  /**
   * Este metodo en realidad a parte de añadir a favoritos
   * tambien elimina en caso de que se esté pasando el mismo comicId
   */
  async addFavoriteComic(
    comicId: string,
    context: GQLContext
  ): Promise<ComicModel> {
    if (!context.jwt) {
      throw new Error(`${APIS.ComicsAPI}: Unauthorized`);
    }

    if (!isMongoId(comicId)) {
      throw new Error(`${APIS.UsersAPI}: Comic Id invalid`);
    }

    const { id } = await parseJWT(context.jwt);

    const comic = await context.dataSources.comicsAPI.getComicById(
      comicId,
      context
    );

    if (!comic) {
      throw new Error(`${APIS.ComicsAPI}: Comic not found`);
    }

    const user = await this.model.findById(id);

    if (!user) {
      throw new Error(`${APIS.UsersAPI}: User not found`);
    }

    const isFavorite = user.favoriteComicsIds.includes(comicId);

    let updatedUser;

    if (isFavorite) {
      updatedUser = await this.model.findByIdAndUpdate(
        id,
        { $pull: { favoriteComicsIds: comicId } },
        { new: true }
      );
    } else {
      updatedUser = await this.model.findByIdAndUpdate(
        id,
        { $addToSet: { favoriteComicsIds: comicId } },
        { new: true }
      );
    }

    if (!updatedUser) {
      throw new Error(`${APIS.UsersAPI}: User not found`);
    }

    return comic;
  }
}
