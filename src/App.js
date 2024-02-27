import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { ChakraProvider } from '@chakra-ui/react';
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
  const [eventInviteData, setEventInviteData] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [numOfEvents, setNumOfEvents] = useState();
  const [numOfInvites, setNumOfInvites] = useState();
  const [editedEvent, setEditedEvent] = useState({});
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

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
        setNumOfEvents(data.length);
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

  //deletes the event if the owner clicks delete button ***
  const handleDeleteEvent = (eventId) => {
    axios.delete(`http://localhost:3003/events/${eventId}`)
    .then(result => {
      console.log('Successful Delete request: ', result);
    })
    .catch(err => {
      console.log('Delete request error: ', err);
    })
    .then(setIsLoaded(false));

    handleDeleteAllEventInvites(eventId);
  }

  const handleEditEvent = (eventId, eventDetails) => {
    //event details should be all of the event details.. make sure to send that! *****
    axios.patch(`http://localhost:3003/events/${eventId}`, {eventDetails})
    .then(result => {
      console.log('Successful Patch request: ', result);
    })
    .catch(err => {
      console.log('Patch request error: ', err);
    })
    .then(setIsLoaded(false));

    //all invites should change to 'Awaiting'
    handleEditAllInvites(eventId);
    //this changes invite response for current user to be 'yes'
    handleEditInvite(currentUser, eventId, 'Yes');
  }


  const openEditForm = (e) => {
    console.log('openEditForm', e);
    setEditedEvent({
      event_id: e.event.eventId,
      event_name: e.event.title,
      event_description: e.event.description,
      event_start: e.event.startStr,
      event_length: e.event.length,
      event_location: e.event.location,
      event_owner: e.event.owner,
      last_edited: moment().format()
    })
    setIsEditFormOpen(true);
  }

  const closeEditForm = () => {
    setIsEditFormOpen(false);
  }

  const handleAddEvent = (name, desc, location, start, length, inviteeNames, inviteeIds) => {
    let data = [{
      event_id: numOfEvents + 1,
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
      let nextInviteId = numOfInvites + 1
      handleAddInvite(currentUser, numOfEvents + 1, nextInviteId);
      inviteeIds.forEach(userId => {
        nextInviteId++;
        handleAddInvite(userId, numOfEvents + 1, nextInviteId);
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
        setNumOfInvites(data.length);
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

  //this isnt doing anything right now... what does this post get? ****
  const getEventInvites = (eventId) => {
    console.log('event', eventId);
    axios.get(`http://localhost:3003/invites/events/${eventId}`)
      .then(({data}) => {
        console.log('event test', data);
        setEventInviteData(data);
        // setEventData(data);
      })
      .catch(err => {
        console.log('Get request error: ', err)
    });
  }

  //if owner deletes the event -- we need to delete all event invites
  const handleDeleteAllEventInvites = (eventId) => {
    axios.delete(`http://localhost:3003/invites/${eventId}`)
    .then(result => {
      console.log('Successful Delete request: ', result);
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
    //response should be sent in the body -- check for this
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
      setNumOfInvites(inviteId);
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
          <span>
            <div>
              EVENTS
            </div>
            {' '}
            <UsersDropdownMenu
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
          showEditForm={isEditFormOpen}
          setEditedEvent={setEditedEvent}
          closeEditForm={closeEditForm}
        />
        {/* default can be calendar view, but on click, change to event view */}
        <CalendarView
          eventData={eventData}
          getEventInvites={getEventInvites}
          userInviteData={userInviteData}
        />
        <EventView
          eventData={eventData}
          getEventInvites={getEventInvites}
          // userData={userData}
          // getUserInvites={getUserInvites}
          userData={userData}
          currentUser={currentUser}
          eventInviteData={eventInviteData}
          userInviteData={userInviteData}
          handleEditEvent={handleEditEvent}
          handleDeleteEvent={handleDeleteEvent}
          handleDeleteInvite={handleDeleteInvite}
          handleDeleteAllEventInvites={handleDeleteAllEventInvites}
          handleEditAllInvites={handleEditAllInvites}
          openEditForm={openEditForm}
        />
      </div>
    </ChakraProvider>
  )
}

export default App;
