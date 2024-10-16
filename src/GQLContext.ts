import { AuthAPI } from "./datasources/authAPI/AuthAPI";
import { ComicsAPI } from "./datasources/comicsAPI/ComicsAPI";
import { UsersAPI } from "./datasources/usersAPI/UsersAPI";

export interface GQLContext {
  jwt?: string;
  dataSources: {
    authAPI: AuthAPI;
    usersAPI: UsersAPI;
    comicsAPI: ComicsAPI;
  };
}
