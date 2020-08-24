const { gql } = require('apollo-server');

// GraphQL Schema
const typeDefs = gql`
    type User {
        username: String!
        email: String!
    }

    type Query {
        getUsers: [User]!
    }
`;

module.exports = typeDefs;