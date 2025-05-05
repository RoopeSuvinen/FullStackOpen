import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, onVote, onDelete, user }) => {
  console.log('Logged-in user:', user)
  console.log('Blog user:', blog.user)

  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const showRemoveButton =
    user?.username && (blog.user?.username === user.username || blog.user?.id === user.id)

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
            <strong>URL:</strong>{' '}
            <a href={blog.url} target="_blank" rel="noopener noreferrer">
              {blog.url}
            </a>
          </p>
          <p>
            <strong>Likes:</strong> {blog.likes}
            <button onClick={() => onVote(blog.id)}>like</button>
          </p>
          <p>
            <strong>Added by:</strong> {blog.user?.name || 'Unknown'}
          </p>
          {showRemoveButton && (
            <button onClick={() => onDelete(blog.id, blog.title)}>Delete</button>
          )}
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string,
      username: PropTypes.string,
      name: PropTypes.string,
    }),
  }).isRequired,
  onVote: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    username: PropTypes.string,
    name: PropTypes.string,
  }),
}

Blog.defaultProps = {
  user: null, // If no user is provided, default to null
}

export default Blog
