import { useCallback, useState } from 'react'
import {
  type Livescore,
  type Match,
  getLivescore,
  getMatches,
  getStandings
} from 'uefa-api'
import { useAsyncInterval } from '../utils/use-async-interval.ts'
import type { DataContextType } from './data-context'

const isMatchSoonLive = (match: Match | Livescore): boolean =>
  (match.status === 'UPCOMING' &&
    match.lineupStatus === 'TACTICAL_AVAILABLE') ||
  match.status === 'LIVE'

export const useUpdateData = () => {
  const [data, setData] = useState<DataContextType | null>(null)

  const updateMatches = useCallback(async () => {
    console.info('Updating data from API', new Date())
    const matches = await getMatches(
      { competitionId: 3, seasonYear: 2024 },
      // @ts-ignore
      'DESC',
      51,
      0
    )
    matches.reverse()
    setData((prev) => ({
      ...prev,
      liveScores: prev?.liveScores || [],
      standings: prev?.standings || [],
      matches
    }))
  }, [])

  const updateLivescores = useCallback(async () => {
    const needsRefresh =
      !data?.liveScores ||
      data.liveScores.length === 0 ||
      data?.liveScores.some(isMatchSoonLive) ||
      data.matches.some(isMatchSoonLive)
    if (!needsRefresh) {
      console.debug('No refresh needed')
      return
    }
    const scores = (await getLivescore()) as unknown as Livescore[]
    setData((prev) => ({
      ...prev,
      matches: prev?.matches || [],
      standings: prev?.standings || [],
      liveScores: scores
    }))
  }, [data?.liveScores, data?.matches])

  const updateStandings = useCallback(async () => {
    console.info('Updating groups data from API', new Date())
    const standings = await getStandings({
      competitionId: 3,
      seasonYear: 2024
    })
    setData((prev) => ({
      ...prev,
      matches: prev?.matches || [],
      liveScores: prev?.liveScores || [],
      standings
    }))
  }, [])

  useAsyncInterval(15 * 60 * 1000, updateMatches) // Update matches every 15 minutes
  useAsyncInterval(120 * 1000, updateLivescores) // Update livescores every 2 minutes if a match is (soon) live
  useAsyncInterval(30 * 60 * 1000, updateStandings) // Update standings every 30 minutes

  return { data }
}
