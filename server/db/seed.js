const { faker } = require('@faker-js/faker');
const ObjectsToCsv = require('objects-to-csv');
const moment = require('moment');
const db = require('./index.js');

//generate 10 users:

const generateUsers = (num) => {
  const data = [];
  for (let i = 0; i < num; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const user = {
      id: i + 1,
      first_name: firstName,
      last_name: lastName,
      email: faker.internet.email({firstName, lastName})
    }
    data.push(user);
  }
  return data;
}

const allUsers = generateUsers(10);


// generate 15 events:

const eventLength = [30, 60, 90, 120];
const eventStartOptions = ['10:00:00', '10:30:00', '11:00:00', '11:30:00', '12:00:00', '12:30:00', '13:00:00', '13:30:00', '14:00:00', '14:30:00', '15:00:00'];
const random = (arr) => Math.floor(Math.random() * arr.length);

const generateEvents = (num) => {
  const data = [];
  for (let i = 0; i < num; i++) {
    const eventDate = faker.date.between({from: '2024-02-01', to: '2024-04-30'}).toJSON().slice(0, 10);
    const randomEventLength = eventLength[random(eventLength)];
    const eventStartTime = eventStartOptions[random(eventStartOptions)];
    const eventCreationTime = faker.date.between({from: '2024-01-01', to: '2024-02-20'});
    const event = {
      id: i + 1,
      event_name: faker.lorem.words({min: 3, max: 8}),
      event_description: faker.lorem.sentences(),
      event_start: `${eventDate} ${eventStartTime}`,
      event_length: randomEventLength,
      event_location: faker.location.streetAddress(),
      event_owner: faker.number.int({min: 1, max: 10}),
      creation_time: eventCreationTime,
      last_edited: eventCreationTime
    }
    data.push(event);
  }
  return data;
}

const allEvents = generateEvents(15);


// generate 60 invites:

const eventResponses = ["Yes", "No", "Maybe", "Awaiting"]

const generateInvites = (num) => {
  const data = [];
  for (let i = 0; i < num; i++) {
    const randomEventResponse = eventResponses[random(eventResponses)];
    const invite = {
      id: i + 1,
      user_id: faker.number.int({min: 1, max: 10}),
      event_id: faker.number.int({min: 1, max: 15}),
      response: randomEventResponse
    }
    data.push(invite);
  }
  return data;
}

const allInvites = generateInvites(60);


// new ObjectsToCsv(allUsers).toDisk('./abodeUserData.csv');
// new ObjectsToCsv(allEvents).toDisk('./abodeEventData.csv');
// new ObjectsToCsv(allInvites).toDisk('./abodeInviteData.csv');

//load data from csv files into tables
const userQuery = "load data local infile './abodeUserData.csv' into table users fields terminated by ',' lines terminated by '\n' ignore 1 lines";
db.query(userQuery, (err, result) => {
  if (err) {
    console.log('error inserting into db: ', err);
  } else {
    console.log('data inserted into db: ', result);
  }
});

const eventQuery = "load data local infile './abodeEventData.csv' into table events fields terminated by ',' lines terminated by '\n' ignore 1 lines";
db.query(eventQuery, (err, result) => {
  if (err) {
    console.log('error inserting into db: ', err);
  } else {
    console.log('data inserted into db: ', result);
  }
});

const inviteQuery = "load data local infile './abodeInviteData.csv' into table invites fields terminated by ',' lines terminated by '\n' ignore 1 lines";
db.query(inviteQuery, (err, result) => {
  if (err) {
    console.log('error inserting into db: ', err);
  } else {
    console.log('data inserted into db: ', result);
  }
});

