const { GraphQLServer } = require('graphql-yoga');
const { ApolloServer } = require('apollo-server');

// GraphQL & Apollo Server utils
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers/index');

// Instantiate the GraphQL Server
const server = new GraphQLServer({ typeDefs, resolvers });

// Start the GraphQL Server
server.start(({ port }) => console.log(`Server listening at http://localhost:${port}`));