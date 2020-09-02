import React, { useState } from 'react';
import { Button, Container, Row, Col, Form, FormControl } from 'react-bootstrap';
import { useLazyQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';

// GraphQL QUERY
const LOGIN_USER = gql`
    query login(
        $username: String!
        $password: String!
    ) {
        login(
            username: $username
            password: $password
        ) {
            username
            email
            createdAt
            token
        }
    }
`;

const LoginPage = (props) => {
    // State Hooks for the form fields
    const [loginInfo, setLoginInfo] = useState({
        username: '',
        password: ''
    });

    // State Hook for errors that may occur during login
    const [errors, setErrors] = useState({});

    // useLazyQuery returns a "query execution function" that
    // allows for manual execution of a query. This permits the
    // use of a query inside of a handler function (such as handleSubmit)
    const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
        onCompleted: (data) => {
            console.log(data);

            // Store user's JWT token in Local Storage so that refreshing the page
            // doesn't "log the user out"
            localStorage.setItem('token', data.login.token);

            // Redirect the user to the Home Page on successful login
            props.history.push('/home');
        },
        onError: (err) => {
            console.log(err);

            // Populate the errors object
            setErrors(err.graphQLErrors[0].extensions.errors);
        },
        variables: {
            username: loginInfo.username,
            password: loginInfo.password
        }
    });

    const handleSubmit = (event) => {
        // Prevent the page from refreshing upon form submission
        event.preventDefault();

        // Execute the login query
        loginUser();
    }

    return (
        <Container>
            <Row className="login-row">
                <Col className="login-header-col" sm={8} md={6} lg={4}>
                    <h1 className="display-1 login-page-header"> Login </h1>
                </Col>
            </Row>

            <Row className="login-row">
                <Col sm={8} md={6} lg={4}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="loginFormUsername">
                            <Form.Label className={errors.username && 'text-danger'}> 
                                Username 
                            </Form.Label>

                            <Form.Control 
                                type="text" 
                                value={loginInfo.username}
                                onChange={(event) => setLoginInfo({ ...loginInfo, username: event.target.value })}
                                isInvalid={errors.username}
                            />

                            <FormControl.Feedback type="invalid">
                                { errors.username }
                            </FormControl.Feedback>
                        </Form.Group>

                        <Form.Group controlId="loginFormPassword">
                            <Form.Label className={errors.password && 'text-danger'}> 
                                Password 
                            </Form.Label>

                            <Form.Control 
                                type="password" 
                                value={loginInfo.password}
                                onChange={(event) => setLoginInfo({ ...loginInfo, password: event.target.value })}
                                isInvalid={errors.password}
                            />

                            <FormControl.Feedback type="invalid">
                                { errors.password }
                            </FormControl.Feedback>
                        </Form.Group>

                        <Button variant="primary" type="submit" disabled={loading}> 
                            { loading ? 'Loading...' : 'Login' } 
                        </Button>

                        <p className="registration-link-footer">
                            <small> Don't have an account? 
                                <Link to='/register'> Sign up! </Link> 
                            </small> 
                        </p>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;