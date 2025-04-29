import React from 'react'

function Score(match) {
  return (
    <div>
      <div className='font-semibold'>{match.score.inning}</div>
      <div className='flex justify-center'>{match.score.r}/{match.score.w}/({match.score.o})</div>
    </div>
  )
}

export default Score
