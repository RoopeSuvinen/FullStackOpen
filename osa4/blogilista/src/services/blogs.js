import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = nameObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = axios.post(baseUrl, nameObject, config)
  return response.then(response => response.data)
}

const update = async (id, updatedObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedObject)
  return response.data
}

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

const setToken = newToken => {
  token = newToken ? `Bearer ${newToken}` : null
}

export default { getAll, create, remove, setToken, update }