// tslint:disable-next-line:no-var-requires
require("dotenv").config();
import { GraphQLServer } from "graphql-yoga";
import "reflect-metadata";
import { buildSchemaSync } from "type-graphql";
import ConfigurationResolver from "./resolvers/ConfigurationResolver";

const schema = buildSchemaSync({
  emitSchemaFile: true,
  resolvers: [ConfigurationResolver],
});

export const server = new GraphQLServer({ schema });

server.start({ endpoint: "/graphql" }, () => {
  // tslint:disable-next-line: no-console
  console.log("Server is running on http://localhost:4000");
});
