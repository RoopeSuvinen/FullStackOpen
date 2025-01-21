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
})
