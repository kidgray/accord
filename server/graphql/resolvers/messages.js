const { AuthenticationError, UserInputError, withFilter } = require('apollo-server');
const { Op } = require('sequelize');

// Import Sequelize Models
const { Message, User } = require('../../models/index.js');

// Resolvers for the queries/mutations
const resolvers = {
    Query: {
        getMessages: async (_, args, { user }) => {
            try {
                // If there's no user object in the context, that means
                // the user isn't logged in
                if (!user) {
                    throw new AuthenticationError("Unauthenticated user.");
                }

                // Get the other user in the chat
                const sender = await User.findOne({
                    where: {
                        username: args.from
                    }
                });

                // If the other user does not exist
                if (!sender) {
                    throw new UserInputError(`User ${sender.username} not found.`);
                }

                // Put the two users' usernames in an array so we can use them in queries
                const usernames = [user.username, sender.username];

                // Get all the messages between the two users
                const messages = await Message.findAll({
                    where: {
                        from: { 
                            [Op.in]:  usernames, 
                        },
                        to: {
                            [Op.in]: usernames
                        }
                    },
                    order: [ ['createdAt', 'DESC'] ]
                });

                // Return the messages as the result of the query
                return messages;
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        }
    },
    Mutation: {
        sendMessage: async (_, args, { user, pubsub }) => {
            try {
                if (!user) {
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

                // Publish the addition of a message to the "new message" subscribers
                pubsub.publish('NEW_MESSAGE', { newMessage: message });

                // Return the message that we just sent as the result of the mutation
                return message;
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        }
    },
    Subscription: {
        newMessage: {
            subscribe: withFilter(
                (_, args, context) => {
                    if (!context.user) throw new AuthenticationError('Unauthenticated user.');

                    return context.pubsub.asyncIterator(['NEW_MESSAGE']);
                },
                (parent, _, context) => {
                    // If the currently authenticated user is either the
                    // sender or recipient of the new message 
                    if (parent.newMessage.from === context.user.username ||
                        parent.newMessage.to === context.user.username) {
                            return true;
                    }

                    // Otherwise, we don't need to broadcast new messages to users
                    // that aren't involved with that message
                    return false;
                }
            )
        }
    }
};

module.exports = resolvers;