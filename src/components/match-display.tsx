import type React from 'react'
import { useMemo } from 'react'
import type { Match } from '../context/data-context.ts'

export interface MatchDisplayProps {
  match: Match
}

export const MatchDisplay: React.FC<MatchDisplayProps> = ({ match }) => {
  const finalResult = useMemo(() => {
    if (match.scores.length === 0) {
      return null
    }
    return match.scores[match.scores.length - 1]
  }, [match.scores])

  const previousResult = useMemo(() => {
    if (match.scores.length < 2) {
      return null
    }
    return match.scores[match.scores.length - 2]
  }, [match.scores])

  return (
    <div className='flex flex-col items-center justify-center p-4 shadow-xl my-5 gap-3'>
      <div className='flex items-center justify-center space-x-4 gap-3'>
        <div>
          {finalResult !== null &&
            match.finished &&
            finalResult.team1 > finalResult.team2 && (
              <div className='text-3xl font-semibold text-amber-500'>⭐</div>
            )}
        </div>
        <div className={'text-center'}>
          <img
            src={match.team1.logoUrl}
            alt={match.team1.name}
            className={'w-12 h-8 mb-2'}
          />
          <span className='text-xl font-semibold'>
            {match.team1.abbreviation}
          </span>
        </div>
        <div>
          {finalResult !== null ? (
            <div>
              <span
                className={`text-4xl font-semibold inline-block mx-2 ${!match.finished ? 'text-emerald-400' : ''}`}
              >
                {finalResult.team1}
              </span>
              <span className='text-4xl font-semibold inline-block mx-2'>
                -
              </span>
              <span
                className={`text-4xl font-semibold inline-block mx-2 ${!match.finished ? 'text-emerald-400' : ''}`}
              >
                {finalResult.team2}
              </span>
            </div>
          ) : (
            <div className='text-4xl font-semibold'>-</div>
          )}
          {previousResult !== null && (
            <div className='text-center'>
              ({previousResult.team1} : {previousResult.team2})
            </div>
          )}
        </div>
        <div className={'text-center'}>
          <img
            src={match.team2.logoUrl}
            alt={match.team2.name}
            className={'w-12 h-8 mb-2'}
          />
          <span className='text-xl font-semibold'>
            {match.team2.abbreviation}
          </span>
        </div>
        <div>
          {finalResult !== null &&
            match.finished &&
            finalResult.team2 > finalResult.team1 && (
              <div className='text-3xl font-semibold text-amber-500'>⭐</div>
            )}
        </div>
      </div>
      <span className='text-lg font-semibold'>
        {match.startDate.toLocaleString('de-DE', {
          weekday: 'long',
          month: '2-digit',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
        , {match.city}
      </span>
      <span className={'text-lg -mt-4'}>{match.group}</span>
    </div>
  )
}
