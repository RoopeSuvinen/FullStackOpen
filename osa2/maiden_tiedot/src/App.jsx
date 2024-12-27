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
const Countries = ({countries}) => {
  return(
    <ul>
      {countries.map((country) => (
        <li key={country.name.common}>
          {country.name.common}
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
const CountryList = ({ countries, filter }) => {
  if (!filter) {
    return null;
  }
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }
  if (countries.length === 1) {
    return <CountryDetails country={countries[0]} />
  }
  return <Countries countries={countries} />
}

/**
 * Component for handling country details.
 * @param {*} param0 
 * @returns 
 */
const CountryDetails = ({country}) => {

  return (
    <div>
      <h2>{country.name.common}</h2>
      <div className="country-details">
      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>
      </div>
      <p><strong>Languages:</strong></p>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`Flag`} style={{ maxWidth: "150px"}}/ >
    </div>
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

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

const handleFilterChange = (event) => setFilter(event.target.value)

  return (
    <div>
      <Filter value={filter} onChange={handleFilterChange} />
      <CountryList countries={filterCountries} filter={filter} />
    </div>
  )
}

export default App
