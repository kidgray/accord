const { GraphQLServer } = require('graphql-yoga');

// Array of messages (Test)
const messages = [];

// GraphQL Schema
const typeDefs = `
    type Message {
        id: ID!
        user: String!
        content: String!
    }

    type Query {
        messages: [Message!]
    }
    
    type Mutation {
        postMessage(user: String!, content: String!): ID!
    }
`;

// Resolvers for the queries/mutations
const resolvers = {
    Query: {
        messages: () => messages
    },
    Mutation: {
        postMessage: (_, { user, content }) => {
            // For now, message ID will simply be the length of the array
            const id = messages.length;

            // Add the new message to the array
            messages.push({
                id, 
                user,
                content
            });

            // Return the message id
            return id;
        }
    }
};

// Instantiate the GraphQL Server
const server = new GraphQLServer({ typeDefs, resolvers });


// Start the GraphQL Server
server.start(({ port }) => console.log(`Server listening at http://localhost:${port}`));