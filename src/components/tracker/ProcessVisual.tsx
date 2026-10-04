import { motion, useReducedMotion } from 'motion/react'
import { useLang } from '../../context/LanguageContext'
import { asset } from '../../utils/asset'

const codes=['OA','HV','INT','AC']
export default function ProcessVisual({active}:{active:number}) {
 const {lang}=useLang(),reduce=useReducedMotion()
 const t=(en:string,pt:string)=>lang==='pt'?pt:en
 const names=[t('Online assessment','Avaliação online'),t('Recorded video interview','Entrevista em vídeo gravado'),t('Live interview','Entrevista ao vivo'),t('Assessment centre','Centro de avaliação')]
 return <div className="tk-route-diagram tk-restored-process" data-stage={codes[active]}>
  <div className="tk-route-top"><span>{t('THE USUAL PROCESS','O PROCESSO HABITUAL')}</span><span>0{active+1} / 04</span></div>
  <div className="tk-flow-beam" aria-label="OA → HV → INT → AC"><svg viewBox="0 0 400 36" fill="none" aria-hidden="true"><path d="M20 18H380" stroke="#66818e" strokeDasharray="2 5"/><path className="tk-flow-pulse" d="M20 18H380" stroke="#e5eda9" strokeWidth="2" pathLength="100"/></svg>{codes.map((code,i)=><a className={active===i?'active':''} aria-current={active===i?'step':undefined} href={'#stage-'+code.toLowerCase()} key={code}>{code}</a>)}</div>
  <motion.div className="tk-stage-preview" key={active} initial={reduce?false:{opacity:0,y:8}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:reduce?0:.3}}>
   <p className="tk-preview-label">{codes[active]} / {names[active]}</p>
   {active===0&&<div className="tk-assessment">
    <div className="tk-demo-bars" role="img" aria-label={t('Example numerical reasoning chart','Gráfico ilustrativo de raciocínio numérico')}>
     {[42,66,54,88].map((height,i)=><motion.i key={i} style={{height:height+'%',transformOrigin:'bottom'}} initial={reduce?false:{scaleY:.1}} whileInView={{scaleY:1}} viewport={{once:true}} transition={{duration:reduce?0:.55,delay:reduce?0:i*.1}}/>)}
    </div>
    <div className="tk-demo-options" aria-hidden="true"><span>A</span><span>B</span><span className="chosen">C ✓</span></div>
   </div>}
   {active===1&&<div className="tk-hirevue-demo">
    <div className="tk-recruit-photo"><motion.img src={asset('/assets/careers/student-interview.jpg')} width="1100" height="733" alt={t('Illustrative student practising a video interview at a laptop','Estudante ilustrativo a praticar uma entrevista em vídeo ao computador')} loading="lazy" initial={reduce?false:{scale:1.04}} whileInView={{scale:1}} viewport={{once:true}} transition={{duration:reduce?0:.8}}/><span className="tk-camera-tag">{t('Video interview · practice','Entrevista em vídeo · treino')}</span></div>
    <div className="tk-hirevue-controls"><span><i aria-hidden="true"/>{t('Camera ready','Câmara pronta')}</span><div className="tk-audio-levels" aria-hidden="true">{[0,1,2,3,4].map(i=><i key={i} style={{animationDelay:i*.14+'s'}}/>)}</div></div>
    <p>{t('Practise a recorded answer, then review your delivery.','Pratica uma resposta gravada e revê a tua apresentação.')}</p>
   </div>}
   {active===2&&<div className="tk-interview-demo">
    <div className="tk-star-steps">{['S','T','A','R'].map((letter,i)=><motion.span key={letter} initial={reduce?false:{opacity:0,y:8}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:reduce?0:.3,delay:reduce?0:i*.15}}>{letter}</motion.span>)}</div>
    <p>{t('Situation · Task · Action · Result','Situação · Tarefa · Ação · Resultado')}</p>
   </div>}
   {active===3&&<div className="tk-team-demo"><div>{['01','02','03'].map((n,i)=><motion.span key={n} className={i===1?'chosen':''} initial={reduce?false:{opacity:0,scale:.85}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{duration:reduce?0:.35,delay:reduce?0:i*.13}}>{n}</motion.span>)}</div><p>{t('Analyse together. Discuss the options. Present your recommendation.','Analisa em equipa. Discute as opções. Apresenta a tua recomendação.')}</p></div>}
  </motion.div>
  <p className="tk-sticky-caption">{active===1?t('Illustrative practice view, not a HireVue screenshot. AI-generated image.','Exemplo ilustrativo, não uma captura do HireVue. Imagem gerada por IA.'):t('Illustrative preparation example. Each employer’s process may differ.','Exemplo ilustrativo de preparação. O processo varia conforme o empregador.')}</p>
 </div>
}
