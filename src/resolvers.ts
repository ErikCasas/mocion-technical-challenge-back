import { comicResolver } from "./resolvers/comicResolver";
import {
  userMutationResolver,
  userQueryResolver,
} from "./resolvers/userResolver";
import { Resolvers } from "./schemaTypes";

export const resolvers: Resolvers = {
  Query: {
    ...comicResolver,
    ...userQueryResolver,
  },
  Mutation: {
    ...userMutationResolver,
  },
};
