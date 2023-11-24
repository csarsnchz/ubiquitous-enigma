const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const osprey = require('osprey');
const path = require('path');

const app = express();
const port = 3001;

const ramlParser = require('raml-1-parser');

ramlParser.loadRAML(path.join(__dirname, '/users.raml'), { rejectOnErrors: true })
    .then(function(ramlApi) {
        var router = osprey.Router();
        return osprey.loadFile(path.join(__dirname, '/users.raml'), { server: router, disableTransactionId: true, ramlVersion: 'RAML10' });
    })
    .then(function (middleware) {
        app.use('/users', middleware);
        app.listen(port, function () {
            console.log('Your API is now live!');
        });
    })
    .catch(function(error) {
        console.error('Error occurred:', error);
    });

let users = [
    { id: 1, name: 'John Doe', email: 'johndoe@example.com' },
    { id: 2, name: 'Jane Doe', email: 'janedoe@example.com' },
  ];

app.get('/', (req, res) => {
    // Retrieve users from a data source (e.g., database)
    res.send('Welcome to our REST API');
  });

// Define route handlers for API endpoints
app.get('/users', (req, res) => {
  // Retrieve users from a data source (e.g., database)
  res.json(users);
});

const { validationResult } = require('express-validator');

// Validate user data using Express Validator
const check = require('express-validator').check;

app.post('/users', check('name', 'Name is required').notEmpty(), check('email', 'Invalid email').isEmail(), (req, res) => {
  // Extract user data from the request body
  const userData = req.body;

  // Validate user data using Express Validator
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Create a new user (simulate data persistence)
  const newUser = {
    id: uuidv4(),
    name: userData.name,
    email: userData.email,
  };

  // Send the created user to the client
  res.json(newUser);
});