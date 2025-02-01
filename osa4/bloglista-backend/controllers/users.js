const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  // Checks if fields are not empty
  if (!username || !password) {
    return response.status(400).json({ error: 'Username and password are required'})
  }

  // Checks username and password is minimun 3 characters long
  if (username.length < 3) {
    return response.status(400).json({ error: 'Username must be longer than 3 characters long'})
  }

  if (password.length < 3) {
    return response.status(400).json({ error: 'Password must be longer than 3 characters long'})
  }

  // Checks if username exists
  const existingUsername = await User.findOne({ username })
  if (existingUsername) {
    return response.status(400).json({ error: 'Username is already in use'})
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser =  await user.save()
  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
    id: 1
  })
  response.json(users)
})

module.exports = usersRouter