import React from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { createHttpLink } from 'apollo-link-http';

// ROUTERS
import AppRouter from '../routers/AppRouter.js';

// CONTEXTS
import { AuthProvider } from '../context/auth.js';

// HTTP Link for use with the Apollo Client
const httpLink = createHttpLink({
    uri: 'http://localhost:4000'
});

// Create instance of Apollo Client
const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
});

const ApolloChatApp = () => {
    return (
        <ApolloProvider client={client}>
            <AuthProvider>
                <AppRouter />
            </AuthProvider>
        </ApolloProvider>
    );
};

export default ApolloChatApp;