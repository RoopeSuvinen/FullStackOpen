const { test, describe, beforeEach, after } = require('node:test')
const assert = require('assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const app = require('../app')
const User = require('../models/user')
const api = supertest(app)

let initialUsers = [] // User list as global

// beforeEach formats User list before testing
beforeEach(async () => {
  await User.deleteMany({})

  const passwords = await Promise.all([
    bcrypt.hash('salasana1', 10),
    bcrypt.hash('salasana2', 10)
  ])

  initialUsers = [
    {
      username: 'MattiMeika',
      name: 'Matti Meikäläinen',
      passwordHash: passwords[0],
    },
    {
      username: 'MaijaMeika',
      name: 'Maija Meikäläinen',
      passwordHash: passwords[1],
    },
  ]

  await User.insertMany(initialUsers)
})

describe('Tests for user database', () => {

  test('All users are returned as JSON-format', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, initialUsers.length)
  })

  test('User with under 3 character nickname is not added', async () => {
    const newUser = {
      username: 'A',
      name: 'Short User',
      password: 'asdf123'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.strictEqual(response.body.error, 'Username must be longer than 3 characters long')
    const newUserList = await User.find({})
    assert.strictEqual(newUserList.length, initialUsers.length)
  })

  test('User with under 3 character password is not added', async () => {
    const newUser = {
      username: 'B',
      name: 'Short Password User',
      password: 'AB'
    }
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.strictEqual(response.body.error, 'Username must be longer than 3 characters long')
    const newUserList = await User.find({})
    assert.strictEqual(newUserList.length, initialUsers.length)
  } )

  test('User creation fails if password is missing', async () => {
    const newUser = {
      username: 'MasaMeikä',
      name: 'Matti Salasanaton',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.strictEqual(response.body.error, 'Username and password are required')

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, initialUsers.length)
  })

  test('User creation fails if username is missing', async () => {
    const newUser = {
      name: 'Matti Meikäläinen',
      password: 'salasana123',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.strictEqual(response.body.error, 'Username and password are required')

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, initialUsers.length)
  })

  test('User creation fails if username is already taken', async () => {
    const newUser = {
      username: 'MattiMeika', // Duplicate username
      name: 'Duplicate User',
      password: 'securepassword',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.strictEqual(response.body.error, 'Username is already in use')

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, initialUsers.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})