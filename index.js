const express = require("express")
const morgan = require("morgan")

const app = express()

app.use(express.json())
app.use(morgan("tiny"))



let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

// Get all entries
app.get("/api/persons", (request, response) => response.json(persons))

// Additional information
app.get("/info", (request, response) => {
  const timeRequested = new Date()
  const numOfEntries = persons.length
  response.send(generateInfoString(timeRequested, numOfEntries))
})

// Get one person
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// Delete an entry
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})

// Add a new person
app.post("/api/persons", (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ error: "Missing person name." })
  } else if (!body.number) {
    return response.status(400).json({ error: "Missing phone number."})
  } else if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ error: "Name must be unique."})
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(1, 10000)
  }

  persons = persons.concat(person)

  response.json(person)
})

// Helper method to generate string for info endpoint
const generateInfoString = (timeRequested, numOfEntries) => {
  const infoString = `
  <p>Phonebook contains details for ${numOfEntries} people.</p>
  <p>${timeRequested}</p>
  `
  return infoString
}

// Helper method generate random ID integer in range (min, max)
const generateId = (min, max) => {
  const newId = Math.floor(Math.random() * (max - min + 1) + min)
  if (persons.find(person => person.id === newId)) {
    return generateId(min, max)
  } else {
    return newId
  }
}

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server listening to port ${PORT}`)
})