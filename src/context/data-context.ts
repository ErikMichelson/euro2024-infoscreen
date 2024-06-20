import { createContext } from 'react'
import type { Livescore, Match, Standings } from 'uefa-api'

export interface DataContextType {
  matches: Match[]
  liveScores: Livescore[]
  standings: Standings[]
}

export const DataContext = createContext<DataContextType | null>(null)
