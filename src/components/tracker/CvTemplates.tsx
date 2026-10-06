import {lazy, Suspense, useEffect, useRef, useState} from 'react'
import {useLang} from '../../context/LanguageContext'
import {asset} from '../../utils/asset'
import '../../styles/career-additions.css'
const PdfReader = lazy(() => import('./PdfReader'))

export default function CvTemplates() {
 const {lang}=useLang(), t=(en:string,pt:string)=>lang==='pt'?pt:en
 const [open,setOpen]=useState(false)
 const dialog=useRef<HTMLDialogElement>(null)
 const trigger=useRef<HTMLButtonElement>(null)
 const file=asset('/resources/cv-templates/example-cv')
 useEffect(()=>{
  if(!open) return
  const el=dialog.current
  el?.showModal()
  const before=document.body.style.overflow
  document.body.style.overflow='hidden'
  return ()=>{ el?.close(); document.body.style.overflow=before; trigger.current?.focus() }
 },[open])
 return <section className="tk-section cv-templates" id="cv-templates" aria-labelledby="templates-heading">
  <div className="tk-wrap">
   <p className="tk-eyebrow">{t('EDITABLE DOCUMENTS','DOCUMENTOS EDITÁVEIS')}</p>
   <div className="cv-template-intro"><h2 id="templates-heading">{t('CV templates','Modelos de CV')}</h2><p>{t('Use the guide above, then start with an editable example. Replace the details and achievements with your own and adapt the content to each role.','Consulta o guia acima e começa com um exemplo editável. Substitui os dados e as conquistas pelos teus e adapta o conteúdo a cada função.')}</p></div>
   <div className="cv-template-grid">
    <article className="cv-template-card">
     <button ref={trigger} className="cv-template-cover" onClick={()=>setOpen(true)} aria-label={t('Preview the example CV','Pré-visualizar o exemplo de CV')}>
      <img src={file+'.jpg'} alt={t('First page of the example CV','Primeira página do exemplo de CV')} width="637" height="900" loading="lazy"/>
      <span>{t('View document','Ver documento')} ↗</span>
     </button>
     <div className="cv-template-copy"><p className="tk-eyebrow">01 / WORD + PDF</p><h3>{t('Skills & experience CV','CV de competências e experiência')}</h3><p>{t('An accounting and finance example covering education, experience and professional skills. Adapt the structure to your field.','Um exemplo de contabilidade e finanças com formação, experiência e competências profissionais. Adapta a estrutura à tua área.')}</p><small>{t('Original document in English · Editable Word file','Documento original em inglês · Ficheiro Word editável')}</small><div className="cv-template-downloads"><a className="tk-btn tk-btn-dark" href={file+'.docx'} download>{t('Download Word','Descarregar Word')} ↓</a><a href={file+'.pdf'} download>{t('Download PDF','Descarregar PDF')} ↓</a></div></div>
    </article>
    <article className="cv-template-card cv-template-soon"><span className="cv-template-number" aria-hidden="true">02</span><div><p className="tk-eyebrow">{t('COMING SOON','EM BREVE')}</p><h3>{t('A second CV template','Um segundo modelo de CV')}</h3><p>{t('Another format will be added here, with its own preview and editable download.','Vamos adicionar aqui outro formato, com pré-visualização e uma versão editável para descarregar.')}</p></div></article>
   </div>
  </div>
  {open&&<dialog ref={dialog} className="cv-template-dialog" aria-labelledby="cv-dialog-heading" onCancel={()=>setOpen(false)} onClick={e=>{if(e.target===e.currentTarget)setOpen(false)}}>
   <header><h2 id="cv-dialog-heading">{t('Example CV','Exemplo de CV')}</h2><button autoFocus onClick={()=>setOpen(false)}>{t('Close','Fechar')} ×</button></header>
   <Suspense fallback={<p role="status">{t('Loading document…','A carregar o documento…')}</p>}><PdfReader file={file+'.pdf'} title={t('Example CV','Exemplo de CV')} template/></Suspense>
   <footer><span>{t('Example content, replace with your own details.','Conteúdo de exemplo, substitui pelos teus dados.')}</span><a href={file+'.docx'} download>{t('Download editable Word','Descarregar Word editável')} ↓</a></footer>
  </dialog>}
 </section>
}
