// hooks/useYandexMapLoader.ts
import { useEffect, useState } from 'react'

declare global {
  interface Window {
    ymaps?: any
    __ymapsInitialized?: boolean
  }
}

export const useYandexMapLoader = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return // SSR защита

    if (window.__ymapsInitialized) {
      setIsLoaded(true)
      return
    }

    const onLoad = () => {
      window.__ymapsInitialized = true
      setIsLoaded(true)
    }

    const existingScript = document.querySelector(
      'script[src*="api-maps.yandex.ru"]'
    )

    if (!existingScript) {
      const script = document.createElement('script')
      script.src =
        'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=aff49213-486f-46cb-a594-a889fef2df9b'
      script.async = true
      script.onload = () => {
        if (window.ymaps?.ready) {
          window.ymaps.ready(onLoad)
        } else {
          onLoad()
        }
      }
      document.body.appendChild(script)
    } else {
      const check = setInterval(() => {
        if (window.ymaps?.ready) {
          clearInterval(check)
          window.ymaps.ready(onLoad)
        }
      }, 100)
    }
  }, [])

  return { isLoaded }
}