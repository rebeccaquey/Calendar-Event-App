import React from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  Button
} from '@chakra-ui/react';
import Users from './Users';


const UsersDropdownMenu = (props) => {
  // console.log(props.currentUser, props.userData);
  return (
  <div>
    <Menu>
      <MenuButton as={Button} variant="outline" colorScheme="green">
        {props.userData && props.userData[props.currentUser - 1] && `${props.userData[props.currentUser - 1].first_name} ${props.userData[props.currentUser - 1].last_name}`}
      </MenuButton>
      <MenuList colorScheme="green">
        {props.userData && props.userData.map((user, i) => (
          <Users 
            user= {user}
            key={i}
            handleSwitchUser = {props.handleSwitchUser}
            getUserInvites={props.getUserInvites}
            inviteData={props.inviteData}
            eventData={props.eventData}
            currentUser={props.currentUser}
          />
          ))}
      </MenuList>
    </Menu>
  </div>
  )
}

export default UsersDropdownMenu;