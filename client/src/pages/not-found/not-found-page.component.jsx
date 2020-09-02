import React from 'react';
import { Jumbotron, Button } from 'react-bootstrap';
import { Container } from 'react-bootstrap';

const NotFoundPage = (props) => {
    return (
        <Container className="not-found-container">
            <Jumbotron>
                <h1 className="display-1 not-found-header">404 NOT FOUND</h1>

                <p className="not-found-msg"> The page you're looking for was not found. </p>

                <p>
                    <Button className="not-found-btn" variant="primary" onClick={() => props.history.push('/login')}> 
                        Back to Login page 
                    </Button>
                </p>
            </Jumbotron>
        </Container>
    );
};

export default NotFoundPage;