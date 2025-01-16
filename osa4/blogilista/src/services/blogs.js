import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = nameObject => {
  const response = axios.post(baseUrl, nameObject)
  return response.then(response => response.data)
}

export default {getAll, create}