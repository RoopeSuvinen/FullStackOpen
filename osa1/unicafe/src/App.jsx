import { useState } from 'react'

const Header = () => {
  return <h1>give feedback</h1>
}

const Button = (props) => {
  return <button onClick={props.handleClick}>{props.text}</button>
}

const Statistics = ({good, neutral, bad}) => {
  if (good === 0 && neutral === 0 && bad  === 0) {
    return (
      <p>No feedback given</p>
    )
  }
  
  const total = good + neutral + bad
  const average = total > 0 ? (good - bad) / total : 0
  const positivePercentage = total > 0 ? (good / total) * 100 : 0
  
  return (
    <div>
      <h1>statistics</h1>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <p>all {total}</p>
      <p>average {average.toFixed(2)}</p>
      <p>positive {positivePercentage.toFixed(2)} %</p>
    </div>  
  )
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
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App