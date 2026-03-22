const normalizeMatchType = (matchType) => String(matchType || '').toLowerCase()

const getStatusCategory = (match) => {
  if (match?.matchEnded) {
    return 'completed'
  }

  if (match?.matchStarted) {
    return 'live'
  }

  return 'upcoming'
}

export const normalizeMatches = (matches) => {
  return matches.map((match) => {
    const teams = Array.isArray(match?.teams) ? match.teams : []

    return {
      ...match,
      teams,
      score: Array.isArray(match?.score) ? match.score : [],
      matchType: normalizeMatchType(match?.matchType),
      statusCategory: getStatusCategory(match),
      searchBlob: [match?.name, match?.status, ...teams]
        .filter(Boolean)
        .join(' ')
        .toLowerCase(),
    }
  })
}

export const filterMatches = (matches, filters) => {
  const searchTerm = String(filters?.searchTerm || '').trim().toLowerCase()
  const statusFilter = filters?.statusFilter || 'all'
  const typeFilter = filters?.typeFilter || 'all'

  return matches.filter((match) => {
    const searchPass = !searchTerm || match.searchBlob.includes(searchTerm)
    const statusPass = statusFilter === 'all' || match.statusCategory === statusFilter
    const typePass = typeFilter === 'all' || match.matchType === typeFilter

    return searchPass && statusPass && typePass
  })
}
