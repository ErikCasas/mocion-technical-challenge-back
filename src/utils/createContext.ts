import { GQLContext } from "../GQLContext";
import { dataSources } from "./dataSources";

export const createContext = async (req: {
  headers: {
    authorization?: string;
  };
}): Promise<GQLContext> => {
  const jwe = req.headers.authorization
    ? req.headers.authorization.split("Bearer ")?.[1]
    : "";

  return {
    jwt: jwe,
    dataSources,
  };
};
