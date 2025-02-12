import Blog from './Blog'

const BlogList = ({ blogs, onVote, onDelete }) => {
  return (
    <div className="blog-list">
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} onVote={onVote} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default BlogList