import { useState } from 'react'

const Header = () => {
  return <h1>give feedback</h1>
}

const Button = (props) => {
  return <button onClick={props.handleClick}>{props.text}</button>
}

const Statistics = (props) => {
  return <h1>statistics</h1>
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header />
      <Button handleClick={() => setGood(good + 1)} text="good"/>
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral"/>
      <Button handleClick={() => setBad(bad + 1)} text="bad"/>
      <Statistics />
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
    </div>
  )
}

export default App