import { useEffect, useState } from 'react'
import { londonToday } from '../utils/tracker'

/** Refresh after London midnight and when returning to a suspended tab. */
export function useLondonToday() {
  const [today, setToday] = useState(londonToday)
  useEffect(() => {
    const refresh = () => setToday(londonToday())
    const timer = window.setInterval(refresh, 30_000)
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    refresh()
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])
  return today
}
