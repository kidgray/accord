import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { Col, Image } from 'react-bootstrap';

import { useMessageDispatch, useMessageState } from '../../context/message.js';


// GraphQL QUERIES
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
    // Custom Hooks for the Message context
    const { users } = useMessageState();
    const messageDispatch = useMessageDispatch();
    const selectedUser = users?.find((user) => user.selected === true)?.username;

    // Execute the getUsers query with the useQuery hook
    const { loading: usersLoading, data: usersData } = useQuery(GET_USERS, {
        onCompleted: (data) => {
            messageDispatch({ type: 'SET_USERS', payload: data.getUsers });
        },
        onError: (err) => {
            console.log(err);
        }
    });

    // This will contain the JSX for the "user list" section
    let usersMarkup;

    // If the getUsers query returned no results, or is still loading
    if (!users || usersLoading) {
        usersMarkup = <p>Loading . . .</p>
    }
    // Otherwise, if the query was successfully completed, but there 
    // are no other users
    else if (!users.length === 0) {
        usersMarkup = <p>No users have joined yet.</p>
    }
    // Otherwise, render all the users
    else if (users.length > 0) {
        usersMarkup = usersData.getUsers.map((user) => {
            const selected = selectedUser === user.username;

            return (
                <div 
                    className={`user-div justify-content-md-start ${selected && 'bg-white'}`}
                    key={user.username} 
                    onClick={() => messageDispatch({ type: "SET_SELECTED_USER", payload: user.username })}
                    role="button"
                >
                    <Image className="user-img" src={user.imageUrl || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} roundedCircle />
                    <div className="d-none d-md-block ml-2">
                        <p className="text-success"> {user.username} </p>
                        <p className="font-weight-light"> {user.latestMessage ? user.latestMessage.content : "You are now connected!"} </p>
                    </div>
                </div>
            ); 
        });
    }

    return (
        <Col xs={2} md={4} className="user-list"> 
            { usersMarkup } 
        </Col>
    );
};

export default Users;