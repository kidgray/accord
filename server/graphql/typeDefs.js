const { gql } = require('apollo-server');

// GraphQL Schema
const typeDefs = gql`
    type User {
        username: String!
        email: String
        createdAt: String!
        token: String
        latestMessage: Message
        imageUrl: String
    }
    
    type Message {
        uuid: String!
        from: String!
        to: String!
        content: String!
        createdAt: String!
    }

    type Reaction {
        content: String!
        uuid: String!
        Message: Message!
        User: User!
        createdAt: String!
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
        getMessages(from: String!): [Message]!
    }

    type Mutation {
        register(userInfo: UserInfo): User!
        sendMessage(to: String!, content: String!): Message!
        reactToMessage(uuid: String!, content: String!): Reaction!
    }

    type Subscription {
        newMessage: Message!
        newReaction: Reaction!
    }
`;

module.exports = typeDefs;