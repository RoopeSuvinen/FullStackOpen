import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1233883' }
  ])

  // Hooks for setting states for name and number inputs
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

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
 * Event handler for changes in the text input field.
 * @param {*} event 
 */
const handleAddName = (event) => {
  console.log(event.target.value)
  setNewName(event.target.value)
}

const handleAddNumber = (event) => {
  console.log(event.target.value)
  setNewNumber(event.target.value)
}

  return (
    <div>
      <h2>Phonebook</h2>
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
        {persons.map(person =>
          <li key={person.name}> {person.name} {person.number}</li>
        )}
      </ul>
    </div>
  )

}

export default App