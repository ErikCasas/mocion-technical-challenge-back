import { GQLContext } from "../GQLContext";
import { isValidJWT } from "../jwtUtils/jwtUtils";
import { dataSources } from "./dataSources";

export const createContext = async (req: {
  headers: {
    authorization?: string;
  };
}): Promise<GQLContext> => {
  const jwt = req.headers.authorization
    ? req.headers.authorization.split("Bearer ")?.[1]
    : "";

  // If is valid continue with the flow code, else throw a error
  isValidJWT(jwt);

  return {
    jwt,
    dataSources,
  };
};
