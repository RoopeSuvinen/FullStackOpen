const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1
  })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body

 if (!title || !url) {
  return response.status(400).json({ error: 'title and url are required' })
}

const user = request.user

const blog = new Blog({
  title,
  author,
  url,
  likes: likes || 0,
  user: user._id
})

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' })
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'unauthorized: only the creator can delete this blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

// Updates blogpost. Currently updates only likes. TODO: Like count wontupdate to mongodb. Fix this.
blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes }, // Updates likes
    { new: true, runValidators: true }
  )
  if (!updatedBlog) {
    return response.status(404).json({ error: 'Blog not found.' })
  }
  response.json(updatedBlog)
})

module.exports = blogsRouter
