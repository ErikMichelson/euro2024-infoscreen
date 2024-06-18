import type React from 'react'
import { useContext, useMemo } from 'react'
import { MatchDisplay } from '../components/match-display.tsx'
import { DataContext } from '../context/data-context.ts'

const maxUpcomingMatches = 3
const maxFinishedMatches = 3

/**
 * Displays the upcoming and finished matches.
 */
export const Matches: React.FC = () => {
  const dataContext = useContext(DataContext)
  const selectedMatches = useMemo(() => {
    if (!dataContext?.matches) {
      return []
    }
    const matches = []
    const finishedMatches = []
    for (const match of dataContext.matches) {
      if (match.fullTimeAt) {
        finishedMatches.push(match)
        continue
      }
      if (matches.length === maxUpcomingMatches) {
        break
      }
      matches.push(match)
    }
    let addedFinishedMatches = 0
    finishedMatches.reverse()
    for (const match of finishedMatches) {
      if (addedFinishedMatches === maxFinishedMatches) {
        break
      }
      matches.unshift(match)
      addedFinishedMatches++
    }
    return matches
  }, [dataContext?.matches])

  const matchElements = useMemo(() => {
    return selectedMatches.map((match) => (
      <MatchDisplay key={match.id} match={match} />
    ))
  }, [selectedMatches])

  return matchElements
}
