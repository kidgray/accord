import React, { createContext, useReducer, useContext } from 'react';

// These will be used to pass the Authentication State and
// Authentication Dispatch function (for updating the state)
const AuthStateContext = React.createContext();
const AuthDispatchContext = React.createContext();

// Initial State for the useReducer hook
const initialState = {
    user: null
};

// Reducer function for the useReducer Hook
const authReducer = (state, action) => {
    switch (action.type) {
        // Payload will contain the user token
        case 'LOGIN': 
            // Store user's JWT token in Local Storage so that refreshing the page
            // doesn't "log the user out"
            localStorage.setItem('token', action.payload.token);

            return {
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            return {
                ...state,
                user: null
            }
        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
};

export const AuthProvider = (props) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    return (
        <AuthDispatchContext.Provider value={dispatch} >
            <AuthStateContext.Provider value={state} >
                { props.children }
            </AuthStateContext.Provider>
        </AuthDispatchContext.Provider>
    );
};

// Two custom Hooks that will allow the use of the values of
// AuthStateContext and AuthDispatchContext (that is, the
// current state and current dispatch function)

export const useAuthState = () => useContext(AuthStateContext);
export const useAuthDispatch = () => useContext(AuthDispatchContext);