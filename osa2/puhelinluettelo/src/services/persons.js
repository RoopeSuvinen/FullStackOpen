import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/persons'

const getAll = async () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = async (nameObject) => {
    const response = axios.post(baseUrl, nameObject)
    return response.data
}

const update = (id, nameObject) => {
    const request = axios.put(`${baseUrl}/${id}`, nameObject);
    return request.then(response => response.data);
}

const remove = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

export default {getAll, create, update, remove}