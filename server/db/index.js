const mysql = require('mysql');

const config = {
  database: 'abode',
  user: 'root',
  host: 'localhost'
};

let connection;

connection = mysql.createConnection(config);
connection.connect((e) => {
  if (e) {
    console.log('Database connection error: ', e);
  } else {
    console.log('Connected: MySQL Started!');
  }
});

module.exports = connection;