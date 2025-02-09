import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = nameObject => {
  const response = axios.post(baseUrl, nameObject)
  return response.then(response => response.data)
}

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

export default {getAll, create, remove, setToken}