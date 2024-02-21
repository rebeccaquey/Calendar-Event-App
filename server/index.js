const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const moment = require('moment');

const database = require('./db/index.js');
const app = express();
const port = 3003;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());
app.use(express.static(path.join(__dirname, '../client/build')));


app.get('/events', (req, res) => {
  database.query(`select * from events`, (err, results) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

app.get('/events/:eventId', (req, res) => {
  database.query(`select * from events where id = ${req.params.eventId}`, (err, results) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

app.post('/events/:eventId', (req, res) => {
  const result = [];
  req.body.forEach((ele) => {
    const creationTime = moment(ele.creation_time).format('lll');
    const lastEdited = moment(ele.last_edited).format('lll');
    result.push(
      [
        ele.event_name,
        ele.event_description,
        ele.event_start,
        ele.event_end,
        ele.event_location,
        ele.event_owner,
        creationTime,
        lastEdited
      ]
    )
  })

  const postQuery = `insert into events (event_name, event_description, event_start, event_end, event_location, creation_time, event_owner) values ?`;

  database.query(postQuery, [result], (err, results) => {
    if (err) {
      console.log('err', err);
      res.status(400).send(err);
    } else {
      res.status(200).send(results);
    }
  })
});

app.delete('/events/:eventId', (req, res) => {
  database.query(`delete from events where id = ${req.params.eventId}`, (err, results) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

app.patch('/cards/:eventId', (req, res) => {
  // console.log(req.body, req.params.eventId)

  const lastEdited = moment(req.body.lastEdited).format('lll');
  database.query(`update events set event_name = '${req.body.event_name}', event_description = '${req.body.event_description}', event_start = '${req.body.event_start}', event_end = '${req.body.event_end}', event_location = '${req.body.event_location}', event_owner = '${req.body.event_owner}', last_edited = '${lastEdited}' where id = ${req.params.eventId}`, (err, results) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(results);
    }
  })
});


app.listen(port, () => console.log(`Server listening on http://localhost:${port}`))