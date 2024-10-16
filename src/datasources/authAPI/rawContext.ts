import { GQLContext } from "../../GQLContext";
import { privateDataSources } from "../../utils/privateDataSources";
import { AuthAPI } from "./AuthAPI";

export const getRawContext = (token: string, authAPI: AuthAPI): GQLContext => {
  return {
    jwt: token,
    dataSources: {
      ...privateDataSources,
      authAPI,
    },
  };
};
