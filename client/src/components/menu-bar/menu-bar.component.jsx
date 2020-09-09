import React, { Fragment } from 'react';
import { Navbar, Nav } from 'react-bootstrap';

// HOOKS
import { useHistory } from 'react-router-dom';
import { useAuthDispatch, useAuthState } from '../../context/auth.js';

const MenuBar = () => {
    // We will need history so we can redirect on logout
    const history = useHistory();

    // Custom Hook that allows us to access the current Authentication
    // State (i.e. whether the user is logged in or not)
    const authState = useAuthState();

    // Custom Hook that returns the current Authentication dispatch function
    const dispatch = useAuthDispatch();

    const logout = () => {
        // Dispatch a Logout Action
        dispatch({
            type: "LOGOUT"
        });

        // Redirect the user to the login page
        history.push('/login');
    };
    
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Navbar.Brand className="navbar-brand" href="/login"> Accord </Navbar.Brand>

            <Nav className="nav-links ml-auto">
                {
                    authState.user
                    ? <Nav.Link onClick={logout}> Logout </Nav.Link>
                    : (
                        <Fragment>
                            <Nav.Link href="/login"> Login </Nav.Link>
                            <Nav.Link href="/register"> Register </Nav.Link>
                        </Fragment>
                    )
                }
            </Nav>
        </Navbar>
    )
};

export default MenuBar;