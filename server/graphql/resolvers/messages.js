const { AuthenticationError, ForbiddenError, UserInputError, withFilter } = require('apollo-server');
const { Op } = require('sequelize');

// Import Sequelize Models
const { Message, Reaction, User } = require('../../models/index.js');

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
                    order: [ ['createdAt', 'DESC'] ],
                    include: [{ model: Reaction, as: 'reactions' }]
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
        },
        reactToMessage: async (_, { uuid, content }, { user, pubsub }) => {
            try {
                // These are the emojis that a user may react to a post with
                const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎'];

                // Make sure the reaction passed in is one of the acceptable reactions
                if (!reactions.includes(content)) {
                    // If not, throw an error
                    throw new UserInputError('Invalid reaction!');
                }

                // Get the user 
                const username = user ? user.username : '';

                // Check whether the user w/ the specified username
                // exists in the DB; throw an error if it doesn't
                user = await User.findOne({ where: { username }});
                if (!user) throw new AuthenticationError('Unauthenticated user!');

                // Check whether the message we're reacting to exists in the DB;
                // throw an error if it doesn't
                const message = await Message.findOne({ where: { uuid }});
                if (!message) throw new UserInputError('Message not found!');

                // A user is only allowed to react to a message if they either sent
                // or received that message
                if (message.from !== user.username && message.to !== user.username) {
                    throw new ForbiddenError('Unauthorized');
                }

                // Otherwise, check whether the message already has the Reaction type we're trying to add
                let reaction = await Reaction.findOne({
                    where: { 
                        messageId: message.id,
                        userId: user.id
                    }
                });

                // If the message already has that reaction, update it
                if (reaction) {
                    // Overwrite the old reaction
                    reaction.content = content;

                    // Save changes to DB
                    await reaction.save();
                }
                else {
                    // Reaction doesn't exist yet, so create it
                    reaction = await Reaction.create({
                        messageId: message.id,
                        userId: user.id,
                        content
                    })
                }

                pubsub.publish('NEW_REACTION', { newReaction: reaction });

                // Return the newly updated/created reaction as the result of the Mutation
                return reaction;
            }
            catch (err) {
                throw err;
            }
        }
    },
    Subscription: {
        newMessage: {
            subscribe: withFilter(
                (_, args, context) => {
                    if (!context.user) throw new AuthenticationError('Unauthenticated user.');

                    return context.pubsub.asyncIterator('NEW_MESSAGE');
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
        },
        newReaction: {
            subscribe: withFilter(
                (_, args, context) => {
                    if (!context.user) throw new AuthenticationError('Unauthenticated user.');

                    return context.pubsub.asyncIterator('NEW_REACTION');
                },
                async (parent, _, context) => {
                    // Get the message that the Reaction will be attached to
                    const message = await parent.newReaction.getMessage();

                    // If the currently authenticated user is either the
                    // sender or recipient of the new reaction 
                    if (message.from === context.user.username ||
                        message.to === context.user.username) {
                            return true;
                    }

                    // Otherwise, we don't need to broadcast new reactions to users
                    // that aren't involved with that reactions
                    return false;
                }
            )
        },
    }
};

module.exports = resolvers;