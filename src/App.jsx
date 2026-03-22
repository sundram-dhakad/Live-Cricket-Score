import React, { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import ScoreCard from './components/ScoreCard'
import { filterMatches, normalizeMatches } from './utils/matchUtils'
import './App.css'

const API_URL = 'https://api.cricapi.com/v1/currentMatches'
const FALLBACK_API_KEY = '15f90bd8-beca-4786-ac34-912da888acd9'
const API_KEY = import.meta.env.VITE_CRICAPI_KEY || FALLBACK_API_KEY
const THEME_STORAGE_KEY = 'cricket-score-theme'
const REFRESH_INTERVAL_MS = 60000

const getApiErrorMessage = (error, payload) => {
  const reason = payload?.reason || payload?.message || ''

  if (/hits today exceeded hits limit|credits/i.test(reason)) {
    return 'CricAPI quota exceeded for this key. Add your own VITE_CRICAPI_KEY in .env and restart the app.'
  }

  if (reason) {
    return `Unable to fetch live scores: ${reason}`
  }

  const axiosMessage = error?.response?.data?.reason || error?.message
  if (axiosMessage) {
    return `Unable to fetch live scores: ${axiosMessage}`
  }

  return 'Unable to fetch live scores right now. Please try again.'
}

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [showSearchFilters, setShowSearchFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
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

  const getData = useCallback(async ({ silent = false } = {}) => {
    try {
      if (silent) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      setError('')

      const response = await axios.get(API_URL, {
        params: {
          apikey: API_KEY,
          offset: 0,
        },
        timeout: 10000,
      })

      const payload = response?.data
      if (payload?.status === 'failure') {
        throw new Error(getApiErrorMessage(null, payload))
      }

      const matches = payload?.data
      if (!Array.isArray(matches)) {
        throw new Error('Invalid response from score API')
      }

      setData(normalizeMatches(matches))
    } catch (error) {
      setError(getApiErrorMessage(error, error?.response?.data))
      if (!silent) {
        setData([])
      }
    } finally {
      setRefreshing(false)
      if (!silent) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    getData()
  }, [getData])

  useEffect(() => {
    const interval = window.setInterval(() => {
      getData({ silent: true })
    }, REFRESH_INTERVAL_MS)

    return () => {
      window.clearInterval(interval)
    }
  }, [getData])

  useEffect(() => {
    document.body.classList.toggle('theme-dark', theme === 'dark')
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))
  }

  const toggleSearchFilters = () => {
    setShowSearchFilters((currentState) => !currentState)
  }

  const availableTypes = useMemo(() => {
    return Array.from(new Set(data.map((match) => match.matchType).filter(Boolean)))
  }, [data])

  const filteredData = useMemo(() => {
    return filterMatches(data, {
      searchTerm,
      statusFilter,
      typeFilter,
    })
  }, [data, searchTerm, statusFilter, typeFilter])

  return (
    <div className={`app-shell ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      <div className='app-header'>
        <div className='app-brand'>
          <img
            className='app-logo'
            src='/Rohit%20Sharma%20Logo.png'
            alt='Cric45 logo'
          />
          <h1 className='app-title'>Cric45</h1>
        </div>
        <div className='header-actions'>
          <button
            type='button'
            className={`search-toggle ${showSearchFilters ? 'is-active' : ''}`}
            onClick={toggleSearchFilters}
            aria-label={showSearchFilters ? 'Hide search filters' : 'Show search filters'}
            title={showSearchFilters ? 'Hide search filters' : 'Show search filters'}
          >
            <svg className='search-toggle-icon' aria-hidden='true' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <circle cx='11' cy='11' r='8'></circle>
              <path d='m21 21-4.35-4.35'></path>
            </svg>
            <span className='search-toggle-text'>Search</span>
          </button>
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
      </div>

      {showSearchFilters && (
        <div className='controls-wrap'>
          <div className='filters-row'>
            <input
              type='text'
              className='search-input'
              placeholder='Search by team or match'
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <select
              className='select-input'
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value='all'>All Status</option>
              <option value='live'>Live</option>
              <option value='completed'>Completed</option>
              <option value='upcoming'>Upcoming</option>
            </select>

            <select
              className='select-input'
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
            >
              <option value='all'>All Formats</option>
              {availableTypes.map((type) => (
                <option key={type} value={type}>
                  {type.toUpperCase()}
                </option>
              ))}
            </select>

            <button
              type='button'
              className='refresh-button'
              onClick={() => getData({ silent: true })}
              disabled={refreshing}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      )}

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

      {!loading && !error && data.length > 0 && filteredData.length === 0 && (
        <div className='status-card'>No matches found for the current filters.</div>
      )}

      {!loading && !error && filteredData.length > 0 && (
        <div className='match-grid'>
          {filteredData.map((match) => (
            <ScoreCard
              key={match.id}
              name={match.name}
              matchType={match.matchType}
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
