import { MongoDataSource } from "apollo-datasource-mongodb";
import { ComicModel } from "../../models/ComicModel";
import { ComicsInput, FilterInput } from "../../schemaTypes";
import { GQLContext } from "../../GQLContext";
import { FilterQuery, QueryOptions } from "mongoose";
import { APIS } from "../../types/APIS";
import { isMongoId } from "validator";
import { ComicDB, comicDBModel } from "./ComicsDBModel";

export class ComicsAPI extends MongoDataSource<ComicDB> {
  constructor() {
    super({ modelOrCollection: comicDBModel });
  }
  async getComics(
    comicsInput: ComicsInput,
    context: GQLContext
  ): Promise<Array<ComicModel>> {
    if (!context.jwt) {
      throw new Error(`${APIS.ComicsAPI}: Unauthorized`);
    }
    const { filter } = comicsInput;

    const query: FilterQuery<ComicDB> = {};

    if (filter?.publisher) {
      query.publisher = filter.publisher;
    }

    const options: QueryOptions = {};

    if (filter?.orderBy) {
      const validSortFields = [
        "name",
        "cover_date",
        "issue_number",
        "volume",
        "publisher",
      ];
      const sortField = filter.orderBy.field;

      if (!validSortFields.includes(sortField)) {
        throw new Error(`${APIS.ComicsAPI}: invalid field ${sortField}`);
      }

      const sortDirection = filter.orderBy.direction === "ASC" ? 1 : -1;
      options.sort = { [sortField]: sortDirection };
    }

    if (filter?.limit) {
      options.limit = filter.limit;
    }

    if (filter?.offset) {
      options.skip = filter.offset;
    }

    const comics = await this.model.find(query, null, options).exec();

    if (!comics.length) {
      throw new Error(`${APIS.ComicsAPI}: no one comic found`);
    }
    return comics;
  }

  async getComicById(id: string, context: GQLContext): Promise<ComicModel> {
    if (!context.jwt) {
      throw new Error("Unauthorized");
    }

    if (!isMongoId(id)) {
      throw new Error(`${APIS.ComicsAPI}: invalid ID`);
    }

    const comic = await this.model.findById(id).lean();

    if (!comic) {
      throw new Error(`${APIS.ComicsAPI}: comic not found`);
    }

    return comic;
  }

  async getComicsByIds(
    ids: Array<string>,
    context: GQLContext
  ): Promise<Array<ComicModel>> {
    if (!context.jwt) {
      throw new Error(`${APIS.ComicsAPI}: Unauthorized`);
    }

    const areValidIds = ids.some((id) => isMongoId(id));

    if (!areValidIds) {
      throw new Error(`${APIS.ComicsAPI}: some ids are invalid`);
    }

    const comics = await this.model
      .find({
        id: { $in: ids },
      })
      .lean();

    if (!comics.length) {
      throw new Error(`${APIS.ComicsAPI}: no one comic found`);
    }

    return comics;
  }
}
