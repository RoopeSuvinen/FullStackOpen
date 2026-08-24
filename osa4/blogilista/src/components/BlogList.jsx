import Blog from './Blog'
import PropTypes from 'prop-types'

const BlogList = ({ blogs, onVote, onDelete, user }) => {
  return (
    <ul className="blog-list">
      {blogs.map((blog) => (
        <li key={blog.id}>
          <Blog blog={blog} onVote={onVote} onDelete={onDelete} user={user} />
        </li>
      ))}
    </ul>
  )
}

BlogList.PropTypes = {
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