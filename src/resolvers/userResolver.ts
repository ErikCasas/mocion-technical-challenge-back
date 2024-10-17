import { MutationResolvers, QueryResolvers } from "../schemaTypes";

export const userMutationResolver: MutationResolvers = {
  createUser: (_, { createUserInput }, context) =>
    context.dataSources.usersAPI.createUser(createUserInput),
};

export const userQueryResolver: QueryResolvers = {
  user: (_, __, context) => context.dataSources.usersAPI.getUser(context),
};
