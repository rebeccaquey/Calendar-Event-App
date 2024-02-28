import React, { useEffect, useState } from 'react';
import {
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Textarea,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react';
import { ChevronUpIcon } from '@chakra-ui/icons';
import moment from 'moment';

const EditEvent = (props) => {

  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDateAndTime, setEventDateAndTime] = useState('');
  const [eventLength, setEventLength] = useState();
  const [isEventInviteesLoaded, setIsEventInviteesLoaded] = useState(false);

  let inviteResults;
  if (props.showEditEvent && !isEventInviteesLoaded) {
    inviteResults = props.getEventInvites(props.editedEvent.id);
    setIsEventInviteesLoaded(true);
  }

  const handleChanges = (e) => {
    let id = e.target.id;
    let currentVal = e.target.value;
    if (id === 'title') {
      setEventName(currentVal);
    } else if (id ==='start') {
      setEventDateAndTime(currentVal);
    } else if (id === 'location') {
      setEventLocation(currentVal);
    } else if (id === 'description') {
      setEventDescription(currentVal);
    }
    props.setIsEventEdited(true);
  }

  const currentInviteeInfo = Object.assign({}, props.updatedInviteeInfo);
  let namesOfCurrentInvitees = '';
  for (let user in currentInviteeInfo) {
    if (currentInviteeInfo[user][1] !== 'Deleted') {
      namesOfCurrentInvitees += currentInviteeInfo[user][0];
    } else {
      namesOfCurrentInvitees = namesOfCurrentInvitees.replace(currentInviteeInfo[user][0], "");
    }
  }

  const handleEventLengthChanges = (length) => {
    setEventLength(Number(length));
    props.setIsEventEdited(true);
  }

  const handleUserClick = (userId, fullName, e) => {
    if (!currentInviteeInfo[userId]) {
      currentInviteeInfo[userId] = [fullName, 'Added']
    } else if (currentInviteeInfo[userId][1] === 'Deleted') {
      currentInviteeInfo[userId] = props.originalInviteeInfo[userId] || [fullName, 'Added'];
    } else if (props.originalInviteeInfo[userId]) {
      currentInviteeInfo[userId] = [fullName, 'Deleted'];
    } else {
      delete currentInviteeInfo[userId];
    }

    props.setInviteesEdited(true);
    props.setUpdatedInviteeInfo(currentInviteeInfo);
  }

  const handleSubmit = () => {
    const eventDetails = {
      id: props.editedEvent.id,
      name: eventName || props.editedEvent.name,
      description: eventDescription || props.editedEvent.description,
      start: eventDateAndTime || props.editedEvent.start,
      length: eventLength || props.editedEvent.length,
      location: eventLocation || props.editedEvent.location,
      owner: props.editedEvent.owner,
      last_edited: moment().format()
    };
    props.handleEditEvent(props.editedEvent.id, eventDetails, props.updatedInviteeInfo);
    props.setEditedEvent(eventDetails);
    setEventName('');
    setEventDescription('');
    setEventLocation('');
    setEventDateAndTime('');
    setEventLength(30);

    props.closeEditEvent();
    setIsEventInviteesLoaded(false);
  }

  const handleClose = () => {
    props.setUpdatedInviteeInfo(props.originalInviteeInfo);
    props.setInviteesEdited(false);
    props.setIsEventEdited(false);
    props.closeEditEvent();
    setIsEventInviteesLoaded(false);
  }

  let formattedEventStart = '';
  if (props.editedEvent.start) {
    formattedEventStart = props.editedEvent.start.slice(0,-9);
  }

  return (
    <Modal isOpen={props.showEditEvent} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Event Title:</FormLabel>
            <Input
              id="title"
              defaultValue={props.editedEvent.name}
              onChange={handleChanges}
            />
            <FormLabel>Event Date & Time:</FormLabel>
            <Input
              value={eventDateAndTime || formattedEventStart}
              id="start"
              size="md"
              type="datetime-local"
              onChange={handleChanges}
              />
            <FormLabel>Event Length:</FormLabel>
            <NumberInput
              step={5}
              defaultValue={props.editedEvent.length}
              min={5}
              max={240}
              onChange={handleEventLengthChanges}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormLabel>Location:</FormLabel>
            <Input
              id="location"
              defaultValue={props.editedEvent.location}
              onChange={handleChanges}
            />
            <FormLabel>Description:</FormLabel>
            <Textarea
              id="description"
              defaultValue={props.editedEvent.description}
              onChange={handleChanges}
            />
        
            <FormLabel>Invitees:</FormLabel>
            <Input
              placeholder='Invitees'
              value={namesOfCurrentInvitees}
              readOnly
            />
            <Menu>
              <MenuButton 
                as={Button}
                rightIcon={<ChevronUpIcon />}
                variant="outline"
              >
                Users
              </MenuButton>
              <MenuList>
              {props.userData && props.userData.map((user, i) => {
                if (user.id !== props.currentUser) {
                  return (
                    <MenuItem onClick={(e) => handleUserClick(user.id, `${user.first_name} ${user.last_name}`, e)}>
                    {`${user.first_name} ${user.last_name}`}
                  </MenuItem>
                  )
                }
              })}
              </MenuList>
            </Menu>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme='green'
            type='submit'
            onClick={handleSubmit}
          >
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default EditEvent;