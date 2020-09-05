import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

const MenuBar = () => {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/login"> Accord </Navbar.Brand>

            <Nav>
                <Nav.Link href="/login"> Login </Nav.Link>
                <Nav.Link href="/register"> Register </Nav.Link>
            </Nav>
        </Navbar>
    )
};

export default MenuBar;