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

  await api
  .post('/api/blogs')
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
    title: "Defaulting likes",
    author: "Masa Mainio",
    url: "http://esimerkki.com/likes",
  }

  // Sending POST-request.
  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(201)
  .expect('Content-Type', /application\/json/)

    const updatedBlogList = await Blog.find({})
    const savedBlog = updatedBlogList.find(blog => blog.title === newBlog.title)

    assert.strictEqual(savedBlog.likes, 0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: "Pentti Meikäläinen",
    url: "http://esimerkki.com/notitle",
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400) // Title missing, 400 Bad request

  const newBlogList = await Blog.find({})
  assert.strictEqual(newBlogList.length, initialBlogs.length) // Lenght must be the same.
})

test('blog without url is not added', async () => {
  const newBlog = {
    author: "Maija Meikäläinen",
    title: "Woman without url",
    likes: 2
  }

  await api
    .post('/api/blogs')
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
  .expect(204)

  const blogsAfterDelete = await Blog.find({})

  assert.strictEqual(blogsAfterDelete.length, allBlogs.length - 1) // Checks if allBlogs has been reduced by one.
  // Checks if deletet blog is gone from blogsAfterDelete -list
  const allIds = blogsAfterDelete.map(b => b.id)
  assert.ok(!allIds.includes(deletedBlog.id))
})

after(async () => {
  await mongoose.connection.close()
})