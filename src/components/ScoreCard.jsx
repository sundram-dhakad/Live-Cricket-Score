import React from 'react'
import Score from './Score';

function ScoreCard(props) {
  const match = props;
  return (
    <div className='card text-black bg-white border border-gray-400 shadow-black shadow-2xl rounded w-100 mb-5 mt-5 hover:scale-110'>
      <div className='p-1'>
        <div className='text-gray-500'>{match.date}</div>
        <div className='flex items-center justify-center mt-1 font-semibold'>{match.name}</div>
      </div>

      <div className="info">
        <div className='flex justify-between p-3'>
          {
            match.score.map(function(sc,idx){
              return <div key={idx}>
                <Score score={sc}/>
              </div>
            })
          }
        </div>
        <div className='flex justify-center pb-2 text-blue-800'>{match.status}</div>
      </div> 
    </div>
  )
}

export default ScoreCard
