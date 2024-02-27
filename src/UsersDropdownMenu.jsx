import React from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  Button
} from '@chakra-ui/react';
import Users from './Users';


const UsersDropdownMenu = (props) => {
  return (
  <div>
    <Menu>
      <MenuButton as={Button} variant="outline" colorScheme="green">
        {props.userData && props.userData[props.currentUser - 1] && `${props.userData[props.currentUser - 1].first_name} ${props.userData[props.currentUser - 1].last_name}`}
      </MenuButton>
      <MenuList colorScheme="green">
        {props.userData && props.userData.map((user, i) => {
          if (user.id !== props.currentUser) {
            return (
              <Users
                user= {user}
                key={i}
                handleSwitchUser = {props.handleSwitchUser}
              />
            )
          }
        })}
      </MenuList>
    </Menu>
  </div>
  )
}

export default UsersDropdownMenu;