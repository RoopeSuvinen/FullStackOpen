const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0, // Default value 0.
  })
  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

// Updates blogpost. Currently updates only likes. TODO: Like count wont
// update to mongodb. Fix this.
blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body;
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes }, // Updates likes
    { new: true, runValidators: true }
  );
  if (!updatedBlog) {
    return response.status(404).json({ error: 'Blog not found.' });
  }
  response.json(updatedBlog);
});

module.exports = blogsRouter;
