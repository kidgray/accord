import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, FormControl } from 'react-bootstrap';
import { gql, useMutation } from '@apollo/client';

const RegisterPage = (props) => {
    // State Hook for the registration form fields
    const [registrationInfo, setRegistrationInfo] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    // State Hook for errors that may occur during registration
    const [errors, setErrors] = useState({});

    // GraphQL MUTATIONS
    const REGISTER_USER = gql`
        mutation register(
            $username: String!
            $password: String!
            $confirmPassword: String!
            $email: String!
        ) {
            register(userInfo: {
                username: $username
                password: $password
                confirmPassword: $confirmPassword
                email: $email
            }) {
                username
                email
                createdAt
            }
        }
    `;

    // useMutation hook returns the mutation execution function and object with mutation state variables
    const [registerUser, { loading }] = useMutation(REGISTER_USER, {
        update: (_, result) => {
            // Redirect user to login page after a successful registration
            props.history.push('/login');
        },
        onError: (err) => {
            // Populate the errors state variable
            setErrors(err.graphQLErrors[0].extensions.errors);
        },
        variables: registrationInfo
    });

    const handleSubmit = (event) => {
        // Prevent page refresh on form submission
        event.preventDefault();

        // Pass the registrationInfo to the registerUser mutation
        registerUser();
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
                            <Form.Label className={errors.username && 'text-danger'}> 
                                Username 
                            </Form.Label>

                            <Form.Control 
                                type="text" 
                                value={registrationInfo.username}
                                onChange={(event) => setRegistrationInfo({ ...registrationInfo, username: event.target.value })}
                                isInvalid={errors.username}
                            />

                            <FormControl.Feedback type="invalid">
                                { errors.username }
                            </FormControl.Feedback>
                        </Form.Group>

                        <Form.Group controlId="registerFormEmail">
                            <Form.Label className={errors.email && 'text-danger'}> 
                                Email Address 
                            </Form.Label>

                            <Form.Control 
                                type="email" 
                                value={registrationInfo.email}
                                onChange={(event) => setRegistrationInfo({ ...registrationInfo, email: event.target.value })}
                                isInvalid={errors.email}
                            />

                            <FormControl.Feedback type="invalid">
                                { errors.email }
                            </FormControl.Feedback>
                        </Form.Group>

                        <Form.Group controlId="registerFormPassword">
                            <Form.Label className={errors.password && 'text-danger'}> 
                                Password 
                            </Form.Label>

                            <Form.Control 
                                type="password" 
                                value={registrationInfo.password}
                                onChange={(event) => setRegistrationInfo({ ...registrationInfo, password: event.target.value })}
                                isInvalid={errors.password}
                            />

                            <FormControl.Feedback type="invalid">
                                { errors.password }
                            </FormControl.Feedback>
                        </Form.Group>

                        <Form.Group controlId="registerFormConfirmPassword">
                            <Form.Label className={errors.password && 'text-danger'}> 
                                Confirm Password 
                            </Form.Label>

                            <Form.Control 
                                type="password" 
                                value={registrationInfo.confirmPassword}
                                onChange={(event) => setRegistrationInfo({ ...registrationInfo, confirmPassword: event.target.value })}
                                isInvalid={errors.confirmPassword}
                            />

                            <FormControl.Feedback type="invalid">
                                { errors.confirmPassword }
                            </FormControl.Feedback>
                        </Form.Group>

                        <Button variant="primary" type="submit" disabled={loading}>
                            { loading ? 'Loading...' : 'Register' }
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
};

export default RegisterPage;