import Blog from './Blog'
import PropTypes from 'prop-types'

const BlogList = ({ blogs, onVote, onDelete, user }) => {
  return (
    <div className="blog-list-container">
      <h2>Blogs</h2>
      <ul className="blog-list">
        {blogs.map((blog) => (
          <li className="blog-list-item" key={blog.id}>
            <Blog blog={blog} />
          </li>
        ))}
      </ul>
    </div>
  )
}

BlogList.propTypes = {
  blogs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  })).isRequired,
  votes: PropTypes.arrayOf(PropTypes.number).isRequired,
  onVote: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}


export default BlogList