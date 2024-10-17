import { QueryResolvers, Resolvers } from "../schemaTypes";

export const comicQueryResolver: QueryResolvers = {
  comic: (_, { id }, context) =>
    context.dataSources.comicsAPI.getComicById(id, context),
  comics: (_, { comicsInput }, context) =>
    context.dataSources.comicsAPI.getComics(comicsInput, context),
};

export const comicResolver: Resolvers["Comic"] = {
  isLiked: ({ id }, __, context) =>
    context.dataSources.usersAPI.isLikedByCurrentUser(id, context),
};
