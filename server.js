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

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;

  const error = `User with id ${id} not found`;

  /*
  Note: returns an array, returning an empty array returns a 200-status code: so check if there is a user.length: return 200 / 400 accordingly
  */
  db.select('*')
    .from('users')
    .where('id', id)
    //$ Success getting a user array:
    .then(user =>
      user.length ? res.status(200).json(user[0]) : res.status(400).json(error)
    )
    //! Error gettinga  user
    .catch(err => res.status(400).json('User not found'));
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;

  const hash = bcrypt.hashSync(password);
  const error = `Unable to register ${email}`;

  //TODO: update users and login
  // ? - Transaction: if one fails they all fail
  db.transaction(trx => {
    //TODO: dont have passwor yet

    trx
      .insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return (
          trx('users')
            .returning('*')
            .insert({ email: loginEmail[0], name, joined: new Date() })
            //$ Success
            .then(response => res.status(200).json(response[0]))
            //! Error : Dont return database error
            .catch(err => res.status(400).json(error))
        );
      })

      //$ All pass: commit the change
      .then(trx.commit)
      //! Fail roll back db
      .catch(trx.rollback);
  });
});

app.put('/image', (req, res) => {
  const { id } = req.body;

  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.status(200).json(entries))
    .catch(err => res.status(400).json(err));
});

app.post('/signin', (req, res) => {
  //SQL - SELECT email, hash FROM login WHERE email=req.boy.email; `
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      //Note: Pull password
      const { hash } = data[0];

      const isValid = bcrypt.compareSync(req.body.password, hash);

      //$ Success query for the user in db w/ matchibg email

      //SQL `SELECT * FROM users WHERE email=req.body.email`
      if (isValid) {
        db.select('*')
          .from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            //note: We also get an array so return user[0]
            return res.status(200).json(user[0]);
          })
          .catch(err =>
            res.status(400).json('No user registered with this email')
          );
      } else {
        return res.status(400).json('Wrong credentials');
      }
    })
    //! Error handler
    .catch(err => {
      return res.status(400).json('Invalid login credentials');
    });
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
