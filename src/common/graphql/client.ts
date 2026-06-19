import { GraphQLClient } from 'graphql-request';

export const graphQlClient = new GraphQLClient(
    process.env.GRAPHQL_ENDPOINT ?? 'http://localhost:5000/graphql'
);
