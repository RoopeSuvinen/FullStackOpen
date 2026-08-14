import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

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