/* global require */

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
    await page.goto('/login')
  })

  test('login succeeds with correct credentials', async ({ page }) => {
    await loginWith(page, 'roopesuvi', 'secret')

    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByText('Roope Suvinen logged in')).toBeVisible()
  })

  test('login fails with wrong credentials', async ({ page }) => {
    await loginWith(page, 'roopesuvi', 'wrongpassword')

    await expect(page.getByText('Wrong username or password')).toBeVisible()
    await expect(page).toHaveURL(/\/login$/)
  })

  test('logged-in user can create a blog', async ({ page }) => {
    await loginWith(page, 'roopesuvi', 'secret')
    await createBlog(page, 'Testiblogi', 'Roope Suvinen', 'https://example.com/testiblogi')

    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole('link', { name: 'Testiblogi' })).toBeVisible()
  })

  test('logged-in user can like a blog', async ({ page }) => {
    await loginWith(page, 'roopesuvi', 'secret')
    await createBlog(page, 'Likeable blog', 'Roope Suvinen', 'https://example.com/likeable')
    await page.getByRole('link', { name: 'Likeable blog' }).click()

    await page.getByRole('button', { name: 'like' }).click()

    await expect(page.getByText('likes 1')).toBeVisible()
  })

  test('logged-in user can delete a blog', async ({ page }) => {
    await loginWith(page, 'roopesuvi', 'secret')
    await createBlog(page, 'Poistettava blogi', 'Roope Suvinen', 'https://example.com/poistettava')
    await page.getByRole('link', { name: 'Poistettava blogi' }).click()

    page.once('dialog', dialog => dialog.accept())
    await page.getByRole('button', { name: 'remove' }).click()

    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole('link', { name: 'Poistettava blogi' })).not.toBeVisible()
  })
})
