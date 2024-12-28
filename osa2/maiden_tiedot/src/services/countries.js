import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

// All country data
const getAll = () => {
    return axios.get(baseUrl)
}

// Weather info for capital city, props latitude, longitude and apiKey
const getWeather = (lat, lon, apiKey) => {
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${apiKey}&units=metric`
  return axios.get(url)
}

export default {getAll, getWeather}