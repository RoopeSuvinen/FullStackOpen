const express = require('express')
const app = express()

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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})