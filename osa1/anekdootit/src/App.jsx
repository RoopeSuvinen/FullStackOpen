import { useState } from 'react'

const Button = (props) => {
  return <button onClick={props.handleClick}>{props.text}</button>
}

const RandomAnecdote = (setSelected, anecdotes) => {
  const randomInt = Math.floor(Math.random() * anecdotes.length);
  setSelected(randomInt)
  console.log(randomInt)
}

const Vote = (votes, setVotes, selected) => {
  const copy = [... votes]
  copy[selected] += 1
  setVotes(copy)
  console.log(copy)
}

const MostVoted = ({ votes, anecdotes }) => {
  // Find biggest value 
  const maxVotes = Math.max(...votes);  
  const mostVotedIndex = votes.indexOf(maxVotes);  

  // Show the most voted anecdote
  return (
    <div>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[mostVotedIndex]}</p>
      <p>Has {maxVotes} votes</p>
    </div>
  )
}


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Uint8Array(8))
  const [mostVoted, setMostvoted] = useState(0)

  return (
    <div>
    <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <br />
      Has {votes[selected]} votes
      <br />
      <Button handleClick={() => Vote(votes, setVotes, selected)} text="vote" />
      <Button handleClick={() => RandomAnecdote(setSelected, anecdotes)} text="next anecdote" />
      <MostVoted votes={votes} anecdotes={anecdotes} />
    </div>
  )
}

export default App