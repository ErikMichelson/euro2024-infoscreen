import { useEffect, useRef } from 'react'

export const useAsyncInterval = (
  interval: number,
  fn: () => Promise<void>,
  initialRun = true
) => {
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (initialRun) {
      fn().catch(console.error)
    }
    timerRef.current = window.setInterval(() => {
      fn().catch(console.error)
    }, interval)
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current)
      }
    }
  }, [interval, fn, initialRun])
}
