import { useState, useEffect } from 'react'
import personService from './services/person'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Person from './components/Person'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  },[])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,     
    }

    const existingPerson = persons.find(person => person.name === personObject.name) 
    if (existingPerson) {
      personService
        .update(existingPerson.id, personObject)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id === existingPerson.id ? returnedPerson : person))
          setNotification(`Changed number of ${returnedPerson.name}`)
          setTimeout(() => {
            setNotification(null)
          }, 5000);
          setNewName('')
          setNewNumber('')
        })
      return
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))   
        setNotification(`Added ${returnedPerson.name}`)
        setTimeout(() => {
          setNotification(null)
        }, 5000); 
        setNewName('')
        setNewNumber('')
      })
  } 

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => { 
    setNewFilter(event.target.value)
    console.log(newFilter)
  }

  const personsToShow = persons.filter(person => 
    person.name.toLowerCase().includes(newFilter.toLowerCase()))

  const deletePersonOf = id => {
    const person = persons.find(person => person.id === id)
    if(!confirm(`Delete ${person.name}`))
      return
    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange}/>
      <h3>add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName}
        handleNameChange={handleNameChange} newNumber={newNumber}
        handleNumberChange={handleNumberChange}/>
      <h3>Numbers</h3>
      {personsToShow.map(
        person => 
          <Person 
            key={person.id}
            person={person}
            deletePerson={() => deletePersonOf(person.id)}
          />
      )}
    </div>
  )
}

export default App