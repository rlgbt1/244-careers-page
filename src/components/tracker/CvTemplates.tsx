import {lazy, Suspense, useEffect, useRef, useState} from 'react'
import {useLang} from '../../context/LanguageContext'
import {asset} from '../../utils/asset'
import '../../styles/career-additions.css'
const PdfReader = lazy(() => import('./PdfReader'))

export default function CvTemplates() {
 const {lang}=useLang(), t=(en:string,pt:string)=>lang==='pt'?pt:en
 const [open,setOpen]=useState(false)
 const [selected,setSelected]=useState(0)
 const dialog=useRef<HTMLDialogElement>(null)
 const trigger=useRef<HTMLButtonElement|null>(null)
 const first=asset('/resources/cv-templates/example-cv')
 const second=asset('/resources/cv-templates/244-club-template')
 const file=selected===0?first:second
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
   <p className="tk-eyebrow">{t('EXAMPLE DOCUMENTS','DOCUMENTOS DE EXEMPLO')}</p>
   <div className="cv-template-intro"><h2 id="templates-heading">{t('CV Templates','Modelos de CV')}</h2><p>{t('Use the guide above, then choose an example. Both include an editable Word file and a PDF preview. Replace example details with your own and adapt the content to each role.','Consulta o guia acima e escolhe um exemplo. Ambos incluem um ficheiro Word editável e uma pré-visualização em PDF. Substitui os dados de exemplo pelos teus e adapta o conteúdo a cada função.')}</p></div>
   <div className="cv-template-grid">
    <article className="cv-template-card">
     <button className="cv-template-cover" onClick={e=>{trigger.current=e.currentTarget;setSelected(0);setOpen(true)}} aria-label={t('Preview the example CV','Pré-visualizar o exemplo de CV')}>
      <img src={first+'.jpg'} alt={t('First page of the example CV','Primeira página do exemplo de CV')} width="637" height="900" loading="lazy"/>
      <span>{t('View document','Ver documento')} ↗</span>
     </button>
     <div className="cv-template-copy"><p className="tk-eyebrow">01 / WORD + PDF</p><h3>{t('CV Template 1','Modelo de CV 1')}</h3><p>{t('An accounting and finance example covering education, experience and professional skills. Adapt the structure to your field.','Um exemplo de contabilidade e finanças com formação, experiência e competências profissionais. Adapta a estrutura à tua área.')}</p><small>{t('Original document in English · Editable Word file','Documento original em inglês · Ficheiro Word editável')}</small><div className="cv-template-downloads"><a className="tk-btn tk-btn-dark" href={first+'.docx'} download>{t('Download Word','Descarregar Word')} ↓</a><a href={first+'.pdf'} download>{t('Download PDF','Descarregar PDF')} ↓</a></div></div>
    </article>
    <article className="cv-template-card">
     <button className="cv-template-cover" onClick={e=>{trigger.current=e.currentTarget;setSelected(1);setOpen(true)}} aria-label={t('Preview CV Template 2','Pré-visualizar o Modelo de CV 2')}><img src={second+'.jpg'} width="637" height="900" loading="lazy" alt={t('CV Template 2','Modelo de CV 2')}/><span>{t('View document','Ver documento')} ↗</span></button>
     <div className="cv-template-copy"><p className="tk-eyebrow">02 / WORD + PDF</p><h3>{t('CV Template 2','Modelo de CV 2')}</h3><p>{t('A classic layout covering education, experience, leadership, volunteering and skills. A general-purpose template for any field, including engineering. Replace the example content with your own details.','Um formato clássico com formação, experiência, liderança, voluntariado e competências. Um modelo geral para qualquer área, incluindo engenharia. Substitui o conteúdo de exemplo pelos teus dados.')}</p><small>{t('Original document in English · Editable Word file','Documento original em inglês · Ficheiro Word editável')}</small><div className="cv-template-downloads"><a className="tk-btn tk-btn-dark" href={second+'.docx'} download>{t('Download Word','Descarregar Word')} ↓</a><a href={second+'.pdf'} download>{t('Download PDF','Descarregar PDF')} ↓</a></div></div>
    </article>
   </div>
   <aside className="cv-length-callout" aria-labelledby="cv-length-heading"><svg viewBox="0 0 40 48" width="40" height="48" fill="none" aria-hidden="true"><path d="M7 2h18l9 9v35H7zM25 2v10h9" stroke="currentColor" strokeWidth="2"/><path d="M15 32h12M15 37h12" stroke="currentColor" strokeWidth="2"/><text x="20" y="26" textAnchor="middle" fill="currentColor" fontSize="16" fontWeight="600">1</text></svg><div><h3 id="cv-length-heading">{t('Keep it to one page','Mantém o CV numa página')}</h3><p >{t('Aim to keep your CV to one page, especially for online applications. Prioritise relevant experience and keep the text readable. Always follow the employer’s instructions if a different length is requested.','Procura manter o CV numa só página, sobretudo nas candidaturas online. Dá prioridade à experiência relevante e mantém o texto legível. Segue sempre as instruções do empregador se for pedida outra extensão.')}</p></div></aside>
  </div>
  {open&&<dialog ref={dialog} className="cv-template-dialog" aria-labelledby="cv-dialog-heading" onCancel={()=>setOpen(false)} onClick={e=>{if(e.target===e.currentTarget)setOpen(false)}}>
   <header><h2 id="cv-dialog-heading">{t('Example CV','Exemplo de CV')}</h2><button autoFocus onClick={()=>setOpen(false)}>{t('Close','Fechar')} ×</button></header>
   <Suspense fallback={<p role="status">{t('Loading document…','A carregar o documento…')}</p>}><PdfReader file={file+'.pdf'} title={t('Example CV','Exemplo de CV')} template/></Suspense>
   <footer><span>{t('Example content, replace with your own details.','Conteúdo de exemplo, substitui pelos teus dados.')}</span><a href={file+'.docx'} download>{t('Download editable Word','Descarregar Word editável')} ↓</a></footer>
  </dialog>}
 </section>
}
