import { Link, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

const BlogView = ({ blogs, onVote, onDelete, user }) => {
  const { id } = useParams()
  const blog = blogs.find(blog => blog.id === id)

  if (!blog) {
    return <div>Blog not found</div>
  }

  const showRemoveButton =
    user?.username && (blog.user?.username === user.username || blog.user?.id === user.id)

  return (
    <div className="blog-card">
      <h2>{blog.title}</h2>
      <a href={blog.url} target="_blank" rel="noopener noreferrer">
        {blog.url}
      </a>
      <p>
        likes {blog.likes}
        {user && <button onClick={() => onVote(blog.id)}>like</button>}
      </p>
      <p>Added by {blog.user?.name || 'Unknown'}</p>
      {showRemoveButton && (
        <button onClick={() => onDelete(blog.id, blog.title)}>remove</button>
      )}
      <p><Link to="/">back to blogs</Link></p>
    </div>
  )
}

BlogView.propTypes = {
  blogs: PropTypes.arrayOf(PropTypes.object).isRequired,
  onVote: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  user: PropTypes.object,
}

BlogView.defaultProps = {
  user: null,
}

export default BlogView
