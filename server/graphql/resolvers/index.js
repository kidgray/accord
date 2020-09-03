const bcrypt = require('bcryptjs');
const { UserInputError, AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// JWT secret value
const { JWT_SECRET } = require('../../config/env.json');

// Import Sequelize Models
const { Message, User } = require('../../models/index.js');

// Resolvers for the queries/mutations
const resolvers = {
    Query: {
        // Destructure the user object from the context argument, which
        // is the one right after args. This is easier than having to refactor
        // the code to say context.user everywhere
        getUsers: async (_, args, { user }) => {
            try {
                if (!user) {
                    throw new AuthenticationError("Unathenticated user.");
                }

                // Retrieve all the users in the DB
                const users = await User.findAll({
                    // Make sure we do NOT list the user that is 
                    // making the request in the list of results
                    where: { 
                        username: { 
                            [Op.ne]: user.username
                        }
                    }
                });

                // Return the list of users 
                return users;
            } catch (err) {
                console.log(err);
                throw err;
            }

            return users;
        },
        login: async (_, args) => {
            // Destructure the arguments from the args object
            let { username, password } = args;
            
            // For storing errors that may occur
            const errors = {};

            try {
                // Input validation
                if (username.trim() === '') {
                    errors.username = "Username field must not be empty!";
                }
                if (password === '') {
                    errors.password = "Password field must not be empty!";
                }

                // If either the username or password fields were left empty,
                // throw an error
                if (Object.keys(errors).length > 0) {
                    throw new UserInputError('Invalid input', { errors });
                }

                // If the account with the username provided, if one exists
                const user = await User.findOne({ where: { username } });

                // If an account with the specified username DOESN'T exist
                if (!user) {
                    errors.username = 'An account with the specified username does not exist.';

                    // Throw an error indicating that no user account with the specified username was found
                    throw new UserInputError('User not found', { errors });
                }
                
                // Check whether the password provided matches the account's password in the database
                const isCorrectPassword = await bcrypt.compare(password, user.password);

                // If the password provided was incorrect
                if (!isCorrectPassword) {
                    errors.password = 'Incorrect password.';
                    throw new AuthenticationError('Incorrect password.', { errors });
                }

                // If the user entered the correct password,
                // issue a token
                const token = jwt.sign({
                    username
                }, JWT_SECRET, { expiresIn: '1h' });

                // Add the token to the user object
                user.token = token;

                // If no errors occurred and passwords match, then return the user.
                return {
                    // We need to return a JSON object. When you just return the user object,
                    // this is done automatically, but if you return anything else (like a new object
                    // inside of which you spread another object, i.e. what I'm doing here) you need to
                    // do it manually
                    ...user.toJSON(),
                    createdAt: user.createdAt.toISOString(),
                    token
                }
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        }
    },
    Mutation: {
        register: async (_, args) => {
            let { username, password, confirmPassword, email } = args.userInfo;
            const errors = {};

            try {
                // Make sure username field isn't empty
                if (username.trim() === '') {
                    errors.username = "Username field must not be empty!";
                }

                // Make sure password fields aren't empty AND that they match
                if (password.trim() === '') {
                    errors.password = "Password field must not be empty!";
                }
                if (confirmPassword.trim() === '') {
                    errors.confirmPassword = "Confirm password field must not be empty!";
                }
                if (password !== confirmPassword) {
                    errors.confirmPassword = 'Password fields do not match!';
                }

                // Make sure email field isn't empty
                if (email.trim() === '') {
                    errors.email = "Email field must not be empty!";
                }

                // If there were any errors
                if (Object.keys(errors).length > 0) {
                    throw errors;
                }

                password = await bcrypt.hash(password, 6);

                const user = await User.create({
                    username,
                    password,
                    email
                })

                return user;
            } 
            catch (err) {
                console.log(err);

                if (err.name === 'SequelizeUniqueConstraintError') {
                    err.errors.forEach((error) => (errors[error.path] = `An account with that ${error.path} already exists.`));
                }
                else if (err.name === 'SequelizeValidationError') {
                    err.errors.forEach((error) => (errors[error.path] = error.message));
                }

                throw new UserInputError('Invalid input.', { errors });
            }
        },
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