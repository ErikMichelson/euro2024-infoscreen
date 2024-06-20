import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { DataContext } from '../context/data-context.ts'
import { useUpdateData } from '../context/use-update-data.ts'
import { BasePage } from '../layout/base-page.tsx'
import { Groups } from '../pages/groups.tsx'
import { Matches } from '../pages/matches.tsx'

const titles = ['Aktuelle Spiele', 'Gruppen']

export const App: React.FC = () => {
  const [page, setPage] = useState(0)
  const timerRefPages = useRef<number | null>(null)

  const { data } = useUpdateData()

  useEffect(() => {
    const switchPage = () => {
      setPage((current) => (current + 1) % titles.length)
    }
    timerRefPages.current = window.setInterval(switchPage, 15 * 1000)
    return () => {
      if (timerRefPages.current) {
        window.clearInterval(timerRefPages.current)
      }
    }
  }, [])

  return (
    <DataContext.Provider value={data}>
      <BasePage title={titles[page]}>
        {page === 0 && <Matches />}
        {page === 1 && <Groups />}
      </BasePage>
    </DataContext.Provider>
  )
}
