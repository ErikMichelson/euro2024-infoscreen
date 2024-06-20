import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { type Livescore, getLivescore, getMatches } from 'uefa-api'
import { DataContext, type DataContextType } from '../context/data-context.ts'
import { BasePage } from '../layout/base-page.tsx'
import { Groups } from '../pages/groups.tsx'
import { Matches } from '../pages/matches.tsx'

const titles = ['Aktuelle Spiele', 'Gruppen']

export const App: React.FC = () => {
  const [page] = useState(0)
  const [data, setData] = useState<DataContextType | null>(null)
  // const timerRefPages = useRef<number | null>(null)
  const timerRefRefresh = useRef<number | null>(null)
  const timerRefLivescores = useRef<number | null>(null)

  // useEffect(() => {
  //   const switchPage = () => {
  //     setPage((current) => (current + 1) % maxPage)
  //   }
  //   timerRefPages.current = window.setInterval(switchPage, 15000)
  //   return () => {
  //     if (timerRefPages.current) {
  //       window.clearInterval(timerRefPages.current)
  //     }
  //   }
  // }, [])

  useEffect(() => {
    const fetchData = async () => {
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
        matches,
        liveScores: prev?.liveScores || []
      }))
    }
    fetchData().catch(console.error)
    timerRefRefresh.current = window.setInterval(
      async () => {
        fetchData().catch(console.error)
      },
      15 * 60 * 1000
    )
    return () => {
      if (timerRefRefresh.current) {
        window.clearInterval(timerRefRefresh.current)
      }
    }
  }, [])

  useEffect(() => {
    const fetchLivescores = async () => {
      const needsRefresh =
        !data?.liveScores ||
        data.liveScores.length === 0 ||
        data?.liveScores.some(
          (match) =>
            (match.status === 'UPCOMING' &&
              match.lineupStatus === 'TACTICAL_AVAILABLE') ||
            match.status === 'LIVE'
        )
      if (!needsRefresh) {
        console.debug('No refresh needed')
        return
      }
      const scores = (await getLivescore()) as unknown as Livescore[]
      setData((prev) => ({
        ...prev,
        matches: prev?.matches || [],
        liveScores: scores
      }))
    }
    fetchLivescores().catch(console.error)
    timerRefLivescores.current = window.setInterval(fetchLivescores, 120 * 1000)
    return () => {
      if (timerRefLivescores.current) {
        window.clearInterval(timerRefLivescores.current)
      }
    }
  }, [data?.liveScores])

  return (
    <DataContext.Provider value={data}>
      <BasePage title={titles[page]}>
        {page === 0 && <Matches />}
        {page === 1 && <Groups />}
      </BasePage>
    </DataContext.Provider>
  )
}
