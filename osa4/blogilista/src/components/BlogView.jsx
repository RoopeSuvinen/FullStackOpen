import { Link, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button, Stack, Typography } from '@mui/material'

const BlogView = ({ blogs, onVote, onDelete, user }) => {
  const { id } = useParams()
  const blog = blogs.find(blog => blog.id === id)

  if (!blog) {
    return <div>Blog not found</div>
  }

  const showRemoveButton =
    user?.username && (blog.user?.username === user.username || blog.user?.id === user.id)

  return (
    <div className="blog-view">
      <Typography className="blog-view-title" variant="h3" component="h2">
        {blog.title}
      </Typography>
      <Typography>by {blog.author}</Typography>
      <Stack className="blog-view-details" spacing={0.5}>
        <a className="blog-view-url" href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </a>
        <Typography>likes {blog.likes}</Typography>
        <Typography>Added by {blog.user?.name || 'Unknown'}</Typography>
      </Stack>
      <Stack direction="row" spacing={1}>
        {user && <Button variant="contained" onClick={() => onVote(blog.id)}>like</Button>}
        {showRemoveButton && (
          <Button color="error" variant="contained" onClick={() => onDelete(blog.id, blog.title)}>
            remove
          </Button>
        )}
        <Button component={Link} to="/" variant="contained">
          back to blogs
        </Button>
      </Stack>
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
