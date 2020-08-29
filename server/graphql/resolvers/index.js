const bcrypt = require('bcryptjs');
const { UserInputError, AuthenticationError } = require('apollo-server');

// Import Sequelize Models
const { User } = require('../../models/index.js');

// Resolvers for the queries/mutations
const resolvers = {
    Query: {
        getUsers: async () => {
            try {
                // Retrieve all the users in the DB
                const users = await User.findAll();

                // Return the list of users 
                return users;
            } catch (err) {
                console.log(err);
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
                if (password.trim() === '') {
                    errors.password = "Password field must not be empty!";
                }

                // If the account with the username provided, if one exists
                const user = await User.findOne({ where: { username } });

                // If an account with the specified username DOESN'T exist
                if (!user) {
                    errors.username = 'An account with the specified username does not exist.';
                    throw new UserInputError('User not found', { errors });
                }
                
                // Check whether the password provided matches the account's password in the database
                const isCorrectPassword = await bcrypt.compare(password, user.password);

                // If the password provided was incorrect
                if (!isCorrectPassword) {
                    errors.password = 'Incorrect password.';
                    throw new AuthenticationError('Incorrect password.', { errors });
                }

                // If no errors occurred and passwords match, then return the user
                return user;
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

                // Check whether a record with the specified username/email address already exist
                // const userByUsername = await User.findOne({ where: { username } });
                // const userByEmail = await User.findOne({ where: { email } });

                // If a user with that username already exists
                // if (userByUsername) errors.username = "An account with that username already exists.";
                // if (userByEmail) errors.email = "An account with that email address already exists.";

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
        }
    }
};

module.exports = resolvers;