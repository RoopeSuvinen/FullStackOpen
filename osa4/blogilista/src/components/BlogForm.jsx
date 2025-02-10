const BlogForm = ({ onSubmit, newAuthor, handleAddAuthor, newTitle, handleAddTitle, newUrl, handleAddUrl }) => {
    return (
      <form onSubmit={onSubmit}>
        <div>
          Author: <input value={newAuthor} onChange={handleAddAuthor} />
        </div>
        <div>
          Title: <input value={newTitle} onChange={handleAddTitle} />
        </div>
        <div>
          Url: <input value={newUrl} onChange={handleAddUrl} />
        </div>
        <button type="submit">Add blog</button>
      </form>
    )
  }
  
  export default BlogForm