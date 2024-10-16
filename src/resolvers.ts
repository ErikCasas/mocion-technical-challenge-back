import { comicResolver } from "./resolvers/comicResolver";
import { userMutationResolver } from "./resolvers/userResolver";
import { Resolvers } from "./schemaTypes";

export const resolvers: Resolvers = {
  Query: {
    ...comicResolver,
  },
  Mutation: {
    ...userMutationResolver,
  },
};
