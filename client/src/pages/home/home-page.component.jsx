import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { gql, useSubscription } from '@apollo/client';

// CONTEXT
import { useAuthState } from '../../context/auth.js';
import { useMessageDispatch } from '../../context/message.js';

// GraphQL SUBSCRIPTIONS
const NEW_MESSAGE = gql`
    subscription newMessage {
        newMessage {
            uuid
            from
            to
            content
            createdAt
        }
    }
`;


// COMPONENTS & PAGES
import Users from '../../components/users/users.component.jsx';
import Messages from '../../components/messages/messages.component.jsx';

const HomePage = () => {
    const messageDispatch = useMessageDispatch();

    // Get currently authenticated user from the context
    const { user } = useAuthState();

    // Execute the subscription for new messages
    const { data: messageData , error: messageError } = useSubscription(NEW_MESSAGE);

    // useEffect hook for whenever the subscription broadcasts a new message being sent/added
    useEffect(() => {
        if (messageError) {
            console.log(messageError);
        }

        if (messageData) {
            // Get the actual message from the result of the Subscription
            const message = messageData.newMessage;

            // Get the other user by checking whether the currently authenticated user is
            // the recipient of the message that was sent. If it is, then the other use must
            // be the message's sender. Otherwise, if the currently authenticated user was the
            // sender of the message, the other user must be the message's intended recipient (its "to" attribute)
            const otherUser = user.username === message.to ? message.from : message.to;

            messageDispatch({ 
                type: "ADD_MESSAGE", 
                payload: {
                    username: otherUser,
                    message
                } 
            });
        }
    }, [messageData, messageError]);

    return (
        <Container>
            <Row className="chat-dashboard">
                <Users />

                <Messages />
            </Row>
        </Container>
    );
};

export default HomePage;