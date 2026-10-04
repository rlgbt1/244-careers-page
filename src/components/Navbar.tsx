import {useEffect,useState} from 'react'
import {NavLink,Link,useLocation} from 'react-router-dom'
import {useLang} from '../context/LanguageContext'
export default function Navbar(){
 const {lang,setLang}=useLang(),[open,setOpen]=useState(false),location=useLocation()
 const links=[['/', 'Home','Início'],['/tracker','Tracker','Tracker'],['/programmes','Programmes','Programas'],['/process','Recruitment','Recrutamento'],['/cv-101','CV 101','CV 101'],['/resources','Resources','Recursos']]
 useEffect(()=>{setOpen(false)},[location.key])
 return <header className="careers-header"><a className="skip-link" href="#main-content">{lang==='pt'?'Saltar para o conteúdo':'Skip to content'}</a><nav className="careers-nav" aria-label={lang==='pt'?'Navegação principal':'Main navigation'}>
 <Link to="/" className="careers-brand" aria-label="244 Careers — Home"><img src="/assets/logo.png" width="78" height="78" alt=""/><span>244 <strong>Careers</strong><small>{lang==='pt'?'Uma iniciativa do 244 Club':'An initiative by 244 Club'}</small></span></Link>
 <button className="careers-mobile-toggle" aria-expanded={open} aria-controls="careers-links" onClick={()=>setOpen(v=>!v)}>{open?(lang==='pt'?'Fechar':'Close'):'Menu'} <span aria-hidden="true">{open?'−':'+'}</span></button>
 <div className={'careers-nav-content'+(open?' is-open':'')} id="careers-links" onKeyDown={e=>{if(e.key==='Escape'){setOpen(false);document.querySelector<HTMLButtonElement>('.careers-mobile-toggle')?.focus()}}}><ul>{links.map(([path,en,pt])=><li key={path}><NavLink to={path} end={path==='/'}>{lang==='pt'?pt:en}</NavLink></li>)}</ul>
 <div className="careers-lang" role="group" aria-label={lang==='pt'?'Idioma':'Language'}>{(['pt','en'] as const).map(l=><button key={l} aria-pressed={lang===l} onClick={()=>setLang(l)}>{l.toUpperCase()}</button>)}</div>
 <a className="careers-club-link" href={'https://244club.com/?lang='+lang}>244 Club ↗</a></div>
 </nav></header>
}
