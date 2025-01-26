const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const assert = require('node:assert')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'John Doe',
    url: 'http://example.com/html',
    likes: 5,
  },
  {
    title: 'CSS is tricky',
    author: 'Jane Doe',
    url: 'http://example.com/css',
    likes: 10,
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test.only('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test.only('the first blog is about HTTP methods', async () => {
  const response = await api.get('/api/blogs')

  const title = response.body.map(e => e.title)
  assert(title.includes('HTML is easy'))
})

after(async () => {
  await mongoose.connection.close()
})