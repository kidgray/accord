import React, { createContext, useReducer, useContext } from 'react';

const MessageStateContext = createContext();
const MessageDispatchContext = createContext();

let users;

const initialState = {
    users
};

const messageReducer = (state, action) => {
    // Temp copy of the array in state
    let usersCopy; 

    switch (action.type) {
        case 'SET_USERS':
            return {
                ...state,
                users: action.payload
            };
        case 'SET_USER_MESSAGES':
            const { username, messages } = action.payload;

            usersCopy = [...state.users];

            const userIndex = usersCopy.findIndex((user) => user.username === username);

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