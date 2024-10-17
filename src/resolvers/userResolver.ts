import { MutationResolvers, QueryResolvers, Resolvers } from "../schemaTypes";

export const userMutationResolver: MutationResolvers = {
  createUser: (_, { createUserInput }, context) =>
    context.dataSources.usersAPI.createUser(createUserInput),
  addFavoriteComic: (_, { comicId }, context) =>
    context.dataSources.usersAPI.addFavoriteComic(comicId, context),
};

export const userQueryResolver: QueryResolvers = {
  user: (_, __, context) => context.dataSources.usersAPI.getUser(context),
};

export const userResolver: Resolvers["User"] = {
  favoriteComics: ({ favoriteComicsIds }, __, context) =>
    context.dataSources.comicsAPI.getComicsByIds(favoriteComicsIds, context),
};
