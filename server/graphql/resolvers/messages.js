const { UserInputError, AuthenticationError } = require('apollo-server');

// Import Sequelize Models
const { Message, User } = require('../../models/index.js');

// Resolvers for the queries/mutations
const resolvers = {
    Mutation: {
        sendMessage: async (_, args, { user }) => {
            try {
                if (!user) {
                    // If there's no user object in the context, that means
                    // the user isn't logged in
                    throw new AuthenticationError("Unathenticated user.");
                }

                // Look for intended recipient of the user's message in the database,
                // and store it if they exist
                const recipient = await User.findOne({ where: { username: args.to }});

                // If the user's intended recipient doesn't exist in the DB, throw an error
                if (!recipient) {
                    throw new UserInputError("User not found.");
                }
                // Otherwise, check whether the user is trying to send themselves a message
                else if (recipient.username === user.username) {
                    throw new UserInputError("You may not message yourself.");
                }

                // If the user is trying to send an empty message
                if (args.content.trim() === '') {
                    throw new UserInputError("Cannot send an empty message.");
                }

                // If the user's intended recipient exists, create and send the message
                const message = await Message.create({
                    from: user.username,
                    to: args.to,
                    content: args.content
                });

                // Return the message that we just sent as the result of the mutation
                return message;
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        }
    }
};

module.exports = resolvers;