import Blog from './Blog'

const BlogList = ({ blogs, onVote, onDelete, user }) => {
  return (
    <div className="blog-list">
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} onVote={onVote} onDelete={onDelete} user={user} />
      ))}
    </div>
  )
}

export default BlogList