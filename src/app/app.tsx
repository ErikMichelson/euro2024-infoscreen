import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { DataContext, type DataContextType } from '../context/data-context.ts'
import { BasePage } from '../layout/base-page.tsx'
import { Groups } from '../pages/groups.tsx'
import { Matches } from '../pages/matches.tsx'
import { parseMatchesApiResponse } from './parse-matches-api-response.ts'

// const maxPage = 2
const apiUrl = 'https://api.openligadb.de/getmatchdata/em/2024'
const titles = ['Aktuelle Spiele', 'Gruppen']

export const App: React.FC = () => {
  const [page] = useState(0)
  const [data, setData] = useState<DataContextType | null>(null)
  const [matchRunning, setMatchRunning] = useState(false)
  // const timerRefPages = useRef<number | null>(null)
  const timerRefRefresh = useRef<number | null>(null)
  const timerRefMatchRunning = useRef<number | null>(null)

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
      console.info('Updating data from API')
      const response = await fetch(apiUrl)
      const data = await response.json()
      if (response.ok) {
        setData({
          matches: parseMatchesApiResponse(data)
        })
      }
    }
    fetchData().catch(console.error)
    timerRefRefresh.current = window.setInterval(
      async () => {
        fetchData().catch(console.error)
      },
      matchRunning ? 3 * 60 * 1000 : 120 * 60 * 1000
    )
    return () => {
      if (timerRefRefresh.current) {
        window.clearInterval(timerRefRefresh.current)
      }
    }
  }, [matchRunning])

  useEffect(() => {
    const checkIfMatchRunning = () => {
      if (!data) {
        return
      }
      const now = new Date()
      const matchRunning = data.matches.some((match) => {
        return (
          match.startDate < now &&
          !match.finished &&
          now.getTime() < match.startDate.getTime() + 105 * 60 * 1000
        )
      })
      console.debug('Match running:', matchRunning)
      setMatchRunning(matchRunning)
    }
    checkIfMatchRunning()
    timerRefMatchRunning.current = window.setInterval(
      checkIfMatchRunning,
      60 * 1000
    )
    return () => {
      if (timerRefMatchRunning.current) {
        window.clearInterval(timerRefMatchRunning.current)
      }
    }
  }, [data])

  return (
    <DataContext.Provider value={data}>
      <BasePage title={titles[page]}>
        {page === 0 && <Matches />}
        {page === 1 && <Groups />}
      </BasePage>
    </DataContext.Provider>
  )
}
