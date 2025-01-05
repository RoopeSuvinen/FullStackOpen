import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = nameObject => {
    const response = axios.post(baseUrl, nameObject)
    return response.then(response => response.data)
}

const update = (id, nameObject) => {
    const request = axios.put(`${baseUrl}/${id}`, nameObject);
    return request.then(response => response.data);
}

const remove = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

export default {getAll, create, update, remove}