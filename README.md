# Capstone: Periodic Tables

Periodic-Tables is a restaurant reservation management tool built with the PERN stack.
Users have the ability to create, edit, and cancel restaurant reservations.

[Live Deployment](https://ptc-tjdev.herokuapp.com/dashboard)

## API

| Route       | Get         | Put        | Post         | Delete       |      
| ----------- | ----------- | ---------- | ------------ | ------------ |
| ```/reservations```      | ✅      |❌      | ✅    |       ❌       |
| ```/reservations/:reservation_id```   | ✅        | ✅       | ❌         | ❌         |
| ```/reservations/:reservation_id/status```      | ❌      |✅      | ❌    |       ❌       |
| ```/tables```   | ✅        | ❌       | ✅         | ❌         |
| ```/tables/:table_id```   | ✅        | ❌       | ❌         | ❌         |
| ```/tables/:table_id/seat```   | ❌        | ✅       | ❌         | ✅         |

## Technology Used
[![postgresql](https://cdn.iconscout.com/icon/free/png-256/postgresql-11-1175122.png)](https://www.postgresql.org/) 
[![react](https://cdn.iconscout.com/icon/free/png-256/react-1-282599.png)](https://reactjs.org/)
[![expressjs](https://hackr.io/tutorials/learn-express-js/logo/logo-express-js?ver=1557508379)](https://expressjs.com/)
[![nodejs](https://cdn.iconscout.com/icon/free/png-256/node-js-1174925.png)](https://nodejs.org/en/)


## Screenshots and Walkthrough

### Dashboard
![dashboard](https://i.gyazo.com/a7cdacdcda72d4ce384a4ecd996bc7b7.png)
On the dashboard, you can view reservations for the current day, or select a future or previous working day. You may also Cancel a reservation from here. To create a new reservation, click on New Reservation.

### New Reservation
![reservation](https://i.gyazo.com/86ba4fcaf72693c7a9d85a4a29471253.png)
Fill out this form to create a new reservation. Make sure the reservation is not for Tuesdays and the time is between working hours! (10:30am - 9:30pm). To seat a reservation at a table, click the "Seat" button.

### Seat Reservation.
![seatreservation](https://i.gyazo.com/a33c1e3121590372a99cff0ed7142abc.png)
Select a table from the drop down list and click submit to seat the desired reservation at the table.

Not enough space at pre-existing tables? Let's make a new one by clicking on New Table.

### New Table
![newtable](https://i.gyazo.com/95f4d14a23ac6531b723f4e0cf3b2743.png)
Fill out the Table Name and select a capacity under 50 people for the new table, then click submit.

Did a customer just call and request a change to their reservation? Let's fix that now. Click on the Search button.

### Search
![search](https://i.gyazo.com/c2fa3f1679262bae9aea5dbb68481ac0.png)
Enter in the customers phone number and click 'Find' to search for the customers reservation.

### Edit Reservation
![editreservation](https://i.gyazo.com/c213484a6a041e32c1ec1afcb1574f0c.png)
Editing a reservation already in the system populates the form with the information to save time.
As before, make sure the reservation date and time are both in the future and not on a Tuesday.

## Installation

1. Fork and clone this repository.
1. Run `cp ./back-end/.env.sample ./back-end/.env`.
1. Update the `./back-end/.env` file with the connection URL's to your ElephantSQL database instance.
1. Run `cp ./front-end/.env.sample ./front-end/.env`.
1. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5000`.
1. Run `npm install` to install project dependencies.
1. Run `npm run start:dev` to start your server in development mode.
