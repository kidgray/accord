import React from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from '@apollo/client/link/context';

// ROUTERS
import AppRouter from '../routers/AppRouter.js';

// CONTEXTS
import { AuthProvider } from '../context/auth.js';
import { MessageProvider } from '../context/message.js';

// HTTP Link for use with the Apollo Client
let httpLink = createHttpLink({
    uri: '/'
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

httpLink = authLink.concat(httpLink);

// Get the host
const host = window.location.host;

// Web Socket Link for use with GraphQL Subscriptions
const wsLink = new WebSocketLink({
    uri: `ws://${host}/`,
    options: {
        reconnect: true,
        connectionParams: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
});

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
);

// Create instance of Apollo Client
const client = new ApolloClient({
    link: splitLink,
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