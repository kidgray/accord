import React, { useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

const RegisterPage = () => {
    // 

    const handleSubmit = (event) => {
        // Prevent page refresh on form submission
        event.preventDefault();


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
                            <Form.Control type="text" />
                        </Form.Group>

                        <Form.Group controlId="registerFormEmail">
                            <Form.Label> Email Address </Form.Label>
                            <Form.Control type="email" />
                        </Form.Group>

                        <Form.Group controlId="registerFormPassword">
                            <Form.Label> Password </Form.Label>
                            <Form.Control type="password" />
                        </Form.Group>

                        <Form.Group controlId="registerFormConfirmPassword">
                            <Form.Label> Confirm Password </Form.Label>
                            <Form.Control type="password" />
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