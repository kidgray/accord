const { gql } = require('apollo-server');

// GraphQL Schema
const typeDefs = gql`
    type User {
        username: String!
        email: String!
        createdAt: String!
        token: String
    }
    
    type Message {
        uuid: String!
        from: String!
        to: String!
        content: String!
    }

    input UserInfo {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }

    type Query {
        getUsers: [User]!
        login(username: String!, password: String!): User!
    }

    type Mutation {
        register(userInfo: UserInfo): User!
        sendMessage(to: String!, content: String!): Message!
    }
`;

module.exports = typeDefs;