import React from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from '@apollo/client/link/context';


// ROUTERS
import AppRouter from '../routers/AppRouter.js';

// CONTEXTS
import { AuthProvider } from '../context/auth.js';
import { MessageProvider } from '../context/message.js';

// HTTP Link for use with the Apollo Client
const httpLink = createHttpLink({
    uri: 'http://localhost:4000'
});

// Authentication Link that will be chained to the HTTP Link
// This appends an Authorization header to every HTTP request made
// by the client
const authLink = setContext((_, { headers }) => {
    // Get the Authentication token from local storage, if it exists
    const token = localStorage.getItem('token');

    // Return the headers to the context so that httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ""
        }
    };
});

// Create instance of Apollo Client
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

const ApolloChatApp = () => {
    return (
        <ApolloProvider client={client}>
            <AuthProvider>
                <MessageProvider>
                    <AppRouter />
                </MessageProvider>
            </AuthProvider>
        </ApolloProvider>
    );
};

export default ApolloChatApp;