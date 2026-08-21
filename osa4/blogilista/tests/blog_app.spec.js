const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://127.0.0.1:3003/api/testing/reset')
    await request.post('http://127.0.0.1:3003/api/users', {
      data: {
        name: 'Roope Suvinen',
        username: 'roopesuvi',
        password: 'secret'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Log in to application' })).toBeVisible()
    await expect(page.getByRole('textbox').nth(0)).toBeVisible()
    await expect(page.getByRole('textbox').nth(1)).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'roopesuvi', 'secret')

      await expect(page.getByText('Roope Suvinen logged in')).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Add new blog' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'roopesuvi', 'secretwrong')

      await expect(page.getByText('Wrong username or password')).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Log in to application' })).toBeVisible()
    })

    test('a logged-in user can create a blog', async ({ page }) => {
      await loginWith(page, 'roopesuvi', 'secret')
      await createBlog(page, 'Testiblogi', 'Roope Suvinen', 'https://example.com/testiblogi')

      await expect(page.getByText('Testiblogi', { exact: true })).toBeVisible()
      await expect(page.getByText('A new blog "Testiblogi" by Roope Suvinen added')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await loginWith(page, 'roopesuvi', 'secret')
      await createBlog(page, 'Likeable blog', 'Roope Suvinen', 'https://example.com/likeable')

      await page.getByRole('button', { name: 'View' }).click()
      const likeButton = page.getByRole('button', { name: 'like' })
      await likeButton.click()

      await expect(page.getByText('Likes: 1')).toBeVisible()
    })

    test('a blog can be deleted', async({ page }) => {
      await loginWith(page, 'roopesuvi', 'secret')
      await createBlog(page, 'Poistettava blogi', 'Roope Suvinen', 'https://example.com/poistettava')

      const blog = page.getByText('Poistettava blogi', { exact: true })
      await expect(blog).toBeVisible()
      await page.getByRole('button', { name: 'View' }).click()

      page.once('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'Delete' }).click()

      await expect(blog).not.toBeVisible()
    })
  })
})