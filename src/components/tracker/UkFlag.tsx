import { useId } from 'react'
export default function UkFlag() {
 const id=useId()
 return <svg className="tk-uk-flag" role="img" aria-label="United Kingdom" viewBox="0 0 60 30" width="32" height="16"><clipPath id={id}><path d="M0 0h60v30H0z"/></clipPath><g clipPath={`url(#${id})`}><path fill="#012169" d="M0 0h60v30H0z"/><path stroke="#fff" strokeWidth="6" d="m0 0 60 30m0-30L0 30"/><path stroke="#c8102e" strokeWidth="2" d="m0 0 60 30m0-30L0 30"/><path stroke="#fff" strokeWidth="10" d="M30 0v30M0 15h60"/><path stroke="#c8102e" strokeWidth="6" d="M30 0v30M0 15h60"/></g></svg>
}
