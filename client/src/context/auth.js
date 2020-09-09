import React, { createContext, useReducer, useContext } from 'react';
import jwtDecode from 'jwt-decode';

// These will be used to pass the Authentication State and
// Authentication Dispatch function (for updating the state)
const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

// Attempt to retrieve JWT token from local storage
// Basically, check if a user is logged in
const token = localStorage.getItem('token');

// This will be set to the user if there is a user logged in
// (i.e. if a token exists), or remain null if there is no token
let user;

// If there was a token, there's a user logged in
if (token) {
    // Decode the JWT token
    const decodedToken = jwtDecode(token);

    // Get token's expiration time. Note that
    // decodedToken.exp gives us the expiration time in seconds;
    // we need milliseconds, so multiply by 1000
    const expiresAt = new Date(decodedToken.exp * 1000);

    // Check whether the current token is expired
    if (new Date() > expiresAt) {
        localStorage.removeItem('token');
    }
    else {
        // decodedToken contains our user object
        user = decodedToken;
    }
}

// Initial State for the useReducer hook
const initialState = {
    user
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
            // Delete the user's JWT token from local storage
            localStorage.removeItem('token');
        
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