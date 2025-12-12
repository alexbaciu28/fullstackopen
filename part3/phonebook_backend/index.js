require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')
const cors = require('cors')

app.use(express.static('dist'))

app.use(cors())

let persons = []

morgan.token('body', (request) => {
  if(request.method == 'POST'){  
    return JSON.stringify(request.body)
  } else {
    return ''
  }
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (requesnt, response) => {
    Person.find({}).then(people => {
        response.json(people)
    }) 
})

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    time = new Date();
    response.send(`<h1>Phonebook has info for ${persons.length} people</h1>
        ${time}`)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
}) 

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find( p => p.id == id)

    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
}) 

const generateId = () => {
    const id = Math.floor(Math.random() * 1000)
    return String(id)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'format is not correct'
        })
    }
    
    const person = new Person({
        id: generateId(),
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})