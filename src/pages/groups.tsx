import type React from 'react'
import { useContext, useMemo } from 'react'
import { DataContext } from '../data/data-context.ts'

export const Groups: React.FC = () => {
  const data = useContext(DataContext)

  const groupBoxes = useMemo(() => {
    const sorted = [...(data?.standings ?? [])]
    sorted.sort((a, b) =>
      a.group.metaData.groupShortName.localeCompare(
        b.group.metaData.groupShortName
      )
    )
    return sorted.map((group) => (
      <div
        className={
          'border-2 border-blue-800 bg-blue-950 bg-opacity-50 pt-3 pb-1.5 px-1.5 w-80'
        }
        key={group.group.id}
      >
        <h2 className={'text-2xl text-center mb-3'}>
          {group.group.translations.name.DE ?? group.group.metaData.groupName}
        </h2>
        <table
          className={
            'table-auto border-collapse border border-slate-500 w-full text-center'
          }
        >
          <thead>
            <tr
              className={
                'text-xl font-semibold text-center border border-slate-500'
              }
            >
              <th className={'border border-slate-500'}>#</th>
              <th />
              <th className={'text-left border-slate-500 border-r'}>Team</th>
              <th>S</th>
              <th>U</th>
              <th>N</th>
              <th className={'border-l border-r border-slate-500'}>T</th>
              <th>G</th>
            </tr>
          </thead>
          <tbody>
            {group.items.map((team) => (
              <tr key={team.team.id} className={'border border-slate-500'}>
                <td className={'font-semibold p-2'}>{team.rank}</td>
                <td className={'pl-2'}>
                  <img
                    src={team.team.logoUrl}
                    alt={team.team.internationalName}
                    height={16}
                    className={'h-5'}
                  />
                </td>
                <td
                  className={`text-left ${team.qualified ? 'text-amber-300' : ''}`}
                >
                  {team.team.translations.countryName?.DE ??
                    team.team.internationalName}
                </td>
                <td className={'font-semibold border-slate-600 border-l'}>
                  {team.won}
                </td>
                <td>{team.drawn}</td>
                <td>{team.lost}</td>
                <td className={'border-l border-r border-slate-600'}>
                  {team.goalsFor} : {team.goalsAgainst}
                </td>
                <td className={'border-l border-slate-600 italic'}>
                  {team.played}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))
  }, [data?.standings])

  return (
    <div className={'flex flex-row flex-wrap gap-4 justify-center'}>
      {groupBoxes}
    </div>
  )
}
