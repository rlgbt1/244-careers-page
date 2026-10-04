import { Fragment, useState, useId } from 'react'
import { useLang } from '../../context/LanguageContext'
import { type Opportunity, dateLabel, isoDate, publicLocationOptions, safeExternal, availability, londonToday, groupByEmployer, opportunityAreas, areasForOpportunity } from '../../utils/tracker'

export default function OpportunitySheet({ rows, preview = false }: { rows: Opportunity[]; preview?: boolean }) {
 const { lang } = useLang()
 const t=(en:string,pt:string)=>lang==='pt'?pt:en
 const [expanded,setExpanded]=useState<string|null>(null)
 const [openEmployers,setOpenEmployers]=useState<Set<string>>(()=>new Set())
 const prefix=useId()
 const groups=groupByEmployer(rows)
 const toggleEmployer=(company:string)=>setOpenEmployers(previous=>{const next=new Set(previous);if(next.has(company))next.delete(company);else next.add(company);return next})
 const today=londonToday()
 const display=(v:string)=>/not specified|not published|unspecified/i.test(v)?'—':v
 const statusLabel=(r:Opportunity)=>{const state=availability(r,today);return state==='closed'?t('Closed','Encerrado'):state==='soon'||state==='upcoming'?t('Opens later','Abre em breve'):t('See employer','Ver empregador')}
 const programmeRow=(row:Opportunity,index:number,grouped=false)=><Fragment key={row.id}><tr className={(grouped?'tk-programme-child ':'')+(expanded===row.id?'is-expanded':'')}>
 <td className="tk-row-number">{grouped?'↳':index+1}</td><th scope="row">{grouped?<span className="sr-only">{row.company}</span>:row.company}</th><td><a href={safeExternal(row.url)} target="_blank" rel="noopener noreferrer">{row.programme} <span aria-hidden="true">↗</span></a></td><td>{publicLocationOptions(row).join(', ')||'—'}</td><td className={isoDate(row.opens)?'tk-date-cell':''}>{isoDate(row.opens)?dateLabel(row.opens,lang):'—'}</td><td className={isoDate(row.closes)?'tk-date-cell':''}>{isoDate(row.closes)?dateLabel(row.closes,lang):row.rolling?t('Rolling','Contínuo'):'—'}</td><td><span className={'tk-sheet-status '+availability(row,today)}>{statusLabel(row)}</span></td>
 {!preview&&<td><button className="tk-sheet-expand" aria-expanded={expanded===row.id} aria-controls={prefix+'-details-'+row.id} aria-label={t('Details: ','Detalhes: ')+row.company+' '+row.programme} onClick={()=>setExpanded(expanded===row.id?null:row.id)}>{expanded===row.id?'−':'+'}</button></td>}</tr>
 {!preview&&expanded===row.id&&<tr id={prefix+'-details-'+row.id} className="tk-sheet-detail"><td colSpan={8}><div className="tk-sheet-detail-grid"><div><h3>{row.programme}</h3><p>{lang==='pt'&&row.eligibilityPt?row.eligibilityPt:/not specified/i.test(row.eligibility)?t('See the employer’s page for eligibility and application requirements.','Consulta os critérios de elegibilidade e candidatura na página do empregador.'):row.eligibility}</p><a href={safeExternal(row.url)} target="_blank" rel="noopener noreferrer">{t('Programme website','Página do programa')} ↗</a></div><dl><div><dt>{t('Area','Área')}</dt><dd>{row.sector}</dd></div><div><dt>{t('Cover letter','Carta de apresentação')}</dt><dd>{row.coverLetter==='Required'?t('Required','Obrigatória'):row.coverLetter==='Not required'?t('Not required','Não exigida'):row.coverLetter==='Optional'?t('Optional','Opcional'):t('Check employer','Consulta o empregador')}</dd></div><div><dt>{t('Process','Processo')}</dt><dd>{display(row.process)} · <a href="/process">{t('Stage guide','Guia das etapas')}</a></dd></div><div><dt>{t('Checked','Consultado em')}</dt><dd>{dateLabel(row.checked,lang)}</dd></div></dl></div><p className="tk-sheet-disclaimer">{t('Confirm eligibility, availability and any visa requirements with the employer before applying.','Confirma a elegibilidade, disponibilidade e eventuais requisitos de visto junto do empregador antes de te candidatares.')}</p></td></tr>}
 </Fragment>
 return <div className="tk-sheet-scroll" role="region" tabIndex={0} aria-label={t('Opportunities spreadsheet. Scroll sideways to see all columns.','Tabela de oportunidades. Desliza para os lados para ver todas as colunas.')}>
 <table className="tk-sheet"><caption className="sr-only">{t('UK internship and insight opportunities','Oportunidades de estágios e insights no Reino Unido')}</caption><thead><tr>
 <th scope="col" className="tk-row-number">#</th><th scope="col">{t('Company','Empresa')}</th><th scope="col">{t('Programme','Programa')}</th><th scope="col">{t('Location','Localização')}</th><th scope="col">{t('Opens','Abertura')}</th><th scope="col">{t('Closes','Fecho')}</th><th scope="col">{t('Availability','Disponibilidade')}</th>{!preview&&<th scope="col">{t('Details','Detalhes')}</th>}
 </tr></thead>
 {groups.map((group,index)=>{
  const multiple=group.rows.length>1
  const open=openEmployers.has(group.company)
  const groupId=prefix+'-employer-'+group.rows[0].id
  const areaIds=new Set(group.rows.flatMap(areasForOpportunity))
  return <Fragment key={group.company}>
   {multiple?<><tbody><tr className={'tk-employer-row'+(open?' is-open':'')}>
    <td className="tk-row-number">{index+1}</td>
    <th scope="row"><button className="tk-employer-toggle" onClick={()=>toggleEmployer(group.company)} aria-expanded={open} aria-controls={groupId}><span aria-hidden="true">{open?'−':'+'}</span>{group.company}</button></th>
    <td colSpan={preview?5:6}><div className="tk-employer-summary"><div><strong>{group.rows.length} {t('programmes','programas')}</strong><span>{opportunityAreas.filter(a=>areaIds.has(a.id)).map(a=>a[lang]).join(' · ')}</span></div><button className="tk-employer-action" onClick={()=>toggleEmployer(group.company)} aria-expanded={open} aria-controls={groupId} aria-label={(open?t('Collapse ','Recolher '):t('Expand ','Expandir '))+group.company}>{open?t('Collapse','Recolher'):t('View programmes','Ver programas')} <span aria-hidden="true">{open?'−':'+'}</span></button></div></td>
   </tr></tbody><tbody id={groupId} hidden={!open}>{open&&group.rows.map(row=>programmeRow(row,index,true))}</tbody></>:<tbody>{programmeRow(group.rows[0],index)}</tbody>}
  </Fragment>
 })}
 </table></div>
}
