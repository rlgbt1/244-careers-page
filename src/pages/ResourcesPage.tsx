import {useState} from 'react'
import {useLang} from '../context/LanguageContext'
import {resources} from '../content/tracker-guide'
export default function ResourcesPage(){
 const {lang}=useLang(),l=lang==='pt'?1:0,t=(en:string,pt:string)=>l?pt:en
 const [resourceStage,setResourceStage]=useState('All')
 return <div className="tk-page careers-resources">
     <section className="tk-resources tk-section" id="preparation" aria-labelledby="resources-title"><div className="tk-wrap"><div className="tk-section-heading"><div><p className="tk-eyebrow">04 / {t('BUILD YOUR CONFIDENCE', 'GANHA CONFIANÇA')}</p><h1 id="resources-title">{t('Preparation resources','Recursos de preparação')}</h1></div><p>{t('Useful guides, practice and videos. Start with the stage in front of you. Most resources are in English.', 'Guias, prática e vídeos úteis. Começa pela etapa que tens pela frente. A maioria dos recursos está em inglês.')}</p></div><div className="tk-resource-filters" role="group" aria-label={t('Resource stage', 'Etapa dos recursos')}>{['All','CV','OA','HV','INT','AC','Eligibility'].map(s=><button key={s} aria-pressed={resourceStage===s} onClick={()=>setResourceStage(s)}>{s==='All'?t('All resources','Todos'):s==='Eligibility'?t('Eligibility','Elegibilidade'):s}</button>)}</div><div className="tk-resource-grid">{resources.filter(r=>resourceStage==='All'||r.stage===resourceStage).map(r=><a className="tk-resource" href={r.url} target="_blank" rel="noopener noreferrer" key={r.url}><div className="tk-resource-top"><span>{r.stage}</span><span aria-hidden="true">↗</span></div><p className="tk-resource-provider">{r.provider}</p><h3>{r.title[l]}</h3><p>{r.desc[l]}</p><small>{r.access[l]}</small></a>)}</div><p className="tk-resource-note">{t('Prepare ethically: follow employer rules and never use outside help in a live assessment. External providers may change their free access.', 'Prepara-te com integridade: segue as regras do empregador e não uses ajuda externa num teste real. O acesso gratuito dos fornecedores pode mudar.')}</p></div></section>



 </div>
}
