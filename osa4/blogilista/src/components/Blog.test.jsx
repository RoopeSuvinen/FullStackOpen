import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Blog from './Blog'
import BlogForm from './BlogForm'

test('Renders blog title as a link', () => {
  const blog = {
    id: '1',
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 5,
    user: {
      id: 'user1',
      username: 'tester',
      name: 'Test Tester'
    }
  }

  const user = {
    id: 'user1',
    username: 'tester',
    name: 'Test Tester'
  }

  render(
    <BrowserRouter>
      <Blog blog={blog} />
    </BrowserRouter>
  )

  // Checks that blog title renders.
  const element = screen.getByRole('link', {
    name: 'Component testing is done with react-testing-library'
  })
  expect(element).toHaveAttribute('href', '/blogs/1')
  expect(screen.queryByRole('button', { name: 'view' })).not.toBeInTheDocument()
  expect(screen.queryByText('Test Author')).not.toBeInTheDocument()
})

test('calls createBlog with correct details when form is submitted', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('Title')
  const authorInput = screen.getByPlaceholderText('Author')
  const urlInput = screen.getByPlaceholderText('URL')
  const submitButton = screen.getByRole('button', { name: 'Add blog' })

  await user.type(titleInput, 'New Blog Title')
  await user.type(authorInput, 'New Blog Author')
  await user.type(urlInput, 'http://newblog.com')
  await user.click(submitButton)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'New Blog Title',
    author: 'New Blog Author',
    url: 'http://newblog.com',
    likes: 0,
  })
})