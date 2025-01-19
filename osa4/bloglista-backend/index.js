require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

const Blog = require('./models/blogs')

app.use(cors())
app.use(express.static('dist')) // Express shows static pages index.html
app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.get('/api/blogs/:id', (request, response, next) => {
  const id = request.params.id

  Blog.findById(id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/blogs', (request, response, next) => {
  const body = request.body

  if (!body.title || !body.author || !body.url) {
    return response.status(400).json({
      error: 'Missing required fields: title, author, or url',
    })
  }

  // Checks if there is same title in bloglist
  Blog.findOne({ title: body.title })
    .then((existingBlog) => {
      if (existingBlog) {
        return response.status(400).json({
          error: 'Title must be unique',
        })
      }

      // If not, create a new blog via constructor
      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
      })

      return blog.save()
    })
    .then((savedBlog) => {
      response.status(201).json(savedBlog)
    })
    .catch((error) => {
      next(error)
    })
})

// Deletes blog from list.
app.delete('/api/blogs/:id', (request, response, next) => {
  Blog.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})