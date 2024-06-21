import type React from 'react'
import { Fragment } from 'react'
import { useContext, useMemo } from 'react'
import type { Match } from 'uefa-api'
import { DataContext } from '../data/data-context.ts'

export interface MatchDisplayProps {
  match: Match
}

export const MatchDisplay: React.FC<MatchDisplayProps> = ({ match }) => {
  const data = useContext(DataContext)
  const matchingLivescore = useMemo(() => {
    if (!data?.liveScores) {
      return null
    }
    return data.liveScores.find((score) => score.id === match.id) || null
  }, [data?.liveScores, match.id])

  return (
    <div className='flex flex-col items-center justify-center p-4 gap-3 w-96 bg-blue-950 bg-opacity-50 border-2 border-blue-800'>
      <div className='flex items-center justify-center space-x-4 gap-3'>
        <div className={'text-center'}>
          <img
            src={match.homeTeam.logoUrl}
            alt={match.homeTeam.internationalName}
            className={'w-12 h-8 mb-2'}
          />
          <span
            className={`text-xl font-semibold ${match.winner?.match.team?.id === match.homeTeam.id ? 'text-amber-300' : ''}`}
          >
            {match.homeTeam.countryCode}
          </span>
        </div>
        <div className={'text-center'}>
          <span
            className={`text-4xl font-semibold inline-block mx-2 ${matchingLivescore?.status === 'LIVE' ? 'text-emerald-500' : ''} ${match.winner?.match.team?.id === match.homeTeam.id ? 'text-amber-300' : ''}`}
          >
            {matchingLivescore?.score?.total.home ??
              match.score?.total.home ??
              '-'}
          </span>
          <span className='text-4xl font-semibold inline-block mx-2'>:</span>
          <span
            className={`text-4xl font-semibold inline-block mx-2 ${matchingLivescore?.status === 'LIVE' ? 'text-emerald-500' : ''} ${match.winner?.match.team?.id === match.awayTeam.id ? 'text-amber-300' : ''}`}
          >
            {matchingLivescore?.score?.total.away ??
              match.score?.total.away ??
              '-'}
          </span>
          {matchingLivescore?.minute && (
            <Fragment>
              <br />
              <span className='text-2xl font-semibold text-emerald-500'>
                {matchingLivescore.minute.normal}'
                {matchingLivescore.minute.injury
                  ? ` +${matchingLivescore.minute.injury}`
                  : ''}
              </span>
            </Fragment>
          )}
          {matchingLivescore?.status === 'LIVE' &&
            matchingLivescore.translations?.phaseName?.DE && (
              <Fragment>
                <br />
                <span className='font-semibold text-emerald-500'>
                  {matchingLivescore.translations?.phaseName.DE}
                </span>
              </Fragment>
            )}
        </div>
        <div className={'text-center'}>
          <img
            src={match.awayTeam.logoUrl}
            alt={match.awayTeam.internationalName}
            className={'w-12 h-8 mb-2'}
          />
          <span
            className={`text-xl font-semibold ${match.winner?.match.team?.id === match.awayTeam.id ? 'text-amber-300' : ''}`}
          >
            {match.awayTeam.countryCode}
          </span>
        </div>
      </div>
      <span className='text-lg font-semibold'>
        {new Date(
          match.kickOffTime.dateTime ?? match.kickOffTime.date
        ).toLocaleString('de-DE', {
          weekday: 'long',
          month: '2-digit',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
        ,{' '}
        {match.stadium?.city.translations?.name.DE ??
          match.stadium?.translations.specialEventsName.DE ??
          ''}
      </span>
      <span className={'text-lg -mt-4'}>
        {match.group?.translations.name?.DE}
      </span>
    </div>
  )
}
