import { QueryResolvers } from "../schemaTypes";

export const comicResolver: QueryResolvers = {
  comic: (_, { id }, context) =>
    context.dataSources.comicsAPI.getComicById(id, context),
  comics: (_, { comicsInput }, context) =>
    context.dataSources.comicsAPI.getComics(comicsInput, context),
};
