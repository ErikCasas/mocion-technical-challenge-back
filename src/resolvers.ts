import { comicQueryResolver, comicResolver } from "./resolvers/comicResolver";
import {
  userMutationResolver,
  userQueryResolver,
  userResolver,
} from "./resolvers/userResolver";
import { Resolvers } from "./schemaTypes";

export const resolvers: Resolvers = {
  User: userResolver,
  Comic: comicResolver,
  Query: {
    ...comicQueryResolver,
    ...userQueryResolver,
  },
  Mutation: {
    ...userMutationResolver,
  },
};
