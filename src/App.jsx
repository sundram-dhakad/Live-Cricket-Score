import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import ScoreCard from './components/ScoreCard'
import './App.css'

const API_URL = 'https://api.cricapi.com/v1/currentMatches'
const FALLBACK_API_KEY = '15f90bd8-beca-4786-ac34-912da888acd9'
const API_KEY = import.meta.env.VITE_CRICAPI_KEY || FALLBACK_API_KEY
const THEME_STORAGE_KEY = 'cricket-score-theme'

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return 'light'
    }

    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  const getData = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const response = await axios.get(API_URL, {
        params: {
          apikey: API_KEY,
          offset: 0,
        },
        timeout: 10000,
      })

      const matches = response?.data?.data
      if (!Array.isArray(matches)) {
        throw new Error('Invalid response from score API')
      }

      setData(matches)
    } catch {
      setError('Unable to fetch live scores right now. Please try again.')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    getData()
  }, [getData])

  useEffect(() => {
    document.body.classList.toggle('theme-dark', theme === 'dark')
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <div className={`app-shell ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      <div className='app-header'>
        <h1 className='app-title'>Live Cricket Score</h1>
        <button
          type='button'
          className='theme-toggle'
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? '☀' : '🌙'}
        </button>
      </div>

      {loading && (
        <div className='status-card'>Loading live matches...</div>
      )}

      {!loading && error && (
        <div className='status-card status-error'>
          <p>{error}</p>
          <button type='button' className='retry-button' onClick={getData}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className='status-card'>No live matches available at the moment.</div>
      )}

      {!loading && !error && data.length > 0 && (
        <div className='match-grid'>
          {data.map((match) => (
            <ScoreCard
              key={match.id}
              name={match.name}
              status={match.status}
              date={match.date}
              teams={match.teams}
              score={match.score}
            />
          ))}
        </div>
      )}
      </div>
  )
}

export default App
