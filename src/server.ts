import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import express, { json } from "express";
import { HTTPError } from "./models/HTTPError";
import { APIError } from "./models/APIError";
import throng from "throng";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import defaultHandler from "./handlers/defaultHandler";
import { unwrapResolverError } from "@apollo/server/errors";
import { resolvers } from "./resolvers";
import { config } from "./config";
import { GQLContext } from "./GQLContext";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { logApiError } from "./utils/APIErrorLog";
import { createContext } from "./utils/createContext";
import { connectMongo } from "./db/DBconnection";
import { notUndefined } from "./utils/typeguards";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";

const isDev = config.NODE_ENV !== "production";

const typeDefs = loadSchemaSync("./src/schema.graphql", {
  loaders: [new GraphQLFileLoader()],
});

const jsonErrorHandler = (
  err: Error,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) => {
  // eslint-disable-next-line no-console
  console.error("server error", err);

  if (err instanceof HTTPError) {
    res.status(err.status).send({ error: err.message, data: err });
  } else {
    res.status(500).send({ error: err.message, data: err });
  }
};

const startApolloServer = async () => {
  const app = express();

  app.use(helmet({ contentSecurityPolicy: isDev ? false : undefined }));
  app.use(compression());

  app.use(express.urlencoded({ extended: true }));

  app.use(cors({ origin: "*" }));

  // app.use("/v1/auth", authAPIHandler);
  const server = new ApolloServer<GQLContext>({
    typeDefs,
    resolvers,
    introspection: true,
    plugins: [
      isDev ? ApolloServerPluginLandingPageLocalDefault() : undefined,
    ].filter(notUndefined),
    persistedQueries: {
      ttl: parseInt(config.PERSISTENCE),
    },
    formatError: (formattedError, error) => {
      if (formattedError.extensions?.code === "JWT_EXPIRED") {
        // eslint-disable-next-line no-console
        console.log(formattedError);
      } else {
        const unwrappedError = unwrapResolverError(error);

        if (unwrappedError instanceof APIError) {
          logApiError(unwrappedError);
        } else {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }

      return formattedError;
    },
  });

  await server.start();

  app.use(
    "/graphql",
    json(),
    expressMiddleware<GQLContext>(server, {
      context: ({ req }) => createContext(req),
    })
  );

  app.use("/", defaultHandler);

  app.use(jsonErrorHandler);

  app.listen({ port: config.PORT }, () => {
    // eslint-disable-next-line no-console
    console.log(
      `🚀 Ada GraphQL Server ready at http://localhost:${config.PORT}/graphql`
    );
  });
};

const displayStartServerError = (error: any) => {
  const message: string = error.message ?? "Error starting server";
  // eslint-disable-next-line no-console
  console.error(`GraphQL Server Error: ${message}`);
  process.exit(1);
};

function initServer(id: number, disconnect: () => void) {
  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);

  connectMongo();
  // eslint-disable-next-line no-console
  console.log(`Starting worker: ${id}`);
  startApolloServer().catch(displayStartServerError);

  function shutdown() {
    // eslint-disable-next-line no-console
    console.error(`Worker ${id} shutdown`);
    disconnect();
  }
}

throng({
  workers: 1,
  count: 1,
  start: initServer,
}).catch(displayStartServerError);
