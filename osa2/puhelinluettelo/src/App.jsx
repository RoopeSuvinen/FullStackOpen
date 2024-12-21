import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const Filter = ({ value, onChange }) => {
  return (
    <div>
      filter shown with <input value={value} onChange={onChange} />
    </div>
  );
};

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

const Persons = ({ persons }) => {
  return (
    <ul>
      {persons.map((person) => (
        <li key={person.name}>
          {person.name} {person.number}
        </li>
      ))}
    </ul>
  );
};

const App = () => {

  // Hooks for setting states for name/number inputs and filtering names.
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [persons, setPersons] = useState([])

  // Fetching data using Effect hook.
  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

/**
 * Event handler for adding a new name to a phonebook. Checks if
 * name is already added.
 * @param {*} event 
 * @returns 
 */
const addName = (event) => {
  event.preventDefault() // Prevents loading page again.
  if (persons.some(person => person.name === newName)) {
    alert(`${newName} is already added to phonebook`)
    return
  }
  const nameObject = {
    name: newName,
    number: newNumber,
    id: String(persons.length + 1 )
  }

  personService
  .create(nameObject)
  .then(response => {
    setPersons(persons.concat(response.data))
    setNewName('')
    setNewNumber('')
  })
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
      <Persons persons={filterNames} />
    </div>
  )
}

export default App