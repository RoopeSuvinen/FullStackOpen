const express = require('express')
var morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


let persons = [
      {
        "id": "1",
        "name": "Arto Hellas",
        "number": "050-123456"
      },
      {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
      },
      {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
      },
      {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
      }
]

// This route returns list of all persons
app.get('/api/persons', (request, response) => {
  response.json(persons)
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
    id: String(Math.floor(Math.random() * 1000000000)),
    name: body.name,
    number: body.number
  }

  console.log(person)
  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})