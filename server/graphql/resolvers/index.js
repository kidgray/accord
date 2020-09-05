const userResolvers = require('./users');
const messageResolvers = require('./messages');

// Resolvers for the queries/mutations
const resolvers = {
    Query: {
        ...userResolvers.Query,
        ...messageResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...messageResolvers.Mutation
    },
    Message: {
        createdAt: (parent) => parent.createdAt.toISOString()
    }
};

module.exports = resolvers;