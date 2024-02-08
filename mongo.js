const mongoose = require("mongoose")

if (process.argv.length < 3) {
  console.log("Usage: node mongo.js <password> (<name_to_add> <number_to_add>)")
  process.exit(1)
}

const passw = process.argv[2]

const url = `mongodb+srv://fso:${passw}@fso-db-cluster.cloikcw.mongodb.net/?retryWrites=true&w=majority`

mongoose.set("strictQuery", false)
mongoose.connect(url)


const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model("Person", personSchema)

const createNewPerson = () => {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(() => {
    console.log("Person stored to database.")
    mongoose.connection.close()
  })
}

const fetchAllPersons = () => {
  Person.find({}).then(result => {
    console.log("Phonebook:")
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  createNewPerson()
} else if (process.argv.length === 3) {
  fetchAllPersons()
}