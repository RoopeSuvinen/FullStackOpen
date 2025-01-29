const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog.find({}).then(blogs => {
      response.json(blogs)
    })
  })

  blogsRouter.get('/:id', (request, response, next) => {
    Blog.findById(request.params.id)
      .then(blog => {
        if (blog) {
          response.json(blog)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
  })

  blogsRouter.post('/', async (request, response, next) => {
    try {
      const { title, author, url, likes } = request.body
  
      const blog = new Blog({
        title,
        author,
        url,
        likes: likes || 0 // Default value 0.
      })
  
      const savedBlog = await blog.save()
      response.status(201).json(savedBlog)
    } catch (error) {
      next(error)
    }
  })

blogsRouter.delete('/:id', (request, response, next) => {
    Blog.findByIdAndDelete(request.params.id)
      .then(() => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })

module.exports = blogsRouter