import type { Match } from '../context/data-context.ts'

interface MatchTeamApiResponse {
  teamID: number
  teamName: string
  shortName: string
  teamIconUrl: string
  teamGroupName: string
}

export type MatchesApiResponse = {
  matchID: number
  matchDateTime: string
  timeZoneID: string
  leagueId: number
  leagueName: string
  leagueSeason: string
  leagueShortcut: string
  matchDateTimeUTC: string
  lastUpdateDateTime: string
  matchIsFinished: boolean
  numberOfViewers: number
  location: {
    locationID: number
    locationCity: string
    locationStadium: string
  }
  goals: {
    goalID: number
    scoreTeam1: number
    scoreTeam2: number
    matchMinute: number
    goalGetterID: number
    goalGetterName: string
    isPenalty: boolean
    isOwnGoal: boolean
    isOvertime: boolean
    comment: string
  }[]
  matchResults: {
    resultID: number
    resultName: string
    pointsTeam1: number
    pointsTeam2: number
    resultOrderID: number
    resultTypeID: number
    resultDescription: string
  }[]
  group: {
    groupID: number
    groupName: string
    groupOrderID: number
  }
  team1: MatchTeamApiResponse
  team2: MatchTeamApiResponse
}[]

export const parseMatchesApiResponse = (data: MatchesApiResponse): Match[] => {
  const transformed = data.map((apiMatch) => ({
    id: apiMatch.matchID,
    city: apiMatch.location.locationCity,
    startDate: new Date(apiMatch.matchDateTime),
    group: apiMatch.group.groupName,
    viewers: apiMatch.numberOfViewers,
    finished: apiMatch.matchIsFinished,
    team1: {
      name: apiMatch.team1.teamName,
      abbreviation: apiMatch.team1.shortName,
      logoUrl: apiMatch.team1.teamIconUrl
    },
    team2: {
      name: apiMatch.team2.teamName,
      abbreviation: apiMatch.team2.shortName,
      logoUrl: apiMatch.team2.teamIconUrl
    },
    scores: apiMatch.matchResults.map((result) => ({
      name: result.resultName,
      team1: result.pointsTeam1,
      team2: result.pointsTeam2
    })),
    goals: apiMatch.goals.map((goal) => ({
      minute: goal.matchMinute,
      player: goal.goalGetterName,
      penalty: goal.isPenalty,
      overtime: goal.isOvertime,
      ownGoal: goal.isOwnGoal,
      scoreTeam1: goal.scoreTeam1,
      scoreTeam2: goal.scoreTeam2
    }))
  }))
  transformed.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
  return transformed
}
