const express = require("express")

const app = express()

app.use(express.json())



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

// Helper method to generate string for info endpoint
const generateInfoString = (timeRequested, numOfEntries) => {
  const infoString = `
  <p>Phonebook contains details for ${numOfEntries} people.</p>
  <p>${timeRequested}</p>
  `
  return infoString
}

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server listening to port ${PORT}`)
})