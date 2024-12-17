import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  // Hooks for setting states for name/number inputs and filtering names.
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

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
    number: newNumber
  }

  setPersons(persons.concat(nameObject))
  setNewName('') // Clear input after adding a name
  setNewNumber('')
}

/**
 * Component for filtering phonebook names. Case-insensitive.
 */
const filterNames = persons.filter(person =>
  person.name.toLowerCase().includes(filter.toLowerCase())
)

// All event handlers for inputs and filters.
const handleAddName = (event) => {
  console.log(event.target.value)
  setNewName(event.target.value)
}

const handleAddNumber = (event) => {
  console.log(event.target.value)
  setNewNumber(event.target.value)
}

const handleFilterChange = (event) => {
  setFilter(event.target.value)
}

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
        filter shown with
        <input value={filter} onChange={handleFilterChange}/> 
        </div>
      </form>
      <h2>add a new</h2>
      <form onSubmit={addName}>
        <div>
          name: 
        <input value={newName} onChange={handleAddName}/>
        <div>number: <input value={newNumber} onChange={handleAddNumber}/></div>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {filterNames.map(person =>
          <li key={person.name}> {person.name} {person.number}</li>
        )}
      </ul>
    </div>
  )

}

export default App