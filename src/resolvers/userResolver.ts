import { MutationResolvers } from "../schemaTypes";

export const userMutationResolver: MutationResolvers = {
  createUser: (_, { createUserInput }, context) =>
    context.dataSources.usersAPI.createUser(createUserInput),
};
