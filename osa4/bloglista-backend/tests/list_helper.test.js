const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogs = require('../utils/test_data')
console.log(blogs)

// Dummy test, returns 1
test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  // Test when blog list is empty
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  // Test for one blog
  test('when list has only one blog equals the likes of that', () => {
    const oneBlog = [blogs[0]]
    const result = listHelper.totalLikes(oneBlog)
    assert.strictEqual(result, 7)
  })

  // Test for multiple blogs
  test('when list has multiple blogs, total likes is calculated correctly', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })

  // Test for most liked blog
  test('most liked blog is found correctly', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, { // Using deepStrictEqual, which compares the structures and internal values.
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    })
  })

  // test for author who has the most blogs
  test('author who has the most blogs is found correctly', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3
    })
  })

  // Test for author with most likes
  test('author with most likes is found correctly', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })
})
