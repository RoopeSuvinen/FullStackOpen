import { useState, useEffect } from 'react'
import countryService from './services/countries.js'
import './index.css'

/**
 * Handles finding countries with textfield
 * @param {*} param0 
 * @returns 
 */
const Filter = ({ value, onChange }) => {
  return (
    <div>
      Find countries: <input value={value} onChange={onChange} />
    </div>
  )
}

/**
 * Component for listing country names
 * @param {*} param0 
 * @returns 
 */
const Countries = ({countries, onShowCountry}) => {
  return(
    <ul>
      {countries.map((country) => (
        <li key={country.name.common}>
          {country.name.common} <button onClick={() => onShowCountry(country)}>show</button>
        </li>
      )
      )}
    </ul>
  )
}

/**
 * Component for handling for showing max 10 countries in list.
 * @param {*} param0 
 * @returns 
 */
const CountryList = ({ countries, filter, onShowCountry }) => {
  if (!filter) {
    return null;
  }
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }
  if (countries.length === 1) {
    return <CountryDetails country={countries[0]} />
  }
  return <Countries countries={countries} onShowCountry={onShowCountry} />
}

/**
 * Component for handling country and weather info. API key is from https://openweathermap.org/ 
 * @param {*} param0 
 * @returns 
 */
const CountryDetails = ({country}) => {
  const [latitude, longitude] = country.capitalInfo.latlng
  const [weather, setWeather] = useState(null)
  const api_key = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    countryService
      .getWeather(latitude, longitude, api_key)
      .then(response => {
        setWeather(response.data.current)
      })
  }, [latitude, longitude, api_key])

  return (
    <div>
      <h2>{country.name.common}</h2>
      <div className="country-details">
      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>
      </div>
      <p><strong>Languages:</strong></p>
      <ul className="languages-list">
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`Flag`} style={{ maxWidth: "150px"}}/ >
      <br />
      <h2>Weather in {country.capital}</h2>
      {weather ? (
        <div>
          <p>Temperature: {weather.temp}°C</p>
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="Weather icon" />
          <p>Wind: {weather.wind_speed} m/s</p>
        </div>
      ) : (
        <p>Cannot fetch weather data</p>
      )}
    </div>
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    countryService
      .getAll()
      .then(response => {
        setCountries(response.data)
      })
  }, [])


  const filterCountries = Array.isArray(countries)
  ? countries.filter(country => 
      country.name.common.toLowerCase().includes(filter.toLowerCase())
    ) // Searching countries with lower cases also. 
  : [];

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setSelectedCountry(null) //Going back to listview if alphabet is deleted from textield.
  }
  const handleShowCountry = (country) => setSelectedCountry(country)

  return (
    <div>
    <Filter value={filter} onChange={handleFilterChange} />
    {!selectedCountry ? (
      <CountryList
        countries={filterCountries}
        filter={filter}
        onShowCountry={handleShowCountry}
      />
    ) : (
      <CountryDetails country={selectedCountry} />
    )}
  </div>
  )
}

export default App
