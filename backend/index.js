const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const cors = require('cors');
const db = require('./config/Database.js');
const Users = require('./model/UserModel.js');
const Attendances = require('./model/AttendanceModel.js');
const router = require('./route/Route.js')
 
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'asd312gadaq3qfasdagggaw131', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

async function startServer() {
  try {
    await db.authenticate();
    console.log('Database connected...');

    await Users.sync();
    console.log('User model synchronized...');

    await Attendances.sync();
    console.log('Attendance model synchronized...');

  } catch (error) {
    console.error('Error:', error.message);
    return;
  }

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

app.use(router);

startServer();
