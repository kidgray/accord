const userResolvers = require('./users');
const messageResolvers = require('./messages');
const { User, Message } = require('../../models/index');

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
    Subscription: {
        ...userResolvers.Subscription,
        ...messageResolvers.Subscription
    },
    Message: {
        createdAt: (parent) => parent.createdAt.toISOString()
    },
    Reaction: {
        createdAt: (parent) => parent.createdAt.toISOString(),
        message: async (parent) => await Message.findByPk(parent.messageId),
        user: async (parent) => await User.findByPk(parent.userId, { attributes: ['username', 'imageUrl', 'createdAt']})
    },
    User: {
        createdAt: (parent) => parent.createdAt.toISOString()
    },
};

module.exports = resolvers;