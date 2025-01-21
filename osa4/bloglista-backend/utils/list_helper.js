const _ = require('lodash');

const dummy = (blogs) => {
    return 1
  }
  
const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce((previous, current) => {
    return current.likes > previous.likes ? current : previous
  })

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  }
}

const mostBlogs = (blogs) => {
  const howManyBlogs = _.countBy(blogs, 'author')
  const [author, blogCount] = _.maxBy(Object.entries(howManyBlogs), ([, count]) => count);

  return {
    author,
    blogs: blogCount,
  }
}

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
  }