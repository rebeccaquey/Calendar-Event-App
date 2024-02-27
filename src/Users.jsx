import React from 'react';
import {
  MenuItem
} from '@chakra-ui/react';


const Users = (props) => {
  return (
  <div>
    <MenuItem onClick={(e) => props.handleSwitchUser(props.user.id, e)} colorScheme="green">
      {`${props.user.first_name} ${props.user.last_name}`}
    </MenuItem>
  </div>
  )
}

export default Users;