import React from 'react';
import {
  FormLabel,
  Input,
  Menu,
  MenuButton,
  MenuList,
  Button
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import CreateEventInvitee from './CreateEventInvitee';

const CreateEventInviteesInfo = (props) => {
  return (
  <div>
    <FormLabel>Invitees:</FormLabel>
    <Input
      placeholder='Invitees'
      value={props.eventInvitees}
      readOnly
    />
    <Menu>
      <MenuButton 
        as={Button}
        rightIcon={<ChevronDownIcon />}
        variant="outline"
      >
        Add Users
      </MenuButton>
      <MenuList>
      {props.userData && props.userData.map((user, i) => {
        if (user.id !== props.currentUser) {
          return (
            <CreateEventInvitee
              user= {user}
              key={i}
              handleUserClick = {props.handleUserClick}
            />
          )
        }
      })}
      </MenuList>
    </Menu>
  </div>
  )
}

export default CreateEventInviteesInfo;