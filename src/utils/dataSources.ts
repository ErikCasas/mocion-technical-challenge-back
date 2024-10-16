import { GQLContext } from "../GQLContext";
import { privateDataSources } from "./privateDataSources";

export const dataSources: GQLContext["dataSources"] = {
  //   authAPI: new AuthAPI(),
  ...privateDataSources,
};
