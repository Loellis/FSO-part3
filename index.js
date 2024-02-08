require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const Person = require("./models/person")

const app = express()

app.use(express.static("dist"))
app.use(express.json())
app.use(cors())

// Logging handler
morgan.token("json_data",  (request) => {
  if (request.method === "POST") {
    return JSON.stringify(request.body)
  }
  return ""
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :json_data"))

// Additional information
app.get("/info", (request, response, next) => {
  Person.countDocuments({})
    .then(numOfEntries => {
      const timeRequested = new Date()
      response.send(generateInfoString(timeRequested, numOfEntries))
    })
    .catch(error => next(error))
})

// Get all entries
app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then(persons => response.json(persons))
    .catch(error => next(error))
})

// Get one person
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Delete an entry
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch(error => next(error))
})

// Update number of existing person
app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then(updatedPerson => response.json(updatedPerson))
    .catch(error => next(error))
})

// Add a new person
app.post("/api/persons", (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => response.json(savedPerson))
    .catch(error => next(error))
})

// Error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformed ID" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

// Helper method to generate string for info endpoint
const generateInfoString = (timeRequested, numOfEntries) => {
  const infoString = `
  <p>Phonebook contains details for ${numOfEntries} people.</p>
  <p>${timeRequested}</p>
  `
  return infoString
}

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server listening to port ${PORT}`)
})