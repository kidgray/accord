import React, { Fragment, useEffect, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { gql, useLazyQuery, useMutation } from '@apollo/client';

// COMPONENTS & PAGES
import Message from '../message/message.component.jsx';

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

// GraphQL MUTATIONS
const SEND_MESSAGE = gql`
    mutation sendMessage($to: String!, $content: String!) {
        sendMessage(to: $to, content: $content) {
            uuid
            from
            to
            content
            createdAt
        }
    }
`;

const Messages = () => {
    // State Hook for the content of the message box that
    // can be used to send messages to the other users
    const [content, setContent] = useState('');

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

    // Mutation for sending messages to another user
    const [sendMessage] = useMutation(SEND_MESSAGE, {
        onCompleted: (data) => {
            messageDispatch({ 
                type: "ADD_MESSAGE", 
                payload: {
                    username: selectedUser?.username,
                    message: data.sendMessage
                } 
            });
        },
        onError: (err) => {
            console.log(err);
        },
        variables: {
            to: selectedUser?.username,
            content
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

    // Submit handler for the send message functionality
    const submitMessage = (event) => {
        // Prevent page reload upon form submission
        event.preventDefault();

        // If no message was entered, there's nothing to do
        if (content === '') {
            return;
        }

        // Otherwise, execute the mutation for sending 
        // a message
        sendMessage();
    }

    // The Markup that will be displayed by this component is affected by whether
    // a user has been selected or not
    let selectedChatMarkup;

    // If we haven't selected a user yet (i.e. if there are no messages loaded or currently loading)
    if (!messages && !messagesLoading) {
        selectedChatMarkup = <p className="info-text"> Select a user to chat with! </p>
    }
    // If a chatmate has been selected and their messages are currently loading
    else if (messagesLoading) {
        selectedChatMarkup = <p className="info-text"> Loading . . . </p>
    }
    // If we have messages to display
    else if (messages.length > 0) {
        selectedChatMarkup = messages.map((message, index) => (
            <Fragment key={message.uuid}>
                <Message message={message} />
                
                {index === messages.length - 1 && (
                    <div className="invisible">
                        <hr className="m-0" />
                    </div>
                )}
            </Fragment>
        ));
    }
    else if (messages.length === 0) {
        selectedChatMarkup = <p className="info-text"> You are now connected. Send a message! </p>
    }
    
    return (
        <Col xs={10} md={8}>
            <div className="d-flex flex-column-reverse messages-box">
                { selectedChatMarkup }
            </div>

            <div>
                {
                    selectedUser &&
                    <Form onSubmit={submitMessage}>
                        <Form.Group>
                            <Form.Control
                                type="text"
                                className="message-input rounded-pill"
                                placeholder="Enter a message..."
                                value={content}
                                onChange={(event) => setContent(event.target.value)}
                            />
                        </Form.Group>
                    </Form>
                }
            </div>
        </Col>
    );
};

export default Messages;