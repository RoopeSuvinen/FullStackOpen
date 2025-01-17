import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import './index.css'

// Component for adding new Blogpost
// eslint-disable-next-line react/prop-types
const BlogForm = ({onSubmit, newAuthor, handleAddAuthor, newTitle, handleAddTitle, newUrl, handleAddUrl}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        Author: <input value={newAuthor} onChange={handleAddAuthor} />
        Title: <input value={newTitle} onChange={handleAddTitle} />
        Url: <input value ={newUrl} onChange={handleAddUrl} />
      </div>
      <button type="submit">Add blog</button> 
    </form>
  )
}

// Component for forming list of blogs
const BlogList = ({ blogs, votes, onVote }) => {

  return (
    <div className="blog-list">
      {blogs.map((blog, index) => (
        <div className="blog-card" key={blog.title}>
          <h4 className="blog-title">{blog.title}</h4>
          <p className="blog-author">
            <strong>Author:</strong> {blog.author}
          </p>
          <p className="blog-url">
            <strong>URL:</strong>{' '}
            <a href={blog.url} target="_blank" rel="noopener noreferrer">
              {blog.url}
            </a>
          </p>
          <p className="blog-votes">
            <strong>Votes:</strong> {votes[index]}
          </p>
          <button onClick={() => onVote(index)}>Vote</button>
        </div>
      ))}
    </div>
  )
}

function App() {

  // Hooks for new blogpost information
  const [newAuthor, setNewAuthor] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [blogs, setBlogs] = useState([])
  const [votes, setVotes] = useState([])

  // Event handlers for input data
  const handleAddAuthor = (event) => setNewAuthor(event.target.value)
  const handleAddTitle = (event) => setNewTitle(event.target.value)
  const handleAddUrl = (event) => setNewUrl(event.target.value)
 
  // Fetching data using Effect hook
  useEffect(() => {
    console.log('effect')
    blogService
    .getAll()
    .then(blogPosts => {
      console.log(blogPosts)
      setBlogs(blogPosts)
      setVotes(blogPosts.map(() => 0))
    })
  }, [])

  // Adds vote for blog
  const increaseVote = (index) => {
    const updatedVotes = [...votes]
    updatedVotes[index]++
    setVotes(updatedVotes)
  }

  // Eventhandler for new Blogpost information. TODO: Valdiation and checks for new blog.
  const addBlog = (event) => {
  event.preventDefault()

  const blogObject = {
    title: newTitle,
    author: newAuthor,
    url: newUrl,
  }

  blogService
    .create(blogObject)
    .then((newBlog) => {
      console.log('New blog added:', newBlog)
      setBlogs(blogs.concat(newBlog))
      setNewTitle("")
      setNewAuthor("")
      setNewUrl("")
    })
}
  return (
    <div>
      <h1>Add new blog</h1>
      <BlogForm 
        onSubmit={addBlog}
        newAuthor={newAuthor}
        newTitle={newTitle}
        newUrl={newUrl}
        handleAddAuthor={handleAddAuthor}
        handleAddTitle={handleAddTitle}
        handleAddUrl={handleAddUrl}
      />
      <h1>Bloglist</h1>
      <BlogList blogs={blogs} votes={votes} onVote={increaseVote} />
    </div>
  )
}

export default App
