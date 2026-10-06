import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLang } from '../../context/LanguageContext'
import { publicOpportunities, publicLocationOptions, programmeKind, availability, londonToday, isoDate, opportunityAreas, areasForOpportunity, groupByEmployer } from '../../utils/tracker'
import OpportunitySheet from './OpportunitySheet'
import AreaFilter from './AreaFilter'
import { useLondonToday } from '../../hooks/useLondonToday'

export default function TrackerDirectory() {
 const {lang}=useLang();const t=(en:string,pt:string)=>lang==='pt'?pt:en
 const [params,setParams]=useSearchParams()
 const [expanded,setExpanded]=useState(false)
 const sheetRef=useRef<HTMLDivElement>(null)
 const expandButton=useRef<HTMLButtonElement>(null)
 const previousFocus=useRef<HTMLElement|null>(null)
 function closeExpanded(){
  if(document.fullscreenElement===sheetRef.current)void document.exitFullscreen().catch(()=>{})
  setExpanded(false)
 }
 function toggleExpanded(){
  if(expanded){closeExpanded();return}
  previousFocus.current=document.activeElement as HTMLElement
  setExpanded(true)
  if(sheetRef.current?.requestFullscreen)void sheetRef.current.requestFullscreen().catch(()=>{})
 }
 useEffect(()=>{
  if(!expanded)return
  const shell=sheetRef.current!
  const overflow=document.body.style.overflow
  document.body.style.overflow='hidden'
  const siblings:{el:HTMLElement;inert:boolean}[]=[]
  let branch:HTMLElement=shell
  while(branch.parentElement){
   for(const el of Array.from(branch.parentElement.children)){
    if(el!==branch&&el instanceof HTMLElement&&!['SCRIPT','STYLE','LINK'].includes(el.tagName)){
     siblings.push({el,inert:el.inert});el.inert=true
    }
   }
   branch=branch.parentElement
  }
  expandButton.current?.focus()
  const onFullScreen=()=>{if(!document.fullscreenElement)setExpanded(false)}
  const onKey=(e:KeyboardEvent)=>{
   if(e.key==='Escape'){e.preventDefault();closeExpanded()}
   if(e.key==='Tab'){
    const targets=Array.from(shell.querySelectorAll<HTMLElement>('a[href],button:not(:disabled),select:not(:disabled),input:not(:disabled),[tabindex="0"]')).filter(el=>el.getClientRects().length)
    const first=targets[0],last=targets[targets.length-1]
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}
   }
  }
  document.addEventListener('fullscreenchange',onFullScreen)
  document.addEventListener('keydown',onKey)
  return ()=>{
   document.body.style.overflow=overflow
   siblings.forEach(({el,inert})=>{el.inert=inert})
   document.removeEventListener('fullscreenchange',onFullScreen)
   document.removeEventListener('keydown',onKey)
   if(document.fullscreenElement===shell)void document.exitFullscreen().catch(()=>{})
   previousFocus.current?.focus({preventScroll:true})
  }
 },[expanded])
 const area=opportunityAreas.some(a=>a.id===params.get('area'))?params.get('area')!:'all'
 const [query,setQuery]=useState(''),[kind,setKind]=useState('all'),[city,setCity]=useState('all'),[state,setState]=useState('all'),[cover,setCover]=useState('all'),[sort,setSort]=useState('company'),[limit,setLimit]=useState(30)
 const today=useLondonToday()
 const kinds={summer:t('Summer internships','Estágios de verão'),spring:t('Spring / Insight','Spring / Insight'),other:t('Other internships','Outros estágios'),graduate:t('Graduate programmes','Programas de graduados')}
 const stateLabels={listed:t('See employer','Ver empregador'),closed:t('Closed','Encerrado'),soon:t('Opening soon','Abre em breve'),upcoming:t('Opening later','Abertura futura'),review:''}
 const dataset=useMemo(()=>publicOpportunities.filter(r=>area==='all'||areasForOpportunity(r).some(a=>a===area)),[area])
 // Keep options stable across areas so an active selection never disappears.
 const locations=[...new Set(publicOpportunities.flatMap(publicLocationOptions))].sort()
 const types=[...new Set(publicOpportunities.map(programmeKind))]
 const states=[...new Set(publicOpportunities.map(r=>availability(r,today)))].filter(s=>s!=='review')
 const covers=[...new Set(publicOpportunities.map(r=>r.coverLetter))].filter(s=>['Required','Not required','Optional'].includes(s))
 const results=useMemo(()=>dataset.filter(r=>(!query||[r.company,r.programme,r.sector,r.location].join(' ').toLowerCase().includes(query.trim().toLowerCase()))&&(kind==='all'||programmeKind(r)===kind)&&(city==='all'||publicLocationOptions(r).includes(city))&&(state==='all'||availability(r,today)===state)&&(cover==='all'||r.coverLetter===cover)).sort((a,b)=>sort==='deadline'?(isoDate(a.closes)||'9999').localeCompare(isoDate(b.closes)||'9999')||a.company.localeCompare(b.company):a.company.localeCompare(b.company)||a.programme.localeCompare(b.programme)),[dataset,query,kind,city,state,cover,sort,today])
 const groups=groupByEmployer(results)
 const visible=groups.slice(0,limit).flatMap(g=>g.rows)
 function reset(){setParams(params.get('lang')?{lang:params.get('lang')!}:{},{replace:true});setQuery('');setKind('all');setCity('all');setState('all');setCover('all');setSort('company');setLimit(30)}
 function changeArea(value:string){
  const next=new URLSearchParams(params);if(value==='all')next.delete('area');else next.set('area',value);setParams(next)
  setLimit(30)
 }
 return <section className="tk-directory tk-sheet-directory" id="opportunities" aria-label={t('UK opportunities tracker','Tracker de oportunidades no Reino Unido')}><div className="tk-wrap">
 <AreaFilter value={area} onChange={changeArea}/>
 <p className="tk-scope-note"><Link to="/programmes">{t('Which programme is right for me?','Qual é o programa para mim?')} ↗</Link></p>
 <div className="tk-sheet-controls tk-unified-controls">
 <label className="tk-sheet-search">{t('Search','Pesquisar')}<input value={query} onChange={e=>{setQuery(e.target.value);setLimit(30)}} placeholder={t('Company or programme…','Empresa ou programa…')}/></label>
 <label>{t('Programme','Programa')}<select value={kind} onChange={e=>{setKind(e.target.value);setLimit(30)}}><option value="all">{t('All programmes','Todos os programas')}</option>{types.map(k=><option key={k} value={k}>{kinds[k]}</option>)}</select></label>
 <label>{t('City / town','Cidade / localidade')}<select value={city} onChange={e=>{setCity(e.target.value);setLimit(30)}}><option value="all">{t('All locations','Todas as localizações')}</option>{locations.map(c=><option key={c}>{c}</option>)}</select></label>
 <label>{t('Availability','Disponibilidade')}<select value={state} onChange={e=>{setState(e.target.value);setLimit(30)}}><option value="all">{t('All','Todas')}</option>{states.map(s=><option key={s} value={s}>{stateLabels[s]}</option>)}</select></label>
 <label>{t('Cover letter','Carta de apresentação')}<select value={cover} onChange={e=>{setCover(e.target.value);setLimit(30)}}><option value="all">{t('All','Todas')}</option>{covers.map(c=><option key={c} value={c}>{c==='Required'?t('Required','Obrigatória'):c==='Not required'?t('Not required','Não exigida'):t('Optional','Opcional')}</option>)}</select></label>
 </div>
 <div ref={sheetRef} className={'tk-sheet-shell tk-sheet-compact'+(expanded?' tk-sheet-fullscreen':'')} role={expanded?'dialog':undefined} aria-modal={expanded?true:undefined} aria-label={expanded?t('Opportunities spreadsheet','Folha de oportunidades'):undefined}><div className="tk-sheet-toolbar"><p role="status" aria-live="polite"><strong>{results.length}</strong> {t('programmes','programas')} · {groups.length} {t('employers','empregadores')}</p><div><label className="sr-only" htmlFor="tk-sort">{t('Sort','Ordenar')}</label><select id="tk-sort" value={sort} onChange={e=>{setSort(e.target.value);setLimit(30)}}><option value="company">{t('Company A–Z','Empresa A–Z')}</option><option value="deadline">{t('Earliest closing date','Primeira data de fecho')}</option></select><button onClick={reset}>{t('Clear filters','Limpar filtros')}</button><button ref={expandButton} className="tk-fullscreen-toggle" onClick={toggleExpanded} aria-expanded={expanded}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d={expanded?'M8 3v5H3m18 0h-5V3M3 16h5v5m8 0v-5h5':'M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5'}/></svg>{expanded?t('Close full screen','Fechar ecrã inteiro'):t('Full screen','Ecrã inteiro')}</button></div></div>
 <p className="tk-sheet-hint">{t('Expand an employer to compare its programmes. Dates are listed for each opportunity.','Expande um empregador para comparar os seus programas. As datas estão indicadas em cada oportunidade.')}</p>
 <OpportunitySheet key={[area,query,kind,city,state,cover].join('|')} rows={visible} compact/>
 {!results.length&&<div className="tk-no-results"><h3>{t('No matching opportunities','Nenhuma oportunidade encontrada')}</h3><p>{t('Try another company, city or programme type.','Experimenta outra empresa, cidade ou tipo de programa.')}</p><button className="tk-btn tk-btn-dark" onClick={reset}>{t('Clear filters','Limpar filtros')}</button></div>}
 <div className="tk-sheet-footer"><p>{t('Showing','A mostrar')} {Math.min(limit,groups.length)} / {groups.length} {t('employers','empregadores')}</p>{limit<groups.length&&<button onClick={()=>setLimit(n=>n+30)}>{t('Show 30 more employers','Mostrar mais 30 empregadores')} ↓</button>}</div></div>
 <p className="tk-public-note">{t('Dates and availability can change. “Rolling” means applications may close once places are filled. A dash means the employer has not published that detail. Always check the programme website.','As datas e a disponibilidade podem mudar. “Contínuo” significa que as candidaturas podem encerrar quando as vagas forem preenchidas. Um traço indica um detalhe não publicado. Confirma sempre na página do programa.')}</p>
 </div></section>
}
