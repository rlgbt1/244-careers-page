import {useEffect,useRef,useState} from 'react'
import {NavLink,Link,useLocation} from 'react-router-dom'
import {useLang} from '../context/LanguageContext'
import '../styles/cv-navigation.css'
export default function Navbar(){
 const {lang,setLang}=useLang(),[open,setOpen]=useState(false),[cvOpen,setCvOpen]=useState(false),location=useLocation()
 const cv=useRef<HTMLLIElement>(null),cvButton=useRef<HTMLButtonElement>(null)
 const links=[['/', 'Home','Início'],['/tracker','Tracker','Tracker'],['/programmes','Programmes','Programas'],['/process','Recruitment','Recrutamento'],['/cv-101','CV 101','CV 101'],['/resources','Resources','Recursos']]
 useEffect(()=>{setOpen(false);setCvOpen(false)},[location.key])
 useEffect(()=>{
  if(!cvOpen)return
  const close=(event:PointerEvent)=>{if(!cv.current?.contains(event.target as Node))setCvOpen(false)}
  document.addEventListener('pointerdown',close)
  return()=>document.removeEventListener('pointerdown',close)
 },[cvOpen])
 return <header className="careers-header"><a className="skip-link" href="#main-content">{lang==='pt'?'Saltar para o conteúdo':'Skip to content'}</a><nav className="careers-nav" aria-label={lang==='pt'?'Navegação principal':'Main navigation'}>
 <Link to="/" className="careers-brand" aria-label={lang==='pt'?'244 Careers — Início':'244 Careers — Home'}><img src="/assets/logo.png" width="78" height="78" alt=""/><span>244 <strong>Careers</strong><small>{lang==='pt'?'Uma iniciativa do 244 Club':'An initiative by 244 Club'}</small></span></Link>
 <button className="careers-mobile-toggle" aria-expanded={open} aria-controls="careers-links" onClick={()=>{setOpen(v=>!v);setCvOpen(false)}}>{open?(lang==='pt'?'Fechar':'Close'):'Menu'} <span aria-hidden="true">{open?'−':'+'}</span></button>
 <div className={'careers-nav-content'+(open?' is-open':'')} id="careers-links" onKeyDown={e=>{if(e.key==='Escape'){setOpen(false);document.querySelector<HTMLButtonElement>('.careers-mobile-toggle')?.focus()}}}><ul>{links.map(([path,en,pt])=>path==='/cv-101'?<li key={path} ref={cv} className="careers-cv-nav" onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setCvOpen(false)}} onKeyDown={e=>{if(e.key==='Escape'&&cvOpen){e.stopPropagation();setCvOpen(false);cvButton.current?.focus()}}}>
 <button ref={cvButton} className={'careers-cv-toggle'+(location.pathname===path?' is-active':'')} aria-expanded={cvOpen} aria-controls="careers-cv-links" onClick={()=>setCvOpen(v=>!v)}>CV 101 <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5"/></svg></button>
 <ul id="careers-cv-links" className="careers-cv-links" hidden={!cvOpen}><li><Link to="/cv-101#cv-guide" onClick={()=>{setCvOpen(false);setOpen(false)}}>CV 101</Link></li><li><Link to="/cv-101#cv-templates" onClick={()=>{setCvOpen(false);setOpen(false)}}>{lang==='pt'?'Modelos de CV':'CV Templates'}</Link></li></ul>
 </li>:<li key={path}><NavLink to={path} end={path==='/'}>{lang==='pt'?pt:en}</NavLink></li>)}</ul>
 <div className="careers-lang" role="group" aria-label={lang==='pt'?'Idioma':'Language'}>{(['pt','en'] as const).map(l=><button key={l} aria-pressed={lang===l} onClick={()=>setLang(l)}>{l.toUpperCase()}</button>)}</div>
 <a className="careers-club-link" href={'https://244club.com/?lang='+lang}>244 Club ↗</a></div>
 </nav></header>
}
