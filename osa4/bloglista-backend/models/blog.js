const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3
  },
  author: {
    type: String,
    required: true,
    minlength: 3
  },
  url: {
    type: String,
    required: true, //TODO: Make suitable custom validator for URL's.
  },
  likes: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)

const userSchema = mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  blogs: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // The passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)
module.exports = User