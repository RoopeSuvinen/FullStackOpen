const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

// Connecting to mongoDB using mongoose
mongoose.connect(url)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.log('error conneting to MongoDB:', error.Message)
    })

const blogSchema = new mongoose.Schema({
        title: String, // TODO: Make validators
        author: String,
        url: String
      })

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => { // Delete document? no need? 
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)