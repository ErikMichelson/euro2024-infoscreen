import { createContext } from 'react'

export interface Team {
  name: string
  abbreviation: string
  logoUrl: string
}

export interface Scores {
  team1: number
  team2: number
  name: string
}

export interface Goal {
  minute: number
  player: string
  penalty: boolean
  overtime: boolean
  ownGoal: boolean
  scoreTeam1: number
  scoreTeam2: number
}

export interface Match {
  id: number
  startDate: Date
  team1: Team
  team2: Team
  finished: boolean
  scores: Scores[]
  city: string
  goals: Goal[]
  viewers: number
  group: string
}

export interface DataContextType {
  matches: Match[]
}

export const DataContext = createContext<DataContextType | null>(null)
