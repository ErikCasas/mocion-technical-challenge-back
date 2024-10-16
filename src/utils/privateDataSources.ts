import { GQLContext } from "../GQLContext";

export const privateDataSources: Omit<GQLContext["dataSources"], "authAPI"> =
  {};
