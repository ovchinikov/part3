/* eslint-disable no-console */
const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const cors = require('cors');
const Person = require('./models/personsSchema');

const app = express();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(
  morgan(
    ':method :url :status :date :res[content-length] - :response-time ms :body',
  ),
);
app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

// errorHandler

// eslint-disable-next-line consistent-return
const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message });
  }

  next(error);
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: '404 not found' });
};

// get all persons
app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => next(error));
});

// display info about the phonebook status
app.get('/info', (req, res) => {
  const now = new Date().toUTCString();
  Person.find({}).then((persons) => {
    res.send(
      `<p>Phonebook has info for ${persons.length} people</p><p>${now}</p>`,
    );
  });
});

// get a single person

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person);
    })
    .catch((error) => next(error));
});

// update a person

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body;
  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' },
  )
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// delete resource

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).json(result);
    })
    .then((error) => next(error));
});

// create new contact

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body;
  Person.create({ name, number })
    .then((person) => {
      res.json(person);
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);
