const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const path = require('path');
const moment = require('moment');

const twilio = require('twilio');
const Twilio = require('./twilio.js');
const accountSid = Twilio.accountSid;
const authToken = Twilio.authToken;
const twilioNumber = Twilio.twilioPhoneNumber;
const myPhoneNumber = Twilio.myPhoneNumber;
const client = new twilio(accountSid, authToken);

const database = require('./db/index.js');
const app = express();
const port = 3003;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());
app.use(express.static('public'));


const sendImmediateNotification = (from, to, body, res) => {
  console.log(from, to, body);
  client.messages
  .create({ from, to, body })
  .then((message) => {
    console.log(`SMS message sent from ${from} to ${to}. Message: ${body}; ${message}`);
    res.send(JSON.stringify({ success: true }));
  })
  .catch(err => {
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  });
}

const sendPostponedNotification = (from, to, body, sendAt, res) => {
  client.messages
  .create({
    scheduleType: 'fixed',
    messagingServiceSid: 'INSERT MESSAGING SERVICE SID HERE',
    to,
    body,
    sendAt
  })
  .then((message) => {
    console.log(`SMS message sent from ${from} to ${to}. Message SID: ${message.sid}`);
    res.send(JSON.stringify({ success: true }));
  })
  .catch(err => {
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  });
}

//add notifications for each user for an event
app.post('/notifications/:eventId/:userId', (req, res) => {
  console.log(`Create notification for eventId: ${req.params.eventId} for userId: ${req.params.userId}`);

  const msPerMin = 60000;
  const thirtyMinInMs = 30 * msPerMin;

  const notificationQuery = `SELECT email, event_name, event_start
    FROM events
    INNER JOIN invites
    ON invites.event_id = events.id
    INNER JOIN users
    ON users.id = invites.user_id
    where events.id = ${req.params.eventId} and users.id = ${req.params.userId}`;

  database.query(notificationQuery, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      const userEmail = results[0].email
      const eventName = results[0].event_name;
      const eventStart = results[0].event_start;

      const message = `Notification: ${eventName} @ ${eventStart}`;

      const currentTime = new Date();
      const thirtyMinBefore = new Date(eventStart - thirtyMinInMs);
      const formattedThirty = moment(new Date(eventStart - thirtyMinInMs)).format("YYYY-MM-DDT00:00:00.000") + "Z";
      //if currentTime is within 30 min of event
      if (thirtyMinBefore < currentTime) {
        //send to userEmail (Twilio doesn't do this, but we will send to my number);
        // sendImmediateNotification(twilioNumber, userEmail, message, res);

        sendImmediateNotification(twilioNumber, myPhoneNumber, message, res);
      } else {
        console.log(`Create scheduled message to send at this time: ${formattedThirty}`);
        //send scheduled at thirtyMinBefore
        sendPostponedNotification(twilioNumber, myPhoneNumber, message, formattedThirty, res);
      }
    }
  })
})

//update notifications if event TIME was edited
app.put('/notifications/:eventId/:userId', (req, res) => {
  console.log(`Update notification for eventId: ${req.params.eventId} for userId: ${req.params.userId}`);

  const msPerMin = 60000;
  const thirtyMinInMs = 30 * msPerMin;

  const notificationQuery = `SELECT email, event_name, event_start
    FROM events
    INNER JOIN invites
    ON invites.event_id = events.id
    INNER JOIN users
    ON users.id = invites.user_id
    where events.id = ${req.params.eventId} and users.id = ${req.params.userId}`;

  database.query(notificationQuery, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      const userEmail = results[0].email
      const eventName = results[0].event_name;
      const eventStart = results[0].event_start;

      const message = `Notification: ${eventName} @ ${eventStart}`;

      // const currentTime = new Date();
      // const thirtyMinBefore = new Date(eventStart - thirtyMinInMs);
      // const formattedThirty = moment(new Date(eventStart - thirtyMinInMs)).format("YYYY-MM-DDT00:00:00.000") + "Z";

      // //if currentTime is within 30 min of event
      // if (thirtyMinBefore < currentTime) {

        //twilios update message is mainly for changing the contents of the message, not changing the time...
        client.messages('MSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
        .update({body: message})
        .then(message => console.log(message.to));

      // } else {
      //   //send scheduled at thirtyMinBefore

      //   client.messages('MSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
      //   .update({body: message})
      //   .then(message => console.log(message.to));
      // }
    }
  })
})

//delete notifications if event is deleted
app.delete('/notifications/:eventId', (req, res) => {
  console.log(`Delete all notifications for eventId: ${req.params.eventId}.`);

  //would need to store message SID somewhere so that i can grab it here...

  // const notificationQuery = `SELECT email, event_name, event_start
  // FROM events
  // INNER JOIN invites
  // ON invites.event_id = events.id
  // INNER JOIN users
  // ON users.id = invites.user_id
  // where events.id = ${req.params.eventId}`;

  // database.query(notificationQuery, (err, results) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     results.forEach(invite => {
  //       console.log(invite);
        //get the message SID for each result from the database query
        client.messages('INSERT MESSAGE SID HERE')
        .update({status: 'canceled'})
        .then(message => console.log(message.to));
  //     })
  //   }
  // })

  //this could also delete messages:
  // client.messages('MMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX').remove();
})

//delete notification for user if they decline (doesnt matter atm since not doing anything for responses)
//and delete notification if user is removed
app.delete('/notifications/:eventId/:userId', (req, res) => {
  console.log(`Delete notification for eventId: ${req.params.eventId} for userId: ${req.params.userId}.`);

  //would need to store message SID somewhere so that i can grab it here...

  // const notificationQuery = `SELECT email, event_name, event_start
  // FROM events
  // INNER JOIN invites
  // ON invites.event_id = events.id
  // INNER JOIN users
  // ON users.id = invites.user_id
  // where events.id = ${req.params.eventId} and users.id = ${req.params.userId}`

  // database.query(notificationQuery, (err, results) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
      // get the message SID for each result from the database query
      client.messages('INSERT MESSAGE SID HERE')
      .update({status: 'canceled'})
      .then(message => console.log(message.to));
    // }
  // })
})



//read route for all users:
app.get('/users', (req, res) => {
  database.query(`select * from users`, (err, results) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

//read route for all events:
app.get('/events', (req, res) => {
  database.query(`select * from events`, (err, results) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});


//read route for individual events:
app.get('/events/:eventId', (req, res) => {
  database.query(`select * from events where id = ${req.params.eventId}`, (err, results) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

//create route for an event:
app.post('/events', (req, res) => {
  const result = [];
  req.body.forEach((ele) => {
    const creationTime = moment(ele.creation_time).format('lll');
    const lastEdited = moment(ele.last_edited).format('lll');
    result.push(
      [
        ele.event_id,
        ele.event_name,
        ele.event_description,
        ele.event_start,
        ele.event_length,
        ele.event_location,
        ele.event_owner,
        creationTime,
        lastEdited
      ]
    )
  })

  const postQuery = `insert into events (id, event_name, event_description, event_start, event_length, event_location, event_owner, creation_time, last_edited) values ?`;

  database.query(postQuery, [result], (err, results) => {
    if (err) {
      console.log('err', err);
      res.status(400).send(err);
    } else {
      res.status(200).send(results);
    }
  })
});

//delete route for an event
app.delete('/events/:eventId', (req, res) => {
  database.query(`delete from events where id = ${req.params.eventId}`, (err, results) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

//update route for an event
app.patch('/events/:eventId', (req, res) => {
  // console.log(req.body.eventDetails)
  const lastEdited = moment(req.body.eventDetails.last_edited).format('lll');
  database.query(`update events set event_name = '${req.body.eventDetails.name}', event_description = '${req.body.eventDetails.description}', event_start = '${req.body.eventDetails.start}', event_length = '${req.body.eventDetails.length}', event_location = '${req.body.eventDetails.location}', event_owner = '${req.body.eventDetails.owner}', last_edited = '${lastEdited}' where id = ${req.params.eventId}`, (err, results) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(results);
    }
  })
});


//read route for all invites:
app.get('/invites', (req, res) => {
  database.query(`select * from invites`, (err, results) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

//read route for invites to an event:
app.get('/invites/events/:eventId', (req, res) => {
  database.query(`select * from events inner join invites on invites.event_id = events.id inner join users on users.id = invites.user_id where invites.event_id = ${req.params.eventId}`, (err, results) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

//read route for invites for a user
app.get('/invites/events/users/:userId', (req, res) => {
  // console.log(req.params.userId);
  database.query(`select * from events inner join invites on invites.event_id = events.id inner join users on users.id = invites.user_id where invites.user_id = ${req.params.userId}`, (err, results) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

//creates invites for an event -- all responses should initially be Awaiting (except the event creator...)
app.post('/invites', (req, res) => {
  const result = [];
  req.body.forEach((ele) => {
    result.push(
      [
        ele.invite_id,
        ele.user_id,
        ele.event_id,
        'Awaiting'
      ]
    )
  })

  const postQuery = `insert into invites (id, user_id, event_id, response) values ?`;

  database.query(postQuery, [result], (err, results) => {
    if (err) {
      console.log('err', err);
      res.status(400).send(err);
    } else {
      res.status(200).send(results);
    }
  })
});

//delete all invites for an event
app.delete('/invites/:eventId', (req, res) => {
  database.query(`delete from invites where event_id = ${req.params.eventId}`, (err, results) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

//delete all invites for a user
app.delete('/invites/:userId', (req, res) => {
  database.query(`delete from invites where user_id = ${req.params.userId}`, (err, results) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

//delete an invite for an event for a user
app.delete('/invites/:userId/:eventId', (req, res) => {
  database.query(`delete from invites where user_id = ${req.params.userId} and event_id = ${req.params.eventId}`, (err, results) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

//updates all invites for event (if event was changed, then everyone's response should be updated)
app.patch('/invites/:eventId', (req, res) => {
  // console.log(req.body, req.params.eventId)

  database.query(`update invites set response = 'Awaiting' where event_id = ${req.params.eventId}`, (err, results) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(results);
    }
  })
});

//updates invite for individual event for individual user
app.patch('/invites/:userId/:eventId', (req, res) => {
  // console.log('patch', req.body, req.params.eventId)

  database.query(`update invites set response = '${req.body.response}' where user_id = ${req.params.userId} and event_id = ${req.params.eventId}`, (err, results) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(results);
    }
  })
});


app.listen(port, () => console.log(`Server listening on http://localhost:${port}`))