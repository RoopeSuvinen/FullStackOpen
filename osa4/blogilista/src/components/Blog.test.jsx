import { render, screen } from '@testing-library/react'
import Blog from './Blog'

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