const express = require('express')
var morgan = require('morgan')
const app = express()
const cors = require('cors')

const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('dist')) // Express shows static pages index.html
 
// POST-HTTP information to console via morgan.
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
]

// This route returns list of all persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// This roude returns info of how many persons in list and response time.
app.get('/info', (request, response) => {
    const personCount = persons.length
    const responseTime = new Date()

    const infoText = 
    `<div>
      <p>Phonebook has info for ${personCount} people</p>
      <p>${responseTime}</p>
    </div>`

    response.send(infoText)
})

// Gets info of certain person with certain id. 
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id // Id is string, not number.
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    console.log('Person not found')
    response.status(404).end()
  }
})

// Deletes person from list.
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
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

  const person = {
    id: body.id,
    name: body.name,
    number: body.number,
  }

  console.log(person)
  persons = persons.concat(person)
  response.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})