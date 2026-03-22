import React from 'react'
import Score from './Score';

function ScoreCard({ name, matchType, status, date, teams, score }) {
  const safeScores = Array.isArray(score) ? score : []
  const normalizedMatchType = String(matchType || '').toLowerCase()
  const isMultiInningsFormat = ['test', 'firstclass', 'first-class', 'fc'].includes(normalizedMatchType)
  const showInningLabel = isMultiInningsFormat

  const teamsLabel = Array.isArray(teams) && teams.length > 0 ? teams.join(' vs ') : 'Teams not available'

  return (
    <article className='score-card'>
      <div className='score-card-header'>
        <div className='score-date'>{date || 'Date unavailable'}</div>
        <div className='score-match-name'>{name || 'Match name unavailable'}</div>
        <div className='score-teams'>{teamsLabel}</div>
      </div>

      <div className='score-card-body'>
        <div className='score-list'>
          {safeScores.length > 0 ? (
            safeScores.map((sc, idx) => (
              <Score
                key={`${sc?.inning || 'inning'}-${idx}`}
                score={sc}
                allScores={safeScores}
                teams={teams}
                scoreIndex={idx}
                showInningLabel={showInningLabel}
              />
            ))
          ) : (
            <div className='score-row'>Score unavailable</div>
          )}
        </div>
        <div className='score-status'>{status || 'Status unavailable'}</div>
      </div> 
    </article>
  )
}

export default ScoreCard
