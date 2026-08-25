import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom'
import Blog from './Blog'
import BlogForm from './BlogForm'
import BlogView from './BlogView'

const blog = {
  id: '1',
  title: 'Testiblogi',
  author: 'Testikirjoittaja',
  url: 'http://testi.com',
  likes: 5,
  user: {
    id: 'user1',
    username: 'tester',
    name: 'Testaaja',
  },
}

const blogOwner = {
  id: 'user1',
  username: 'tester',
  name: 'Testaaja',
}

const anotherUser = {
  id: 'user2',
  username: 'anotheruser',
  name: 'Toinen Käyttäjä',
}

const renderBlogView = (user = null) => {
  render(
    <MemoryRouter initialEntries={['/blogs/1']}>
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <BlogView
              blogs={[blog]}
              onVote={vi.fn()}
              onDelete={vi.fn()}
              user={user}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

test('Renders blog title as a link', () => {
  const listBlog = { ...blog, title: 'Component testing is done with react-testing-library' }

  render(
    <BrowserRouter>
      <Blog blog={listBlog} />
    </BrowserRouter>
  )

  // Checks that blog title renders.
  const element = screen.getByRole('link', {
    name: 'Component testing is done with react-testing-library by Testikirjoittaja'
  })
  expect(element).toHaveAttribute('href', '/blogs/1')
  expect(screen.queryByRole('button', { name: 'view' })).not.toBeInTheDocument()
})

test('Logged-out user sees blog details but no buttons', () => {
  renderBlogView()

  expect(screen.getByRole('heading', { name: 'Testiblogi' })).toBeInTheDocument()
  expect(screen.getByText('http://testi.com')).toBeInTheDocument()
  expect(screen.getByText('likes 5')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'like' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'remove' })).not.toBeInTheDocument()
})

test('Non-owner sees only the like button', () => {
  renderBlogView(anotherUser)

  expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'remove' })).not.toBeInTheDocument()
})

test('Blog owner sees both like and remove buttons', () => {
  renderBlogView(blogOwner)

  expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'remove' })).toBeInTheDocument()
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