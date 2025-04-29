import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ScoreCard from './components/ScoreCard'

function App() {
  const [data, setData] = useState([])

  const getData = async ()=>{
    const response = await axios.get('https://api.cricapi.com/v1/currentMatches?apikey=15f90bd8-beca-4786-ac34-912da888acd9&offset=0');

    setData(response.data.data);
  }

  useEffect(() => {
    getData();
  }, [])
  

  return (
    <div className=' '>
      <div className='flex justify-center items-center p-3 mb-5 bg-pink-600 text-white font-bold text-2xl'>
        <h1>Live Cricket Score</h1>
      </div>
       
      
      <div className='flex justify-between ml-5 mr-5 flex-wrap'>
        {
          data.map(function(match){
            return  <div key={match.id}>
              <ScoreCard 
                name={match.name} 
                status={match.status} 
                date={match.date} 
                teams={match.teams} 
                score={match.score} 
              />
            </div>
          })
        }
      </div>
    </div>
  )
}

export default App
