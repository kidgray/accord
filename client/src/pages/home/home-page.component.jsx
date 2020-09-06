import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { gql, useQuery, useLazyQuery } from '@apollo/client';

// COMPONENTS & PAGES
import Users from '../../components/users/users.component.jsx';

// GraphQL QUERIES
const GET_USERS = gql`
    query getUsers {
        getUsers {
            username
            createdAt
            imageUrl
            latestMessage {
                uuid
                from
                to
                content
                createdAt
            }
        }
    }
`;

const GET_MESSAGES = gql`
    query getMessages($from: String!) {
        getMessages(from: $from) {
            uuid
            from
            to
            content
            createdAt
        }
    }
`;

const HomePage = () => {
    // State Hook for the currently selected user (that's
    // the user whose messages we'll show in the chat box)
    const [selectedUser, setSelectedUser] = useState(null);

    // Lazy Query for getting the messages sent to and from a user
    const [getMessages, { loading: messagesLoading, data: messagesData, error: messagesError }] = useLazyQuery(GET_MESSAGES, {
        variables: {
            from: selectedUser
        }
    });

    // Effect hook that will load a conversation with another user
    // whenever a user is selected from the user list (left-hand side of the chat). Should
    // execute ONLY when the selected user changes (i.e. when we need to load a different chat)
    useEffect(() => {
        if (selectedUser) {
            getMessages();
        }
    }, [selectedUser]);

    return (
        <Container>
            <Row className="chat-dashboard">
                <Users />

                <Col xs={8}>
                    {
                        (messagesData && messagesData.getMessages.length > 0)
                        ? messagesData.getMessages.map(message => (
                            <p key={message.uuid}> {message.content} </p>
                        ))
                        : <p> Messages </p>

                    }
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;