import React from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { createHttpLink } from 'apollo-link-http';

// COMPONENTS & PAGES
import Chat from './chat/chat.component.jsx';

// Instantiate an Apollo Link for use w/ the Apollo Client
const httpLink = createHttpLink({
    uri: 'http://localhost:4000'
});

// Create an instance of ApolloClient
const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
});

const ApolloChatApp = () => {
    <ApolloProvider client={client}>
        <Chat />
    </ApolloProvider>
};

export default ApolloChatApp;