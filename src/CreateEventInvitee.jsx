import React from 'react';
import {
  MenuItem
} from '@chakra-ui/react';


const CreateEventInvitee = (props) => {
  return (
  <div>
    <MenuItem onClick={(e) => props.handleUserClick(props.user.id, `${props.user.first_name} ${props.user.last_name}`, e)}>
      {`${props.user.first_name} ${props.user.last_name}`}
    </MenuItem>
  </div>
  )
}

export default CreateEventInvitee;