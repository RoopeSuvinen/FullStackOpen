import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Blog from './Blog'
import BlogForm from './BlogForm'

test('Renders blog title', () => {
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

  render(<Blog blog={blog} onVote={() => {}} onDelete={() => {}} user={user} />)

  // Checks that blog title renders.
  const element = screen.getByText(/Component testing is done with react-testing-library/i)
  expect(element).toBeDefined()
})

test('Shows url, likes and user when view button is clicked', async () => {
  const blog = {
    id: '1',
    title: 'Testiblogi',
    author: 'Testikirjoittaja',
    url: 'http://testi.com',
    likes: 5,
    user: {
      id: 'user1',
      username: 'MasaMainio',
      name: 'Matti Meikäläinen'
    }
  }

  const user = {
    id: 'user1',
    username: 'MasaMainio',
    name: 'Matti Meikäläinen'
  }

  render(<Blog blog={blog} onVote={() => {}} onDelete={() => {}} user={user} />)

  // Initially, url and likes should not be visible
  expect(screen.queryByText(/http:\/\/testi.com/)).not.toBeInTheDocument()
  expect(screen.queryByText(/Likes:/)).not.toBeInTheDocument()

  // Click the view button
  const viewButton = screen.getByRole('button', { name: 'view' })
  await userEvent.click(viewButton)

  // Now url, likes and user should be visible
  expect(screen.getByText(/http:\/\/testi.com/)).toBeInTheDocument()
  expect(screen.getByText(/Likes:/)).toBeInTheDocument()
  expect(screen.getByText(/Added by:/)).toBeInTheDocument()
})

test('calls event handler twice when the like button is clicked twice', async () => {
  const blog = {
    id: '1',
    title: 'A blog',
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

  const mockHandler = vi.fn()
  const userInter = userEvent.setup()

  render(<Blog blog={blog} onVote={mockHandler} onDelete={() => {}} user={user} />)

  await userInter.click(screen.getByRole('button', { name: 'view' }))
  await userInter.click(screen.getByRole('button', { name: 'like' }))
  await userInter.click(screen.getByRole('button', { name: 'like' }))

  expect(mockHandler).toHaveBeenCalledTimes(2)
  expect(mockHandler).toHaveBeenNthCalledWith(1, blog.id) // First call with blog id
  expect(mockHandler).toHaveBeenNthCalledWith(2, blog.id) // Second call with blog id, are they identical? 
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