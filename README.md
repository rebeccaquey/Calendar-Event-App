# Abode Calendar Event App
This was built with React on the client side. Backend is using Express and MySQL.

## Directions

* `npm install`
* `npm start`
* `mysql -u root < server/db/schema.sql`
  * This will create the database & tables
  * If you run into this error: `MySQL 8.0 - Client does not support authentication protocol requested by server; consider upgrading MySQL client`
    * Execute the following query in MYSQL Workbench:
      `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';`
      Where root as your user localhost as your URL and password as your password
      Then run this query to refresh privileges: `flush privileges;`
* `npm run seed`
  * This will load the seed data into the database
* Create 'twilio.js' file in the server directory.
  * This should be a file that includes the following:
    * const accountSid = 'INSERT ACCOUNT SID HERE';
    * const authToken = 'INSERT AUTH TOKEN HERE';
    * const twilioPhoneNumber = 'INSERT TWILIO PHONE NUMBER HERE';
    * const myPhoneNumber = 'INSERT YOUR PHONE NUMBER HERE';

    * module.exports = { accountSid, authToken, twilioPhoneNumber, myPhoneNumber }
* `npm run server-dev`

### Additional Features

* Click on the name on the right side of the header to see a dropdown list of Users. Can switch users to see the events that user is invited to.
* Click on 'Create Event' button to add new event.
* Click on the event to see more details, as well as edit or delete the event.
* Use arrows to change months and see events in that month.
* Toggle between tabs to see Calendar view or Event view.
* Click on 'today' to move back to the current date.
* Sends Twilio SMS message as a notification for the event 30 minutes before the event. This currently sends a message to your phone number for each user invited, but can easily be updated to send to the user's emails, or different phone numbers, etc.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run server-dev`
Starts the server in development mode and connects to the database.
Server is listening on port 3003.

### `npm run seed`
Runs the seed.js file to generate 3 csv files and load the data into our mysql database.
* abodeEventData.csv
  * Generates 15 events with different names, descriptions, locations, start/end times, owner, etc.
* abodeUserData.csv
  * Generates 10 users with different first and last names, and a corresponding email address
* abodeInviteData.csv
  * Generates 60 invites with the invite's userId, eventId, and response

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.