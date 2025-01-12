/* eslint-disable react/prop-types */
import { useState } from 'react'

// Component for adding new Blogpost
const BlogForm = ({onSubmit, newAuthor, handleAddAuthor, newTitle, handleAddTitle, newUrl, handleAddUrl}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        Author: <input value={newAuthor} onChange={handleAddAuthor} />
        Title: <input value={newTitle} onChange={handleAddTitle} />
        Url: <input value ={newUrl} onChange={handleAddUrl} />
      </div>
      <button type="submit"> Add blog </button> 
    </form>
  )
}

// Component for forming list of blogs
const BlogList = () => {

 return( <ul>
    <li>Blog1</li>
    <li>Blog2</li>
  </ul>
  )
}

// Eventhandler for new Blogpost information. TODO: Valdiation and checks for new blog.
const addBlog = (event) => {
  event.preventDefault()

  
}


function App() {

  // Hooks for new blogpost information
  const [newAuthor, setNewAuthor] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')

  // Event handlers for input data
  const handleAddAuthor = (event) => setNewAuthor(event.target.value)
  const handleAddTitle = (event) => setNewTitle(event.target.value)
  const handleAddUrl = (event) => setNewUrl(event.target.value)

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
      <BlogList />
    </div>
  )
}

export default App
