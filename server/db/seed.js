const faker = require('faker');
const ObjectsToCsv = require('objects-to-csv');

//generate 10 users:

const generateUsers = (num) => {
  const data = [];
  for (let i = 0; i < num; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const user = {
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
const eventStartOptions = [1000, 1030, 1100, 1130, 1200, 1230, 1300, 1330, 1400, 1430, 1500];
const random = (arr) => Math.floor(Math.random() * arr.length);

const generateEvents = (num) => {
  const data = [];
  for (let i = 0; i < num; i++) {
    const eventDate = faker.date.between('2024-03-01', '2024-04-30');
    const randomEventLength = eventLength[random(eventLength)];
    const eventStartTime = eventStartOptions[random(eventStartOptions)];
    const eventCreationTime = faker.date.between('2024-01-01', '2024-02-20');
    const event = {
      event_name: faker.lorem.words(),
      event_description: faker.lorem.sentences(),
      event_start: (eventDate, eventStartTime * 100),
      event_end: (eventDate, (eventStartTime + randomEventLength) * 100),
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

const eventResponses = ["Yes", "No", "Maybe"]

const generateInvites = (num) => {
  const data = [];
  for (let i = 0; i < num; i++) {
    const randomEventResponse = eventResponses[random(eventResponses)];
    const invite = {
      user_id: faker.number.int({min: 1, max: 10}),
      event_id: faker.number.int({min: 1, max: 15}),
      response: randomEventResponse
    }
    data.push(invite);
  }
  return data;
}

const allInvites = generateInvites(60);


new ObjectsToCsv(allUsers).toDisk('./abodeUserData.csv');
new ObjectsToCsv(allEvents).toDisk('./abodeEventData.csv');
new ObjectsToCsv(allInvites).toDisk('./abodeInviteData.csv');