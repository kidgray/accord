import React, { useState } from 'react';
import moment from 'moment';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { gql, useMutation } from '@apollo/client';

// HOOKS
import { useAuthState } from '../../context/auth.js';

// GraphQL MUTATIONS
const REACT_TO_MESSAGE = gql`
    mutation reactToMessage($uuid: String! $content: String!) {
        reactToMessage(
            uuid: $uuid 
            content: $content
        ) {
            uuid
        }
    }
`;

// These are the emojis that a user may react to a post with
const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎'];

const Message = (props) => {
    // State variable for 
    const [showPopover, setShowPopover] = useState(false);

    // Get the currently authenticated user from the authentication context
    const { user } = useAuthState();

    // Make sure each reaction icon is displayed only once by putting the individual reactions
    // in a Set
    const reactionIcons = [...new Set(props.message.reactions.map((reaction) => reaction.content))];

    // Get the GraphQL Mutation execution function for reactions to messages
    const [reactToMessage, { data, loading, error }] = useMutation(REACT_TO_MESSAGE, {
        onCompleted: (data) => {
            // Once we have successfully reacted to a message, close the popover
            // containing the reactions
            setShowPopover(false);
        },
        onError: (err) => {
            console.log(err);
        }
    });
    
    // Check whether this instance of the Message component corresponds to
    // a message sent by the currently authenticated user (the person logged in)
    // If this message was not SENT by the currently authenticated user, it must
    // have been RECEIVED by the currently authenticated user (i.e. sent by the other party)
    const sent = props.message.from === user.username;

    const react = (reaction) => {
        // Execute the reactToMessage mutation
        reactToMessage({
            variables: {
                uuid: props.message.uuid,
                content: reaction
            }
        });
    }
    
    // This Button will store the reaction emoticons for messages
    const reactButton = (
        <OverlayTrigger
            trigger="click"
            placement="top"
            show={showPopover}
            onToggle={setShowPopover}
            transition={false}
            rootClose
            overlay={
                <Popover
                    className="rounded-pill d-flex align-items-center react-btn-popover"
                >
                    <Popover.Content>
                        {
                            reactions.map((reaction) => 
                                <Button 
                                    variant="link" 
                                    className="reaction-btn"
                                    key={reaction}
                                    onClick={() => react(reaction)}
                                >
                                    { reaction }
                                </Button>
                            )
                        }
                    </Popover.Content>
                </Popover>
            }
        >
            <Button variant="link" className="px-2">
                <i className="far fa-smile"></i>
            </Button>
        </OverlayTrigger>
    );

    return (
        <div className={`d-flex my-3 ` + ( sent ? `ml-auto` : `mr-auto`)}>
            { sent && reactButton }

            <OverlayTrigger
                trigger={['hover', 'focus']}
                placement={sent ? 'right' : 'left'}
                overlay={
                    <Popover>
                        <Popover.Content>
                        { moment(props.message.createdAt).format('MMMM DD, YYYY @ h:mm a')}
                        </Popover.Content>
                    </Popover>
                }
            >
                <div className={`py-2 px-3 rounded-pill position-relative ` + (sent ? `bg-success ml-auto` : `bg-secondary mr-auto`)}>
                    <p className="text-white"> { props.message.content } </p>

                    {
                        props.message.reactions.length > 0 
                        &&
                        <div className="reactions-div p-1 rounded-pill">
                            { reactionIcons } { props.message.reactions.length }
                        </div>
                    }
                </div>
            </OverlayTrigger>

            { !sent && reactButton }
      </div>
    );
};

export default Message;