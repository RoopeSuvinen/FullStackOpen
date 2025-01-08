require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const app = express()
const cors = require('cors')

const Person = require('./models/person')

app.use(cors())
app.use(express.static('dist')) // Express shows static pages index.html
app.use(express.json())
// app.use(requestLogger)


// POST-HTTP information to console via morgan.
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
]

// Returns list of all persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// Returns info of how many persons in list and response time.
app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(personCount => {
      const responseTime = new Date()
      const infoText = 
      `<div>
        <p>Phonebook has info for ${personCount} people</p>
        <p>${responseTime}</p>
      </div>`

      response.send(infoText)
    })
    .catch(error => next(error))
})

// Gets info of certain person with certain id. 
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })
    .catch(error => next(error))
})

// Deletes person from list.
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  
  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// Adds new entry in persons -list. Randomizes the id. 
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Person information missing'
    })
  }

  const checkName = persons.some(person => person.name === body.name)
  if (checkName) {
    return response.status(400).json({
      error: 'Name must be unique'
    })
  }

  // New person is added via constructor method.
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
  })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id'})
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})