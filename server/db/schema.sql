DROP DATABASE IF EXISTS abode;

CREATE DATABASE abode;

USE abode;

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(250),
  PRIMARY KEY (id)
);

CREATE TABLE events (
  id INT NOT NULL AUTO_INCREMENT,
  event_name VARCHAR(1000),
  event_description VARCHAR(1000),
  event_start TIMESTAMP,
  event_end TIMESTAMP,
  creationtime VARCHAR(50),
  event_owner INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (event_owner) REFERENCES users(id)
);

CREATE TABLE invites (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  response ENUM("Yes", "No", "Maybe"),
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (event_id) REFERENCES events(id)
);
