import { useLang } from '../../context/LanguageContext'
import ProcessVisual from './ProcessVisual'
import { stages } from '../../content/tracker-guide'
import { StickyScroll } from './GuideEffects'
const fullNames=['Online Assessment','HireVue / Video Interview','Interview','Assessment Centre']
export default function TrackerProcess({standalone=false}:{standalone?:boolean}){
 const Heading=standalone?'h1':'h2'
 const {lang}=useLang(),l=lang==='pt'?1:0
 const t=(en:string,pt:string)=>l?pt:en
 const visual=(active:number)=><ProcessVisual active={active}/>
 return <section className="tk-process tk-section" id="process" aria-labelledby="process-title"><div className="tk-wrap">
 <div className="tk-section-heading"><div><p className="tk-eyebrow">03 / {t('RECRUITMENT','RECRUTAMENTO')}</p><Heading id="process-title">{t('The recruitment process','O processo de recrutamento')}</Heading></div><p>{t('A typical process has four stages: Online Assessment (OA), recorded video interview (often HireVue, HV), Interview (INT) and Assessment Centre (AC). This section explains each one and how to prepare.','O processo de recrutamento costuma incluir quatro etapas: Online Assessment (OA), entrevista em vídeo gravado (frequentemente HireVue, HV), Interview (INT) e Assessment Centre (AC). Aqui explicamos cada uma e como te podes preparar.')}</p></div>
 <p className="tk-process-note">{t('The order and number of stages vary by employer. Begin by checking eligibility and preparing your CV.','A ordem e o número de etapas variam conforme o empregador. Começa por confirmar os requisitos e preparar o CV.')}</p>
 <StickyScroll inlineOnMobile visual={visual} items={stages.map((stage,i)=><article className="tk-stage" id={'stage-'+stage.code.toLowerCase()} key={stage.code}><span className="tk-stage-code">0{i+1} / {stage.code}</span><h3>{fullNames[i]}</h3>{l===1&&<p className="tk-stage-translation">{stage.title[l]}</p>}<p className="tk-stage-summary">{stage.summary[l]}</p><p>{stage.detail[l]}</p><ul>{stage.tips[l].map(tip=><li key={tip}>{tip}</li>)}</ul><p className="tk-stage-avoid"><strong>{t('Keep in mind: ','Atenção: ')}</strong>{stage.avoid[l]}</p><a href={stage.resource} target="_blank" rel="noopener noreferrer">{stage.resourceName} ↗</a></article>)}/>
 <div className="tk-process-after"><strong>{t('After the assessment','Depois da avaliação')}</strong><p>{t('The employer may make an offer, arrange another interview or place you on a reserve list. Read any offer conditions carefully.','O empregador pode apresentar uma oferta, marcar outra entrevista ou colocar-te numa lista de reserva. Lê com atenção as condições de qualquer oferta.')}</p></div>
 </div></section>
}
