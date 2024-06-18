import { createContext } from 'react'
import type { Livescore, Match } from 'uefa-api'

export interface DataContextType {
  matches: Match[]
  liveScores: Livescore[]
}

export const DataContext = createContext<DataContextType | null>(null)
