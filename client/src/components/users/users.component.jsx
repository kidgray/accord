import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { Col, Image } from 'react-bootstrap';

const GET_USERS = gql`
    query getUsers {
        getUsers {
            username
            createdAt
            imageUrl
            latestMessage {
                uuid
                from
                to
                content
                createdAt
            }
        }
    }
`;

const Users = () => {
    // Execute the getUsers query with the useQuery hook
    const { loading: usersLoading, data: usersData, error: usersError } = useQuery(GET_USERS);

    // This will contain the JSX for the "user list" section
    let usersMarkup;

    // If the getUsers query returned no results, or is still loading
    if (!usersData || usersLoading) {
        usersMarkup = <p>Loading . . .</p>
    }
    // Otherwise, if the query was successfully completed, but there 
    // are no other users
    else if (!usersData.getUsers.length === 0) {
        usersMarkup = <p>No users have joined yet.</p>
    }
    // Otherwise, render all the users
    else if (usersData.getUsers.length > 0) {
        usersMarkup = usersData.getUsers.map((user) => (
            <div className="d-flex" key={user.username} onClick={() => setSelectedUser(user.username)}>
                <Image className="mr-2 user-img" src={user.imageUrl} roundedCircle />
                <div>
                    <p className="text-success"> {user.username} </p>
                    <p className="font-weight-light"> {user.latestMessage ? user.latestMessage.content : "You are now connected!"} </p>
                </div>
            </div>
        ));
    }

    return (
        <Col xs={4} className="user-list"> 
            { usersMarkup } 
        </Col>
    );
};

export default Users;