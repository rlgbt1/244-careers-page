import {lazy,Suspense,useEffect} from 'react'
import {Routes,Route,Link,Navigate,useLocation} from 'react-router-dom'
import {LanguageProvider,useLang} from './context/LanguageContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Seo from './components/Seo'
const Home=lazy(()=>import('./pages/HomePage'))
const Tracker=lazy(()=>import('./pages/OpportunitiesPage'))
const Programmes=lazy(()=>import('./pages/ProgrammesPage'))
const Process=lazy(()=>import('./pages/ProcessPage'))
const Cv=lazy(()=>import('./pages/CvPage'))
const Resources=lazy(()=>import('./pages/ResourcesPage'))
function Scroll(){const {pathname,hash,key}=useLocation();useEffect(()=>{
 if(!hash){window.scrollTo({top:0,behavior:'instant'});return}
 let stopped=false
 const go=()=>{if(stopped)return;document.getElementById(hash.slice(1))?.scrollIntoView({behavior:'instant'})}
 // Lazy document readers can change the height above an anchor after navigation.
 const changes=new MutationObserver(go),sizes=new ResizeObserver(go)
 changes.observe(document.body,{childList:true,subtree:true})
 const main=document.getElementById('main-content');if(main)sizes.observe(main)
 const stop=()=>{stopped=true;changes.disconnect();sizes.disconnect()}
 const events=['wheel','touchstart','pointerdown','keydown'] as const
 events.forEach(event=>window.addEventListener(event,stop,{passive:true}))
 go()
 const timeout=setTimeout(stop,5000)
 return()=>{stop();clearTimeout(timeout);events.forEach(event=>window.removeEventListener(event,stop))}
},[pathname,hash,key]);return null}
function Missing(){const {lang}=useLang();return <div className="tk-page"><section className="tk-section tk-wrap"><h1>{lang==='pt'?'Página não encontrada':'Page not found'}</h1><Link to="/">{lang==='pt'?'Voltar ao início':'Back to home'} ↗</Link></section></div>}
export default function App(){return <LanguageProvider><Seo/><Scroll/><Navbar/><main id="main-content" tabIndex={-1}><Suspense fallback={<div className="careers-loading" role="status">244 Careers…</div>}><Routes>
 <Route path="/" element={<Home/>}/><Route path="/tracker" element={<Tracker/>}/><Route path="/programmes" element={<Programmes/>}/><Route path="/process" element={<Process/>}/><Route path="/cv-101" element={<Cv/>}/><Route path="/resources" element={<Resources/>}/><Route path="/tracker/opportunities" element={<Navigate to="/tracker" replace/>}/><Route path="*" element={<Missing/>}/>
 </Routes></Suspense></main><Footer/></LanguageProvider>}
