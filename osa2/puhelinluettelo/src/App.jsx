import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const Filter = ({ value, onChange }) => {
  return (
    <div>
      filter shown with <input value={value} onChange={onChange} />
    </div>
  )
}

const PersonForm = ({onSubmit, newName, newNumber, handleAddName, handleAddNumber}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={newName} onChange={handleAddName} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleAddNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons, onDelete }) => {
  return (
    <ul>
      {persons.map((person) => (
        <li key={person.name}>
          {person.name} {person.number} <button onClick={() => onDelete(person.id, person.name)}>delete</button>
        </li>
      ))}
    </ul>
  )
}

const Notification = ({ message }) => {
  if (!message || !message.content) {
    return null
  }

  const style = {
    color: message.type === "error" ? "red" : "green",
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  }

  return <div style={style}>{message.content}</div>
}

const App = () => {

  // Hooks for setting states for name/number inputs and filtering names.
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [persons, setPersons] = useState([])
  const [message, setMessage] = useState({ content: null, type: "" })

  // Fetching data using Effect hook.
  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        console.log(initialPersons)
        setPersons(initialPersons)
      })
      .catch(error => {
        console.error('Error fetching persons:', error)
      })
  }, [])

/**
 * Event handler for adding a new name to a phonebook. Checks if
 * name is already added.
 * @param {*} event 
 * @returns 
 */
const addName = (event) => {
  event.preventDefault()

  const existingPerson = persons.find((person) => person.name === newName)

  if (existingPerson) {
    if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
      const updatedPerson = { ...existingPerson, number: newNumber }

      personService
        .update(existingPerson.id, updatedPerson)
        .then((updated) => {
          setPersons(persons.map((person) => (person.id !== existingPerson.id ? person : updated)))
          setMessage({
            content: `Updated ${newName}'s number to ${newNumber}`,
            type: "success",
          })
          setTimeout(() => {
            setMessage({ content: null, type: "" })
          }, 5000)
          setNewName("")
          setNewNumber("")
        })
        .catch((error) => {
          if (error.response && error.response.status === 400 && error.response.data.error) {
            // Shows mongoose error message.
            setMessage({ content: error.response.data.error, type: "error" })
          } else if (error.response && error.response.status === 404) {
            setMessage({
              content: `Information of ${newName} has already been removed from server`,
              type: "error",
            })
            setPersons(persons.filter((person) => person.id !== existingPerson.id))
          } else {
            setMessage({ content: "An unexpected error occurred", type: "error" })
          }
          setTimeout(() => {
            setMessage({ content: null, type: "" })
          }, 5000)
        })
    }
    return
  }

  const nameObject = {
    id: String(Math.floor(Math.random() * 1000000000)),
    name: newName,
    number: newNumber,
  }

  personService
    .create(nameObject)
    .then((newPerson) => {
      console.log('New person added:', newPerson)
      setPersons(persons.concat(newPerson))
      setMessage({
        content: `Added ${newName}`,
        type: "success",
      })
      setTimeout(() => {
        setMessage({ content: null, type: "" })
      }, 5000)
      setNewName("")
      setNewNumber("")
    })
    .catch((error) => {
      if (error.response && error.response.data.error) {
        setMessage({ content: error.response.data.error, type: "error" })
      } else {
        setMessage({ content: "An unexpected error occurred", type: "error" })
      }
    })
}

const deletePerson = (id, name) => {
  if (window.confirm(`Delete ${name}`)) {
    personService
      .remove(id)
      .then(response => {
        setMessage({
          content: `Deleted ${name}`,
          type: "success"
        })
        setTimeout(() => {
          setMessage({ content: null, type: "" })
        }, 5000)
        setPersons(persons.filter(person => person.id !== id))
      })
  }
}

/**
 * Component for filtering phonebook names. Case-insensitive.
 */
const filterNames = persons.filter(person =>
  person.name.toLowerCase().includes(filter.toLowerCase())
)

// All event handlers for inputs and filters.
const handleAddName = (event) => setNewName(event.target.value)
const handleAddNumber = (event) => setNewNumber(event.target.value)
const handleFilterChange = (event) => setFilter(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter value={filter} onChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm 
        onSubmit={addName} // addName used as prop
        newName={newName}
        newNumber={newNumber}
        handleAddName={handleAddName}
        handleAddNumber={handleAddNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={filterNames} onDelete={deletePerson} />
    </div>
  )
}

export default App