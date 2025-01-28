const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const assert = require('assert') 

const api = supertest(app)

// Bloglist for testing.
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

// Format Blog-list before testing.
beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

// Test for checking blog info are returned as JSON values. HTTP-GET
test('blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, initialBlogs.length)
})

// Test for checking right id-name, HTTP-GET
test('returned blogs have id field instead of _id', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const blogs = response.body
    for (const blog of blogs) {
      assert.ok(blog.id, 'Blog has id field')
      assert.strictEqual(blog._id, undefined, 'Blog does not have _id field')
    }
})

// Test for HTTP POST
test('a new blog can be added', async () => {
  const newBlog = {
    title: "Tests are fun!",
    author: "Matti Meikäläinen",
    url: "http://esimerkki.com/blogit",
  }

  // Sending POST-request.
  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(201)
  .expect('Content-Type', /application\/json/)

  // Checks if list length is 
  const updatedBlogList = await Blog.find({})
  assert.strictEqual(updatedBlogList.length, initialBlogs + 1)

  // Checks if added blog is in the blogList and title is correct.
  const titles = updatedBlogList.map((blog) => blog.title)
  assert.ok(titles.includes(newBlog.title))
})

after(async () => {
  await mongoose.connection.close()
})