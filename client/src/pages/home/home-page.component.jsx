import React, { useState } from 'react';
import { Container, Row } from 'react-bootstrap';


// COMPONENTS & PAGES
import Users from '../../components/users/users.component.jsx';
import Messages from '../../components/messages/messages.component.jsx';

const HomePage = () => {
    const [selectedUser, setSelectedUser] = useState(null);

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