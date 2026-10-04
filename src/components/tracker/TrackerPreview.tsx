import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useLang } from '../../context/LanguageContext'
import { publicOpportunities, areasForOpportunity, groupByEmployer } from '../../utils/tracker'
import OpportunitySheet from './OpportunitySheet'
import AreaFilter from './AreaFilter'
import UkFlag from './UkFlag'

export default function TrackerPreview() {
 const {lang}=useLang();const t=(en:string,pt:string)=>lang==='pt'?pt:en
 const [area,setArea]=useState('all')
 // A cross-sector sample; include all programmes for every featured employer.
 const featured=['Deutsche Bank','Oliver Wyman','Eastdil Secured','Figma','Babcock','Deloitte']
 const eligible=publicOpportunities.filter(r=>area==='all'||areasForOpportunity(r).some(a=>a===area))
 const sample=area==='all'?featured.flatMap(name=>eligible.filter(r=>r.company===name)):groupByEmployer(eligible).slice(0,6).flatMap(g=>g.rows)
 return <section className="tk-preview-section tk-section" id="opportunities" aria-labelledby="tracker-preview-title"><div className="tk-wrap">
 <div className="tk-section-heading"><div><p className="tk-eyebrow"><UkFlag/> 02 / UK OPPORTUNITIES</p><h2 id="tracker-preview-title">{t('Opportunities tracker','Tracker de oportunidades')}</h2></div><p>{t('Compare employers, programmes and application dates across areas. Expand an employer to see its opportunities, or open the full tracker to search.','Compara empresas, programas e datas de candidatura em várias áreas. Expande um empregador para ver as suas oportunidades ou abre o tracker completo para pesquisar.')}</p></div>
 <AreaFilter compact value={area} onChange={setArea}/>
 <div className="tk-sheet-shell tk-directory-preview">
 <div className="tk-preview-caption">{t('Spreadsheet preview','Pré-visualização da tabela')} · {groupByEmployer(sample).length} {t('employers','empregadores')}</div>
 <OpportunitySheet key={area} rows={sample} preview/>
 <div className="tk-preview-bottom"><p>{t('Spring / insight programmes and summer internships across the UK.','Programas spring / insight e estágios de verão no Reino Unido.')}</p><Link className="tk-btn tk-btn-dark" to={'/tracker'+(area==='all'?'':'?area='+area)}>{t('Open full tracker','Abrir tracker completo')} ↗</Link></div>
 </div></div></section>
}
