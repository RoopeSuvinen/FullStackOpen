import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import BlogForm from './components/BlogForm.jsx'
import Togglable from './components/Togglable'
import BlogList from './components/BlogList.jsx'

const Notification = ({ message }) => {
  if (!message || !message.content) {
    return null
  }

  const style = {
    color: message.type === "error" ? "red" : "green",
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  }

  return <div style={style}>{message.content}</div>
}
function App() {
  const blogFormRef = useRef()

  // Hooks for new blogpost information
  const [newAuthor, setNewAuthor] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [blogs, setBlogs] = useState([])
  const [votes, setVotes] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState({ content: null, type: "" })

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

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // User login handler
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, 
        password,
      })

      // Saves user info to local storage
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))

      console.log("Logged in user:", user)
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.error("Login failed", exception)
      setMessage({
        content: `Wrong username or password`,
        type: "error",
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  // User logout handler
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
    blogService.setToken(null)
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
      setMessage({
        content: `A new blog ${newTitle} by ${newAuthor} added`,
        type: "success",
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
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
        setMessage({
          content: `A blog ${newTitle} by ${newAuthor} removed`,
          type: "success",
        })
      })
  }
}

if (user === null) {
  return (
    <div>
        <h2>Log in to application</h2>
        <Notification message={message} />
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
    <p> {user.name} logged in </p> <button onClick={handleLogout}>Logout</button>
      <h1>Add new blog</h1>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
  <BlogForm 
    onSubmit={(event) => {
      addBlog(event)
      blogFormRef.current.toggleVisibility() // Lomake sulkeutuu lisäyksen jälkeen
    }}
    newAuthor={newAuthor}
    newTitle={newTitle}
    newUrl={newUrl}
    handleAddAuthor={handleAddAuthor}
    handleAddTitle={handleAddTitle}
    handleAddUrl={handleAddUrl}
  />
</Togglable>
      <Notification message={message} />
      <h1>Bloglist</h1>
      <BlogList blogs={blogs} onVote={increaseVote} onDelete={deleteBlog} />
    </div>
  )
}

export default App