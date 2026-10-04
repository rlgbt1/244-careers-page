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
function Scroll(){const {pathname,hash}=useLocation();useEffect(()=>{
 if(!hash){window.scrollTo({top:0,behavior:'instant'});return}
 const go=()=>{const el=document.getElementById(hash.slice(1));if(!el)return false;el.scrollIntoView();return true}
 if(go())return
 const observer=new MutationObserver(()=>{if(go())observer.disconnect()});observer.observe(document.body,{childList:true,subtree:true})
 const timeout=setTimeout(()=>observer.disconnect(),5000);return()=>{observer.disconnect();clearTimeout(timeout)}
},[pathname,hash]);return null}
function Missing(){const {lang}=useLang();return <div className="tk-page"><section className="tk-section tk-wrap"><h1>{lang==='pt'?'Página não encontrada':'Page not found'}</h1><Link to="/">{lang==='pt'?'Voltar ao início':'Back to home'} ↗</Link></section></div>}
export default function App(){return <LanguageProvider><Seo/><Scroll/><Navbar/><main id="main-content" tabIndex={-1}><Suspense fallback={<div className="careers-loading" role="status">244 Careers…</div>}><Routes>
 <Route path="/" element={<Home/>}/><Route path="/tracker" element={<Tracker/>}/><Route path="/programmes" element={<Programmes/>}/><Route path="/process" element={<Process/>}/><Route path="/cv-101" element={<Cv/>}/><Route path="/resources" element={<Resources/>}/><Route path="/tracker/opportunities" element={<Navigate to="/tracker" replace/>}/><Route path="*" element={<Missing/>}/>
 </Routes></Suspense></main><Footer/></LanguageProvider>}
