import React, { useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

const RegisterPage = () => {
    // State Hook for the registration form fields
    const [ registrationInfo, setRegistrationInfo ] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleSubmit = (event) => {
        // Prevent page refresh on form submission
        event.preventDefault();

        console.log(registrationInfo);
    };

    return (
        <Container>
            <Row className="register-row">
                <Col className="register-header-col" sm={8} md={6} lg={4}>
                    <h1 className="display-2"> Register </h1>
                </Col>
            </Row>

            <Row className="register-row">
                <Col sm={8} md={6} lg={4}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId='registerFormUsername'>
                            <Form.Label> Username </Form.Label>
                            <Form.Control 
                                type="text" 
                                value={registrationInfo.username}
                                onChange={(event) => setRegistrationInfo({ ...registrationInfo, username: event.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="registerFormEmail">
                            <Form.Label> Email Address </Form.Label>
                            <Form.Control 
                                type="email" 
                                value={registrationInfo.email}
                                onChange={(event) => setRegistrationInfo({ ...registrationInfo, email: event.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="registerFormPassword">
                            <Form.Label> Password </Form.Label>
                            <Form.Control 
                                type="password" 
                                value={registrationInfo.password}
                                onChange={(event) => setRegistrationInfo({ ...registrationInfo, password: event.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="registerFormConfirmPassword">
                            <Form.Label> Confirm Password </Form.Label>
                            <Form.Control 
                                type="password" 
                                value={registrationInfo.confirmPassword}
                                onChange={(event) => setRegistrationInfo({ ...registrationInfo, confirmPassword: event.target.value })}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Register!
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default RegisterPage;