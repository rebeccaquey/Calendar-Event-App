import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { ChakraProvider } from '@chakra-ui/react';
import moment from 'moment';
import { Button, ButtonGroup } from '@chakra-ui/react';
import CalendarView from './CalendarView.jsx';

function App() {
  const [userData, setUserData] = useState();
  const [eventData, setEventData] = useState();
  const [inviteData, setInviteData] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [eventToEdit, setEventToEdit] = useState();
  const [modalAction, setModalAction] = useState('');

  const handleChange = (data) => {
    setIsLoaded(false);
    axios.post('http://localhost:3003/', data)
      .then(result => {
        console.log('Successful Post request: ', result);
      })
      .catch(err => {
        console.log('Post request error: ', err);
      });
  }

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
        setIsLoaded(true);
      })
      .catch(err => {
        console.log('Get request error: ', err)
    });
  }

  const getEvent = (eventId) => {
    axios.get(`http://localhost:3003/events/${eventId}`)
      .then(({data}) => {
        setEventData(data);
        setIsLoaded(true);
      })
      .catch(err => {
        console.log('Get request error: ', err)
    });
  }

  const handleDeleteEvent = (eventId) => {
    axios.delete(`/events/${eventId}`)
    .then(result => {
      console.log('Successful Delete request: ', result);
    })
    .catch(err => {
      console.log('Delete request error: ', err);
    })
    .then(setIsLoaded(false))
  }

  const handleEditEvent = (eventId, eventDetails) => {
    //event details should be all of the event details.. make sure to send that
    axios.patch(`/events/${eventId}`, {eventDetails})
    .then(result => {
      console.log('Successful Patch request: ', result);
    })
    .catch(err => {
      console.log('Patch request error: ', err);
    })
    .then(setIsLoaded(false))
  }

  const handleAddEvent = (eventId, name, desc, start, length, location) => {
    let data = [{
      event_name: name,
      event_description: desc,
      event_start: start,
      event_length: length,
      event_location: location,
      creation_time: moment().format(),
      last_edited: moment().format()
    }]
    console.log(data);
    axios.post(`http://localhost:3003/events/${eventId}`, data)
    .then(result => {
      console.log('Successful Post request: ', result);
    })
    .catch(err => {
      console.log('Post request error: ', err);
    })
    .then(setIsLoaded(false))
  }

  const getUserInvites = (userId) => {
    axios.get(`http://localhost:3003/invites/${userId}`)
      .then(({data}) => {
        setInviteData(data);
        setIsLoaded(true);
      })
      .catch(err => {
        console.log('Get request error: ', err)
    });
  }

  const getEventInvites = (eventId) => {
    axios.get(`http://localhost:3003/invites/${eventId}`)
      .then(({data}) => {
        setInviteData(data);
        setIsLoaded(true);
      })
      .catch(err => {
        console.log('Get request error: ', err)
    });
  }

  const handleDeleteAllEventInvites = (eventId) => {
    axios.delete(`/invites/${eventId}`)
    .then(result => {
      console.log('Successful Delete request: ', result);
    })
    .catch(err => {
      console.log('Delete request error: ', err);
    })
    .then(setIsLoaded(false))
  }

  const handleDeleteAllUserInvites = (userId) => {
    axios.delete(`/invites/${userId}`)
    .then(result => {
      console.log('Successful Delete request: ', result);
    })
    .catch(err => {
      console.log('Delete request error: ', err);
    })
    .then(setIsLoaded(false))
  }

  const handleDeleteInvite = (userId, eventId) => {
    axios.delete(`/invites/${userId}/${eventId}`)
    .then(result => {
      console.log('Successful Delete request: ', result);
    })
    .catch(err => {
      console.log('Delete request error: ', err);
    })
    .then(setIsLoaded(false))
  }

  const handleEditAllInvites = (eventId) => {
    axios.patch(`/invites/${eventId}`)
    .then(result => {
      console.log('Successful Patch request: ', result);
    })
    .catch(err => {
      console.log('Patch request error: ', err);
    })
    .then(setIsLoaded(false))
  }

  const handleEditInvite = (userId, eventId, response) => {
    console.log('response', response);
    //response should be sent in the body -- check for this
    axios.patch(`/invites/${userId}/${eventId}`, {response})
    .then(result => {
      console.log('Successful Patch request: ', result);
    })
    .catch(err => {
      console.log('Patch request error: ', err);
    })
    .then(setIsLoaded(false))
  }

  const handleAddInvite = (userId, eventId) => {
    let data = [{
      user_id: userId,
      event_id: eventId,
    }]
    console.log(data);
    axios.post(`http://localhost:3003/invites`, data)
    .then(result => {
      console.log('Successful Post request: ', result);
    })
    .catch(err => {
      console.log('Post request error: ', err);
    })
    .then(setIsLoaded(false))
  }

  const handleHideModal = () => {
    setShowModal(false);
  }

  const handleModalClick = (action) => {
    setShowModal(!showModal);
    setModalAction(action);
  }

  const handleEditClick = (e) => {
    setEventToEdit(e)
  }

  useEffect(() => {
    getEvents();
  }, [isLoaded]);


  return (
    <ChakraProvider>
      <div className="App">
        <header className="App-header">
          <span>
            Rebecca
            {' '}
            <Button variant="outline" colorScheme="green">
            {/* onClick={} --> have a dropdown where it lists all the users and you can pick to show the diff events that user has */}
              R
            </Button>
          </span>
        </header>
        <body className="App-body">
          <CalendarView />
        </body>
      </div>
    </ChakraProvider>
  )
}

export default App;
