const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const morgan = require('morgan');
const knex = require('knex');

//Note: connect to db using knex
const db = knex({
  client: 'pg',
  connection: {
    host: 'localhost',

    database: 'smart-brain'
  }
});

const PORT = 5000;
const database = {
  users: [
    {
      id: '123',
      name: 'John',
      password: 'cookies',
      email: 'john@gmail.com',
      entries: 0,
      joined: new Date()
    }
  ]
};

//Note: middleware section
app.use(bodyParser.json());
app.use(morgan('dev'));

//Note: Routes
//TODO; separate int a routes file: VC architecture
app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Root route' });
});

app.get('/select', (req, res) => {});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;

  const error = `Unable to register ${email}`;

  //TODO: dont have passwor yet
  db('users')
    .returning('*')
    .insert({ email, name, joined: new Date() })
    //$ Success
    .then(response => res.status(200).json(response[0]))
    //! Error : Dont return database error
    .catch(err => res.status(400).json(error));
});

//Note: start server
app
  .listen(PORT, () => {
    console.log(`Server has started on PORT ${PORT}`);
  })
  .on('error', () => {
    //* close server
    app.close();
  });

//* Export app for possible mocha chai testing
module.exports = app;
