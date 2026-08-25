/* global module */

const loginWith = async (page, username, password) => {
  await page.getByRole('textbox').nth(0).fill(username)
  await page.getByRole('textbox').nth(1).fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('link', { name: 'new blog' }).click()
  await page.getByPlaceholder('Title').fill(title)
  await page.getByPlaceholder('Author').fill(author)
  await page.getByPlaceholder('URL').fill(url)
  await page.getByRole('button', { name: 'Add blog' }).click()
  await page.getByText(title, { exact: true }).waitFor()
}

module.exports = { loginWith, createBlog }