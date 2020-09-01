import React from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { createHttpLink } from 'apollo-link-http';
import { Container, Row, Col, Form } from 'react-bootstrap';

// COMPONENTS & PAGES
import RegisterPage from '../pages/register/register-page.component.jsx';

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
            <RegisterPage />
        </ApolloProvider>
    );
};

export default ApolloChatApp;