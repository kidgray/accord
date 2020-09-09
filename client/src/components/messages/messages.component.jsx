import React, { useEffect } from 'react';
import { Col } from 'react-bootstrap';
import { gql, useLazyQuery } from '@apollo/client';

// HOOKS
import { useMessageDispatch, useMessageState } from '../../context/message.js';

// GraphQL QUERIES
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

const Messages = () => {
    // Custom Hooks for using message context
    const { users } = useMessageState();
    const messageDispatch = useMessageDispatch();

    // Find the user that is selected
    const selectedUser = users?.find((user) => (user.selected === true));

    // Get the selected user's messages, if they exist
    const messages = selectedUser?.messages;

    // Lazy Query for getting the messages sent to and from a user
    const [getMessages, { loading: messagesLoading, data: messagesData, error: messagesError }] = useLazyQuery(GET_MESSAGES, {
        variables: {
            from: selectedUser?.username
        }
    });

    // Effect hook that will load a conversation with another user
    // whenever a user is selected from the user list (left-hand side of the chat). Should
    // execute ONLY when the selected user changes (i.e. when we need to load a different chat)
    useEffect(() => {
        // If the user's messages aren't stored in the context, get them
        if (selectedUser && !selectedUser.messages) {
            getMessages();
        }
    }, [selectedUser]);

    // Effect Hook that will run when we don't have the user's messages stored in the
    // context
    useEffect(() => {
        if (messagesData) {
            messageDispatch({ 
                type: 'SET_USER_MESSAGES', 
                payload: {
                    username: selectedUser?.username,
                    messages: messagesData.getMessages
                }
            })
        }
    }, [messagesData]);

    // The Markup that will be displayed by this component is affected by whether
    // a user has been selected or not
    let selectedChatMarkup;

    // If we haven't selected a user yet (i.e. if there are no messages loaded or currently loading)
    if (!messages && !messagesLoading) {
        selectedChatMarkup = <p> Select a user to chat with! </p>
    }
    // If a chatmate has been selected and their messages are currently loading
    else if (messagesLoading) {
        selectedChatMarkup = <p> Loading . . . </p>
    }
    // If we have messages to display
    else if (messages.length > 0) {
        selectedChatMarkup = messages.map(message => (
            <p key={message.uuid}> {message.content} </p>
        ));
    }
    else if (messages.length === 0) {
        selectedChatMarkup = <p> You are now connected. Send a message! </p>
    }
    
    return (
        <Col xs={8}>
            { selectedChatMarkup }
        </Col>
    );
};

export default Messages;