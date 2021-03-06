import React, { createContext, useReducer, useContext } from 'react';

const MessageStateContext = createContext();
const MessageDispatchContext = createContext();

let users;

const initialState = {
    users
};

const messageReducer = (state, action) => {
    // Temp copy of the array in state
    let usersCopy, userIndex; 

    // Destructure the username, message (for ADD_MESSAGE)
    // and messages (for SET_USER_MESSAGES) from the action payload
    const { username, message, messages, reaction } = action.payload;

    switch (action.type) {
        case 'SET_USERS':
            return {
                ...state,
                users: action.payload
            };
        case 'SET_USER_MESSAGES':
            usersCopy = [...state.users];

            userIndex = usersCopy.findIndex((user) => user.username === username);

            usersCopy[userIndex] = { ...usersCopy[userIndex], messages }

            return {
                ...state,
                users: usersCopy
            }
        case 'SET_SELECTED_USER':
            usersCopy = state.users.map((user) => ({
                ...user,
                selected: user.username === action.payload
            }));

            return {
                ...state,
                users: usersCopy
            };
        case 'ADD_MESSAGE':
            usersCopy = [...state.users];

            // Get the index of the user that is receiving the message
            userIndex = usersCopy.findIndex((user) => user.username === username);

            // We are creating a new message, so it needs a new reactions array
            // to store any future reactions
            message.reactions = [];
            
            // Create a copy of the user object to which we are adding a new msg
            let userCopy = {
                ...usersCopy[userIndex],
                messages: usersCopy[userIndex].messages 
                    ? [message, ...usersCopy[userIndex].messages] 
                    : null,
                latestMessage: message,
            };

            // Add the modified copy of the user object to the copy of the array
            // of user objects
            usersCopy[userIndex] = userCopy;

            return {
                ...state,
                users: usersCopy
            }
        case 'ADD_REACTION':
            usersCopy = [...state.users];

            // Get the index of the user that is receiving the message
            userIndex = usersCopy.findIndex((user) => user.username === username);

            // Make shallow copy of the user whose message is being reacted to
            userCopy = { ...usersCopy[userIndex] };

            // Get the index of the message the reaction is being added to
            const messageIndex = userCopy.messages?.findIndex((message) => message.uuid === reaction.message.uuid);

            // If we found the message
            if (messageIndex > -1) {
                // Make shallow copy of user messages
                let messagesCopy = [...userCopy.messages];

                // Make shallow copy of user message reactions
                let reactionsCopy = [...messagesCopy[messageIndex].reactions];

                // Get the index of the reaction we are adding
                const reactionIndex = reactionsCopy.findIndex((r) => r.uuid === reaction.uuid);

                // If the reaction already exists, update it
                if (reactionIndex > -1) {
                    reactionsCopy[reactionIndex] = reaction;
                }
                // Otherwise, add a new reaction
                else {
                    reactionsCopy = [...reactionsCopy, reaction];
                }

                messagesCopy[messageIndex] = {
                    ...messagesCopy[messageIndex],
                    reactions: reactionsCopy
                };

                userCopy = { ...userCopy, messages: messagesCopy };

                usersCopy[userIndex] = userCopy;
            }

            return {
                ...state,
                users: usersCopy
            }
        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
};

export const MessageProvider = (props) => {
    const [state, dispatch] = useReducer(messageReducer, initialState);

    return (
        <MessageDispatchContext.Provider value={dispatch}>
            <MessageStateContext.Provider value={state}>
                { props.children }
            </MessageStateContext.Provider>
        </MessageDispatchContext.Provider>
    );
};

export const useMessageState = () => useContext(MessageStateContext);
export const useMessageDispatch = () => useContext(MessageDispatchContext);