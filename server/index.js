const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const path = require('path');
const moment = require('moment');

const database = require('./db/index.js');
const app = express();
const port = 3003;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());
app.use(express.static('public'));


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

  const postQuery = `insert into events (event_name, event_description, event_start, event_length, event_location, creation_time, event_owner) values ?`;

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
  // console.log(req.body, req.params.eventId)

  const lastEdited = moment(req.body.lastEdited).format('lll');
  database.query(`update events set event_name = '${req.body.event_name}', event_description = '${req.body.event_description}', event_start = '${req.body.event_start}', event_length = '${req.body.event_length}', event_location = '${req.body.event_location}', event_owner = '${req.body.event_owner}', last_edited = '${lastEdited}' where id = ${req.params.eventId}`, (err, results) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(results);
    }
  })
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
  console.log(req.params.userId);
  database.query(`select * from events inner join invites on invites.event_id = events.id inner join users on users.id = invites.user_id where invites.user_id = ${req.params.userId}`, (err, results) => {
    console.log('getting invites for userId:', req.params.userId);
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

//creates invites for an event -- all responses should initially be Awaiting (except the event creator...)
app.post('/invites', (req, res) => {
  const postQuery = `insert into invites (user_id, event_id, response) values (${req.body.user_id}, ${req.body.event_id}, 'Awaiting')`;

  database.query(postQuery, (err, results) => {
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
  // console.log(req.body, req.params.eventId)

  database.query(`update invites set response = '${req.body.response}' where user_id = ${req.params.userId} and event_id = ${req.params.eventId}`, (err, results) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(results);
    }
  })
});


app.listen(port, () => console.log(`Server listening on http://localhost:${port}`))