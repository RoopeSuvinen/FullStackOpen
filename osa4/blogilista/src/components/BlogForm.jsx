import { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Button, Stack, TextField, Typography } from '@mui/material'

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
    <Box className="new-blog-page">
      <Stack className="new-blog-form" component="form" onSubmit={addBlog} spacing={2}>
        <Typography variant="h5" component="h2">
          Create a new blog
        </Typography>
        <TextField
          label="Title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          size="small"
        />
        <TextField
          label="Author"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          fullWidth
          size="small"
        />
        <TextField
          label="URL"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          fullWidth
          size="small"
        />
        <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start' }}>
          Add blog
        </Button>
      </Stack>
    </Box>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm