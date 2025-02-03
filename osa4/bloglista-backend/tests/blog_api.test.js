const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const assert = require('assert')
const bcrypt = require('bcryptjs')

const api = supertest(app)

let authToken = ''

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
  await User.deleteMany({})

  // Generates test user and test password for tests.
  const passwordHash = await bcrypt.hash('testpassword', 10)
  const user = new User({ username: 'testuser', name: 'Test User', passwordHash })
  await user.save()

  // Gets token by HTTP-login
  const loginResponse = await api
    .post('/api/login')
    .send({
      username: 'testuser',
      password: 'testpassword',
    })
    .expect(200)

  authToken = loginResponse.body.token

  // Adds test blogs by user ID
  const userId = user._id.toString()
  await new Blog({ ...initialBlogs[0], user: userId }).save()
  await new Blog({ ...initialBlogs[1], user: userId }).save()
})

describe('Tests for blog API', () => {

  // Test for checking blog info are returned as JSON values. HTTP-GET
  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  // Test for checking right id-name, HTTP-GET
  test('returned blogs have id field instead of _id', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
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
      title: 'Tests are fun!',
      author: 'Matti Meikäläinen',
      url: 'http://esimerkki.com/blogit',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // Checks if list length is 1 blog longer after POST.
    const updatedBlogList = await Blog.find({})
    assert.strictEqual(updatedBlogList.length, initialBlogs.length + 1)

    // Checks if added blog is in the blogList and title is correct.
    const titles = updatedBlogList.map((blog) => blog.title)
    assert.ok(titles.includes(newBlog.title))
  })

  test('if likes is not defined, default value is 0', async () => {
    const newBlog = {
      title: 'Defaulting likes',
      author: 'Masa Mainio',
      url: 'http://esimerkki.com/likes',
    }

    // Sending POST-request.
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const updatedBlogList = await Blog.find({})
    const savedBlog = updatedBlogList.find(blog => blog.title === newBlog.title)

    assert.strictEqual(savedBlog.likes, 0)
  })

  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'Pentti Meikäläinen',
      url: 'http://esimerkki.com/notitle',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(400) // Title missing, 400 Bad request

    const newBlogList = await Blog.find({})
    assert.strictEqual(newBlogList.length, initialBlogs.length) // Lenght must be the same.
  })

  test('blog without url is not added', async () => {
    const newBlog = {
      author: 'Maija Meikäläinen',
      title: 'Woman without url',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(400) // Url missing, 400 Bad request

    const newBlogList = await Blog.find({})
    assert.strictEqual(newBlogList.length, initialBlogs.length)  // Length must be the same
  })

  test('a blog has been deleted successfully', async () => {
    const allBlogs = await Blog.find({})
    const deletedBlog = allBlogs[0] // Takes the first blog.

    await api
      .delete(`/api/blogs/${deletedBlog.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(204)

    const blogsAfterDelete = await Blog.find({})

    assert.strictEqual(blogsAfterDelete.length, allBlogs.length - 1) // Checks if allBlogs has been reduced by one.
    // Checks if deletet blog is gone from blogsAfterDelete -list
    const allIds = blogsAfterDelete.map(b => b.id)
    assert.ok(!allIds.includes(deletedBlog.id))
  })

  test('blog likes can be updated', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToUpdate = blogsAtStart[0]

    const updatedBlogData = {
      likes: blogToUpdate.likes + 1
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedBlogData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)

    const blogsAtEnd = await Blog.find({})
    const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
    assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1)
  })

})

after(async () => {
  await mongoose.connection.close()
})