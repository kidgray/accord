const jwt = require('jsonwebtoken');
const { PubSub } = require('apollo-server');

// Publish/Subscribe primitive for notifying subscribers of events
const pubsub = new PubSub();

module.exports = (context) => {
    let token;
    
    // Check the headers for the authorization header. Make sure context.req 
    // exists first, just in case
    if (context.request && context.request.headers.authorization) {
        // We only need the actual jwt string, which is everything that comes
        // after 'Bearer ' in the authorization property of the header
        token = context.request.headers.authorization.split('Bearer ')[1];
    }
    else if (context.connection && context.connection.context.Authorization) {
        token = context.connection.context.Authorization.split('Bearer ')[1];
    }

    // If we have a token
    if (token) {
        // Use the Secret to verify that the JWT token we extracted was issued
        // by this server
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            // The decoded token will contain whatever we put into the token
            // using the sign() method; in this case, the username
            context.user = decodedToken;
        });
    }

    // Attach the pubsub to the context
    context.pubsub = pubsub;

    // Return the context, which now contains the user
    return context;
};