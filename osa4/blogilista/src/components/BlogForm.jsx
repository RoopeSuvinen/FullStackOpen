import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({ title, author, url, likes: 0 })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          Title: <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          Author: <input value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <div>
          URL: <input value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <button type="submit">Add blog</button>
      </form>
    </div>
  )
}

export default BlogForm