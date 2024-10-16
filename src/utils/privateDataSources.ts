import { ComicsAPI } from "../datasources/comicsAPI/ComicsAPI";
import { UsersAPI } from "../datasources/usersAPI/UsersAPI";
import { GQLContext } from "../GQLContext";

export const privateDataSources: Omit<GQLContext["dataSources"], "authAPI"> = {
  usersAPI: new UsersAPI(),
  comicsAPI: new ComicsAPI(),
};
