import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import {
  ChakraProvider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import moment from 'moment';
import CalendarView from './CalendarView.jsx';
import EventView from './EventView';
import UsersDropdownMenu from './UsersDropdownMenu';
import CreateEvent from './CreateEvent';
import EditEvent from './EditEvent';

function App() {
  const [userData, setUserData] = useState();
  const [currentUser, setCurrentUser] = useState(1);
  const [userInviteData, setUserInviteData] = useState();
  const [eventData, setEventData] = useState();
  const [inviteData, setInviteData] = useState();
  const [eventInviteData, setEventInviteData] = useState([]);
  const [originalInviteeInfo, setOriginalInviteeInfo] = useState({});
  const [updatedInviteeInfo, setUpdatedInviteeInfo] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [latestEventId, setLatestEventId] = useState();
  const [latestInviteId, setLatestInviteId] = useState();
  const [editedEvent, setEditedEvent] = useState({});
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [inviteesEdited, setInviteesEdited] = useState(false);
  const [isEventEdited, setIsEventEdited] = useState(false);

  const getUsers = () => {
    axios.get('http://localhost:3003/users')
      .then(({data}) => {
        setUserData(data);
        setIsLoaded(true);
      })
      .catch(err => {
        console.log('Get request error: ', err)
    });
  }

  const getEvents = () => {
    axios.get('http://localhost:3003/events')
      .then(({data}) => {
        setEventData(data);
        setLatestEventId(data[data.length-1].id);
        setIsLoaded(true);
      })
      .catch(err => {
        console.log('Get request error: ', err)
    });
  }

  //get event details for individual event --> might not call this route much?
  // const getEvent = (eventId) => {
  //   axios.get(`http://localhost:3003/events/${eventId}`)
  //     .then(({data}) => {
  //       setEventData(data);
  //       setIsLoaded(true);
  //     })
  //     .catch(err => {
  //       console.log('Get request error: ', err)
  //   });
  // }

  //deletes the event after all event invites are deleted
  const handleDeleteEvent = (eventId) => {
    axios.delete(`http://localhost:3003/events/${eventId}`)
    .then(result => {
      console.log('Successful Delete request: ', result);
    })
    .catch(err => {
      console.log('Delete request error: ', err);
    })
    .then(setIsLoaded(false));
  }

  const handleEditEvent = (eventId, eventDetails, inviteeInfo) => {
    axios.patch(`http://localhost:3003/events/${eventId}`, {eventDetails})
    .then(result => {
      console.log('Successful Patch request: ', result);
    })
    .catch(err => {
      console.log('Patch request error: ', err);
    })
    .then(setIsLoaded(false));

    //if invitees were edited:
    if (inviteesEdited) {
      let nextInviteId = latestInviteId + 1;
      for (let userId in inviteeInfo) {
        const response = inviteeInfo[userId][1];
        if (response === 'Added') {
          handleAddInvite(userId, eventId, nextInviteId);
          nextInviteId++;
        } else if (response === 'Deleted') {
          handleDeleteInvite(userId, eventId);
        } else if (isEventEdited) {
          handleEditInvite(userId, eventId, 'Awaiting');
        // } else {
          //if we allow users to respond:
          // handleEditInvite(userId, eventId, response);
        }
      }
      setInviteesEdited(false);

      //invitees not edited, but event was edited!
    }  else if (isEventEdited) {
      //all invites should change to 'Awaiting'
      handleEditAllInvites(eventId);
      //this changes invite response for current user to be 'yes'
      handleEditInvite(currentUser, eventId, 'Yes');
      setIsEventEdited(false);
    }

    setOriginalInviteeInfo(inviteeInfo);
    setEditedEvent({
      id: eventId,
      name: eventDetails.name,
      description: eventDetails.description,
      start: eventDetails.start,
      length: eventDetails.length,
      location: eventDetails.location,
      owner: eventDetails.owner,
      last_edited: eventDetails.last_edited
    })
  }

  const handleAddEvent = (name, desc, location, start, length, inviteeNames, inviteeIds) => {
    let data = [{
      event_id: latestEventId + 1,
      event_name: name,
      event_description: desc,
      event_start: start,
      event_length: length,
      event_location: location,
      event_owner: currentUser,
      creation_time: moment().format(),
      last_edited: moment().format()
    }]

    axios.post(`http://localhost:3003/events`, data)
    .then(result => {
      console.log('Successful Post request: ', result);
      //send to current user, and all the invitees
      let nextInviteId = latestInviteId + 1
      handleAddInvite(currentUser, latestEventId + 1, nextInviteId);
      inviteeIds.forEach(userId => {
        nextInviteId++;
        handleAddInvite(userId, latestEventId + 1, nextInviteId);
      })
    })
    .catch(err => {
      console.log('Post request error: ', err);
    })
    .then(setIsLoaded(false));
  }

  const getAllInvites = () => {
    axios.get('http://localhost:3003/invites')
      .then(({data}) => {
        setInviteData(data);
        setLatestInviteId(data[data.length-1].id);
        setIsLoaded(true);
      })
      .catch(err => {
        console.log('Get request error: ', err)
    });
  }

  const getUserInvites = (userId) => {
    axios.get(`http://localhost:3003/invites/events/users/${userId}`)
      .then(({data}) => {
        setUserInviteData(data);
      })
      .catch(err => {
        console.log('Get request error: ', err)
    });
  }

  const getEventInvites = (eventId) => {
    axios.get(`http://localhost:3003/invites/events/${eventId}`)
      .then(({data}) => {
        setEventInviteData(data);
        const eventInviteeResponses = {};
        for (let i = 0; i < data.length; i++) {
          const invite = data[i];
          if (invite.user_id !== currentUser) {
            const fullName = `${invite.first_name} ${invite.last_name}`;
            eventInviteeResponses[invite.user_id] = [fullName, invite.response]
          }
        }
        setOriginalInviteeInfo(eventInviteeResponses);
        setUpdatedInviteeInfo(Object.assign({}, eventInviteeResponses));
      })
      .catch(err => {
        console.log('Get request error: ', err)
    });
  }

  //if owner deletes the event, we need to delete all event invites and then delete the actual event
  const handleDeleteAllEventInvites = (eventId) => {
    axios.delete(`http://localhost:3003/invites/${eventId}`)
    .then(result => {
      console.log('Successful Delete request: ', result);
      handleDeleteEvent(eventId);
    })
    .catch(err => {
      console.log('Delete request error: ', err);
    })
  }

  //deletes all invites for user (if deleting a user) --> wont be called right now
  // const handleDeleteAllUserInvites = (userId) => {
  //   axios.delete(`http://localhost:3003/invites/${userId}`)
  //   .then(result => {
  //     console.log('Successful Delete request: ', result);
  //   })
  //   .catch(err => {
  //     console.log('Delete request error: ', err);
  //   })
  // }

  //deletes invite for individual user -- owner can remove people from invitation list...
  const handleDeleteInvite = (userId, eventId) => {
    axios.delete(`http://localhost:3003/invites/${userId}/${eventId}`)
    .then(result => {
      console.log('Successful Delete request: ', result);
    })
    .catch(err => {
      console.log('Delete request error: ', err);
    })
  }

  const handleEditAllInvites = (eventId) => {
    axios.patch(`http://localhost:3003/invites/${eventId}`)
    .then(result => {
      console.log('Successful Patch request: ', result);
    })
    .catch(err => {
      console.log('Patch request error: ', err);
    })
  }

  const handleEditInvite = (userId, eventId, response) => {
    axios.patch(`http://localhost:3003/invites/${userId}/${eventId}`, {response})
    .then(result => {
      console.log('Successful Patch request: ', result);
    })
    .catch(err => {
      console.log('Patch request error: ', err);
    })
  }

  const handleAddInvite = (userId, eventId, inviteId) => {
    const data = [{
      invite_id: inviteId,
      user_id: userId,
      event_id: eventId,
    }]
    axios.post(`http://localhost:3003/invites`, data)
    .then(result => {
      console.log('Successful Post request: ', result);
      setLatestInviteId(inviteId);
      //mark current user's response as yes
      if (userId === currentUser) {
        handleEditInvite(currentUser, eventId, 'Yes');
      }
    })
    .catch(err => {
      console.log('Post request error: ', err);
    })
  }

  const handleSwitchUser = (userId, e) => {
    setCurrentUser(userId);
    getUserInvites(userId);
  }

  const openEditEvent = (e) => {
    setEditedEvent({
      id: e.event.extendedProps.eventId,
      name: e.event.title,
      description: e.event.extendedProps.description,
      start: e.event.startStr,
      length: e.event.extendedProps.length,
      location: e.event.extendedProps.location,
      owner: e.event.extendedProps.owner,
      last_edited: e.event.extendedProps.lastEdited
    })
    setIsEditEventOpen(true);
  }

  const closeEditEvent = () => {
    setIsEditEventOpen(false);
  }

  useEffect(() => {
    getEvents();
    getUsers();
    getAllInvites();
    getUserInvites(currentUser);
  }, [isLoaded]);

  return (
    <ChakraProvider>
      <div className="App">
        <header className="App-header">
          <span className='title'>
            CALENDAR EVENTS
          </span>
          <span className='menu'>
            <UsersDropdownMenu
              className='dropdown'
              userData={userData}
              currentUser={currentUser}
              handleSwitchUser={handleSwitchUser}
            />
          </span>
        </header>
        <CreateEvent
          handleAddEvent={handleAddEvent}
          userData={userData}
          currentUser={currentUser}
        />
        <EditEvent
          showEditEvent={isEditEventOpen}
          editedEvent={editedEvent}
          setEditedEvent={setEditedEvent}
          closeEditEvent={closeEditEvent}
          handleEditEvent={handleEditEvent}
          userData={userData}
          currentUser={currentUser}
          getEventInvites={getEventInvites}
          eventInviteData={eventInviteData}
          setInviteesEdited={setInviteesEdited}
          setUpdatedInviteeInfo={setUpdatedInviteeInfo}
          updatedInviteeInfo={updatedInviteeInfo}
          setOriginalInviteeInfo={setOriginalInviteeInfo}
          originalInviteeInfo={originalInviteeInfo}
          setIsEventEdited={setIsEventEdited}
          handleDeleteAllEventInvites={handleDeleteAllEventInvites}
        />
        <Tabs isLazy className='calendar-events' variant='enclosed' colorScheme='green'>
          <TabList>
            <Tab>Calendar</Tab>
            <Tab>Event</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <CalendarView
                userInviteData={userInviteData}
                openEditEvent={openEditEvent}
              />
            </TabPanel>
            <TabPanel>
              <EventView
                userInviteData={userInviteData}
                openEditEvent={openEditEvent}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </ChakraProvider>
  )
}

export default App;
