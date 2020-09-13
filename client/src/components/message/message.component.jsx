import React from 'react';
import moment from 'moment';
import { OverlayTrigger, Popover } from 'react-bootstrap';


// HOOKS
import { useAuthState } from '../../context/auth.js';

const Message = (props) => {
    // Get the currently authenticated user from the authentication context
    const { user } = useAuthState();
    
    // Check whether this instance of the Message component corresponds to
    // a message sent by the currently authenticated user (the person logged in)
    // If this message was not SENT by the currently authenticated user, it must
    // have been RECEIVED by the currently authenticated user (i.e. sent by the other party)
    const sent = props.message.from === user.username;

    return (
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
            <div className="d-flex my-3">
                <div className={`py-2 px-3 rounded-pill ` + (sent ? `bg-success ml-auto` : `bg-secondary mr-auto`)}>
                    <p className="text-white"> { props.message.content } </p>
                </div>
            </div>
      </OverlayTrigger>
    );
};

export default Message;