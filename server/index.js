const express = require('express');
const session = require('express-session');
const massive = require('massive');
require('dotenv').config();
const authCtrl= require('./controllers/authController');
const treasureCtrl = require('./controllers/treasureController');
const { adminsOnly } = require('./middleware/authMiddleware');
const auth = require('./middleware/authMiddleware');

const {PORT, CONNECTION_STRING, SESSION_SECRET} = process.env;

const app = express();
app.use(express.json());

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout)

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);

app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);


massive({
  connectionString: CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false
  }
})
.then(db => {
  app.set('db', db)
  console.log('db connected')
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
})
.catch(err => console.log(err));