import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Lang = 'en' | 'pt'

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
}

const LanguageContext = createContext<LangCtx>({ lang: 'en', setLang: () => {} })

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = new URLSearchParams(window.location.search).get('lang') || localStorage.getItem('244-lang')
    return (stored === 'pt' ? 'pt' : 'en') as Lang
  })

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('244-lang', l)
    const url = new URL(window.location.href)
    if (url.searchParams.has('lang')) {
      url.searchParams.set('lang', l)
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
    }
    document.documentElement.lang = l
  }

  useEffect(() => {
    document.documentElement.lang = lang
    localStorage.setItem('244-lang', lang)
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
