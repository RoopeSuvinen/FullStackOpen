import Blog from './Blog'
import PropTypes from 'prop-types'

const BlogList = ({ blogs, onVote, onDelete, user }) => {
  return (
    <div className="blog-list">
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} onVote={onVote} onDelete={onDelete} user={user} />
      ))}
    </div>
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