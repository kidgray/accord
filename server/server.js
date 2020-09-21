const { ApolloServer } = require('apollo-server');

require('dotenv').config();

// Import instance of the sequelize Database
const { sequelize } = require('./models/index');

// GraphQL & Apollo Server utils
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers/index');

const contextMiddleware = require('./utils/contextMiddleware');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: contextMiddleware,
    subscriptions: { path: '/' }
});

server.listen().then(({ url, subscriptionsUrl }) => {
    console.log(`Server ready at ${url}`);
    console.log(`Subscriptions ready at ${subscriptionsUrl}`);

    sequelize
        .authenticate()
        .then(() => console.log(`Database successfully connected & authenticated!`))
        .catch((err) => console.log(err))
});
