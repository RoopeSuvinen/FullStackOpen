import { useState } from 'react'

const Blog = ({ blog, onVote, onDelete }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div className="blog-card">
      <div>
        <span className="blog-title">{blog.title}</span> 
        <span className="blog-author"> {blog.author}</span>
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div>
          <p className="blog-url">
            <strong>URL:</strong> <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a>
          </p>
          <p>
            <strong>Likes:</strong> {blog.likes} 
            <button onClick={() => onVote(blog.id)}>like</button>
          </p>
          <p><strong>Added by:</strong> {blog.user?.name || 'Unknown'}</p>
          <button onClick={() => onDelete(blog.id, blog.title)}>Delete</button>
        </div>
      )}
    </div>
  )
}

export default Blog