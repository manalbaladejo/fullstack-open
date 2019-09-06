import React, { useState ,useEffect } from 'react'
import Filter from './Filer'
import PersonForm from './PersonForm'
import Numbers from './Numbers'
import numberserv from '../number-service'


const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filterVal, setFilter ] = useState('')
  const hook = () => {
    console.log('effect')
    numberserv.getAll()
    .then(response=>setPersons(response))
  }
  useEffect(hook,[])
  console.log('render', persons.length, 'person')
  const handleNameChange = (event)=>{
      setNewName(event.target.value);
  }
  const handleNumberChange = (event)=>{
    setNewNumber(event.target.value);
  } 
  const handleFilterChange = (event)=>{
    setFilter(event.target.value);
  }
  const deleteEntry = (id)=>{
    const current = persons.find(person=>person.id===id)
    var r = window.confirm(`Are you sure, you want to delete ${current.name} ?`);
    if(r === true)
    {
      numberserv.remove(id)
      .then(response=>{
        console.log("===",response)
        setPersons(persons.filter(person=>person.id!==id))
      })
    }
  }
  const handleSubmit = (event)=>{
      event.preventDefault()
      if(persons.find((person)=>person.name===newName))
      {
        const current = persons.find(person=>person.name===newName)
        var r = window.confirm(`Are you sure, you want to update number of ${current.name} ?`);
        if(r === true)
        {
          const newPerson = {name:newName,number:newNumber}
          numberserv.update(current.id,newPerson)
          .then(response=>{
              setPersons(persons.map(person=>(person.id===response.id)?response:person))
            }
          )
        }
      }
      else
      {
        const newPerson = {name:newName,number:newNumber}
        numberserv.addNote(newPerson)
        .then(response=>{
            setPersons(persons.concat(response))
          }
        )
      }
      setNewName('')
      setNewNumber('')
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterVal={filterVal} handleFilterChange={handleFilterChange} />
      <h2> add new </h2>
      <PersonForm handleSubmit={handleSubmit} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Numbers persons={persons} filterVal={filterVal} deleteEntry={deleteEntry} />
    </div>
  )
}

export default App