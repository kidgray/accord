const { GraphQLServer } = require('graphql-yoga');
const { ApolloServer } = require('apollo-server');

require('dotenv').config();

// Import instance of the sequelize Database
const { sequelize } = require('./models/index');

// GraphQL & Apollo Server utils
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers/index');

const contextMiddleware = require('./utils/contextMiddleware');

// Instantiate the GraphQL Server
const server = new GraphQLServer({ 
    typeDefs, 
    resolvers,
    context: contextMiddleware
});

// Start the GraphQL Server
server.start(({ 
    port 
}) => console.log(`Server listening at http://localhost:${port}`))
.then(() => {
    // authenticate() returns a Promise; we return that from this 
    // then() block so as to avoid excessive nesting. The next then()
    // will handle this Promise
    return sequelize.authenticate();
})
.then(() => console.log(`Database successfully authenticated and connected!`))
.catch((err) => console.log(`Error: ${err}`));      // If the database failed to connect for whatever reason