const jwt = require('jsonwebtoken');

// JWT secret value
const { JWT_SECRET } = require('../config/env.json');


module.exports = (context) => {
    // Check the headers for the authorization header. Make sure context.req 
    // exists first, just in case
    if (context.request && context.request.headers.authorization) {
        // We only need the actual jwt string, which is everything that comes
        // after 'Bearer ' in the authorization property of the header
        const token = context.request.headers.authorization.split('Bearer ')[1];
        
        // Use the Secret to verify that the JWT token we extracted was issued
        // by this server
        jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
            if (err) {
                // throw new AuthenticationError('Unauthenticated user.');
            }
        
            // The decoded token will contain whatever we put into the token
            // using the sign() method; in this case, the username
            context.user = decodedToken;
        });
    }

    // Return the context, which now contains the user
    return context;
};