const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const morgan = require('morgan');
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

//Note: start server
app
  .listen(PORT, () => {
    console.log(`Server has started on PORT ${PORT}`);
  })
  .on('error', () => {
    //* close server
    app.close();
  });
