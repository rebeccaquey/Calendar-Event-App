import React, { useState } from 'react';
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
  useDisclosure
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import CreateEventInviteesInfo from './CreateEventInviteesInfo';

const CreateEvent = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [eventName, setEventName] = useState('(No title)');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDateAndTime, setEventDateAndTime] = useState('');
  const [eventLength, setEventLength] = useState(30);
  const [eventInvitees, setEventInvitees] = useState('');
  const [eventInviteeIds, setEventInviteeIds] = useState([]);

  const handleChanges = (e) => {
    let currentPlaceholder = e.target.placeholder;
    let currentVal = e.target.value;
    if (currentPlaceholder === 'Title') {
      setEventName(currentVal);
    } else if (currentPlaceholder ==='Event Date and Time') {
      setEventDateAndTime(currentVal);
    } else if (currentPlaceholder === 'Description') {
      setEventDescription(currentVal);
    } else if (currentPlaceholder === 'Location') {
      setEventLocation(currentVal);
    }
  }

  const handleEventLengthChanges = (length) => {
    setEventLength(Number(length));
  }

  const handleUserClick = (userId, fullName, e) => {
    let currentInvitees = eventInvitees;
    let currentInviteeIds = eventInviteeIds;

    //check if the name is already included; if it is, remove; otherwise, add
    if (currentInviteeIds.includes(userId)) {
      currentInvitees = eventInvitees.replace(fullName, '');
      currentInviteeIds = currentInviteeIds.filter(id => id !== userId);
    } else {
      currentInvitees += `${e.target.textContent}`
      currentInviteeIds.push(userId);
    }

    setEventInvitees(currentInvitees);
    setEventInviteeIds(currentInviteeIds);
  }

  const handleSubmit = () => {
    props.handleAddEvent(eventName, eventDescription, eventLocation, eventDateAndTime, eventLength, eventInvitees, eventInviteeIds);
    setEventName('(No title)');
    setEventDescription('');
    setEventLocation('');
    setEventDateAndTime('');
    setEventLength(30);
    setEventInvitees([]);
    setEventInviteeIds([]);
    onClose();
  }

  return (
  <div>
    <Button variant="outline" colorScheme="green" onClick={onOpen}>
      Create Event {<AddIcon />}
    </Button>

    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Event Title:</FormLabel>
              <Input 
                placeholder='Title' 
                onChange={handleChanges}
              />
              <FormLabel>Event Date & Time:</FormLabel>
              <Input
                placeholder="Event Date and Time"
                size="md"
                type="datetime-local"
                onChange={handleChanges}
                />
              <FormLabel>Event Length:</FormLabel>
              <NumberInput step={5} defaultValue={eventLength} min={5} max={240} onChange={handleEventLengthChanges}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormLabel>Location:</FormLabel>
              <Input 
                placeholder='Location' 
                onChange={handleChanges}
              />
              <FormLabel>Description:</FormLabel>
              <Textarea 
                placeholder='Description' 
                onChange={handleChanges}
              />
              <CreateEventInviteesInfo
                userData={props.userData}
                currentUser={props.currentUser}
                handleUserClick={handleUserClick}
                eventInvitees={eventInvitees}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme='green'
              type='submit'
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>    
  </div>
  )
}

export default CreateEvent;