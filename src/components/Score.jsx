import React from 'react'

function Score({ score }) {
  const inning = score?.inning || 'Inning'
  const runs = score?.r ?? '-'
  const wickets = score?.w ?? '-'
  const overs = score?.o ?? '-'

  return (
    <div className='score-row'>
      <div className='score-inning'>{inning}</div>
      <div className='score-value'>{runs}/{wickets} ({overs})</div>
    </div>
  )
}

export default Score
