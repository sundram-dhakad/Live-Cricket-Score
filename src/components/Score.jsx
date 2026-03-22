import React from 'react'

function resolveTeamName(rawInning, teams = [], scoreIndex = 0) {
  const teamPart = rawInning
    .replace(/(innings?\s*\d+)$/i, '')
    .trim()
    .replace(/,+$/, '')

  const candidates = teamPart
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)

  let resolvedTeam = candidates[0] || ''
  if (!resolvedTeam && Array.isArray(teams) && teams[scoreIndex]) {
    resolvedTeam = teams[scoreIndex]
  }

  if (Array.isArray(teams) && teams.length > 0 && resolvedTeam) {
    const canonicalTeam = teams.find(
      (teamName) => teamName.toLowerCase() === resolvedTeam.toLowerCase(),
    )
    if (canonicalTeam) {
      resolvedTeam = canonicalTeam
    }
  }

  return resolvedTeam || teamPart || rawInning
}

function Score({
  score,
  allScores = [],
  teams = [],
  scoreIndex = 0,
  showInningLabel = false,
}) {
  const rawInning = score?.inning || 'Inning'
  const teamLabel = resolveTeamName(rawInning, teams, scoreIndex)

  const teamInningNumber = Array.isArray(allScores)
    ? allScores.slice(0, scoreIndex + 1).reduce((count, entry, idx) => {
      const entryTeam = resolveTeamName(entry?.inning || 'Inning', teams, idx)
      return entryTeam.toLowerCase() === teamLabel.toLowerCase() ? count + 1 : count
    }, 0)
    : 1

  const inning = showInningLabel
    ? `${teamLabel} (Inning ${teamInningNumber})`
    : teamLabel

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
