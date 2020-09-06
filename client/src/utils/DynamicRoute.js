import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// HOOKS
import { useAuthState } from '../context/auth';

const DynamicRoute = (props) => {
    // Get the user (if one exists) from the Authentication context
    const { user } = useAuthState();

    // If the current user is NOT logged in
    if (props.authenticated && !user) {
        // Redirect the user to the login page so they can log in/register
        return <Redirect to="/login" />
    }
    // If the user is logged in but trying to access either the login
    // page or the register page
    else if (props.guest && user) {
        // Redirect the user to the home page (i.e. the chat page)
        return <Redirect to="/home" />
    }
    // Otherwise, simply a Route as-is
    else {
        return <Route component={props.component} {...props} />
    }

}

export default DynamicRoute;