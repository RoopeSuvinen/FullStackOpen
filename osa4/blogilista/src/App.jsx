import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

// Component for adding new Blogpost
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
const BlogList = ({ blogs, onVote, onDelete }) => {
  return (
    <div className="blog-list">
      {blogs.map((blog) => (
        <div className="blog-card" key={blog.id}>
          <h4 className="blog-title">{blog.title}</h4>
          <p className="blog-author"><strong>Author:</strong> {blog.author}</p>
          <p className="blog-url">
            <strong>URL:</strong>{' '}
            <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a>
          </p>
          <p className="blog-votes"><strong>Likes:</strong> {blog.likes}</p>
          <button onClick={() => onVote(blog.id)}>Vote</button>
          <button onClick={() => onDelete(blog.id, blog.title)}>Delete blog</button>
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
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)

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
    .catch(error => {
      console.error('Error fetching blogs', error)
    })
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, 
        password,
      })
      console.log("Logged in user:", user)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.error("Login failed", exception)
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  // Adds vote for blog
  const increaseVote = async (id) => {
    const blogToUpdate = blogs.find(blog => blog.id === id)
    if (!blogToUpdate) return
  
    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }
  
    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
  
      setBlogs(blogs.map(blog => 
        blog.id === id ? returnedBlog : blog
      ))
    } catch (error) {
      console.error('Error updating likes:', error)
    }
  }

  // Eventhandler for new Blogpost information. TODO: Valdiation and checks for new blog.
  const addBlog = (event) => {
  event.preventDefault()

  // Checking if there is same blog in the list.
  const existingBlog = blogs.find((blog) =>
    blog.title === newTitle || blog.url === newUrl
  )

  if(existingBlog) {
    alert(
    `Blog with the same ${existingBlog.title === newTitle ? "title" : "URL"} already exists.`
    )
    return
  }

  const blogObject = {
    title: newTitle,
    author: newAuthor,
    url: newUrl,
    likes: 0,
  }

  blogService
    .create(blogObject)
    .then((newBlog) => {
      console.log('New blog added:', newBlog)
      setBlogs(blogs.concat(newBlog))
      setVotes(votes.concat(0))
      setNewTitle("")
      setNewAuthor("")
      setNewUrl("")
    })
}

const deleteBlog = (id, title) => {
  if (window.confirm(`Delete ${title}`)) {
    blogService
      .remove(id)
      .then(() => {
        setBlogs(blogs.filter(blog => blog.id !== id))
      })
  }
}

if (user === null) {
  return (
    <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
          username <input type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)}/>
          </div>
          <div>
          password <input type="text" value={password} name="Password" onChange={({ target }) => setPassword(target.value)}/>
          </div>
          <div>
            <button type="submit">login</button>
          </div>
        </form>
    </div>
  )
}

  return (
    <div>
    <p> {user.name} logged in </p>
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
      <BlogList blogs={blogs} votes={votes} onVote={increaseVote} onDelete={deleteBlog} />
    </div>
  )
}

export default App