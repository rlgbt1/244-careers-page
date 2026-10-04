import { useEffect, useRef, useState } from 'react'
import { useLang } from '../../context/LanguageContext'
import { asset } from '../../utils/asset'
import { cvTitles } from '../../content/tracker-guide'

export default function CvPreview({standalone=false}:{standalone?:boolean}) {
 const Heading=standalone?'h1':'h2'
  const { lang } = useLang()
  const t = (en: string, pt: string) => lang === 'pt' ? pt : en
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const [open,setOpen] = useState(false)
  const [page,setPage] = useState(1)
  const pdf = asset('/resources/cv-101/244-club-cv-101.pdf')
  useEffect(()=>{
    if (!open) return
    dialog.current?.showModal()
    const previous=document.body.style.overflow
    document.body.style.overflow='hidden'
    return ()=>{document.body.style.overflow=previous; dialog.current?.close(); trigger.current?.focus()}
  },[open])
  return <section className="tk-cv tk-section" id="cv-guide" aria-labelledby="cv-title">
    <div className="tk-wrap tk-cv-grid">
      <div className="tk-cv-copy"><p className="tk-eyebrow">05 / {t('THE 244 TOOLKIT', 'O GUIA 244')}</p><Heading id="cv-title">CV 101</Heading><p>{t('Turn responsibilities into achievements. Yusseni Furtado’s CV 101 walks you through structure, stronger bullet points and the final checks before you press send.', 'Transforma responsabilidades em conquistas. O CV 101 de Yusseni Furtado explica a estrutura, como escrever pontos mais fortes e o que verificar antes de enviar.')}</p><p className="tk-cv-credit">244 Club · Yusseni Furtado · 7 {t('pages', 'páginas')} · PDF {t('in English', 'em inglês')}</p><div className="tk-actions"><button className="tk-btn tk-btn-lime" ref={trigger} onClick={()=>setOpen(true)}>{t('Preview the guide', 'Pré-visualizar o guia')} ↗</button><a className="tk-btn tk-btn-ghost" href={pdf} download>{t('Download PDF', 'Descarregar PDF')} ↓</a></div></div>
      <button className="tk-cv-stack" onClick={()=>{setPage(1);setOpen(true)}} aria-label={t('Preview CV 101','Pré-visualizar CV 101')}>
        <img className="tk-cv-back" src={asset('/resources/cv-101/page-3.jpg')} width="1012" height="1432" loading="lazy" alt=""/>
        <img className="tk-cv-front" src={asset('/resources/cv-101/page-1.jpg')} width="1012" height="1432" loading="lazy" alt=""/>
        <span>{t('PREVIEW THE GUIDE','PRÉ-VISUALIZAR O GUIA')} ↗</span>
      </button>
    </div>
    {open && <dialog className="tk-pdf-dialog" ref={dialog} aria-labelledby="tk-pdf-title" onCancel={()=>setOpen(false)} onClick={e=>{if(e.target===e.currentTarget)setOpen(false)}} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();setPage(p=>Math.min(7,p+1))}if(e.key==='ArrowLeft'){e.preventDefault();setPage(p=>Math.max(1,p-1))}}}>
      <div className="tk-pdf-shell"><header><div><h3 id="tk-pdf-title">CV 101</h3><p>Yusseni Furtado · 244 Club</p></div><div><a href={pdf} download className="tk-btn tk-btn-dark">{t('Download', 'Descarregar')} ↓</a><button className="tk-close" autoFocus onClick={()=>setOpen(false)} aria-label={t('Close preview', 'Fechar pré-visualização')}>×</button></div></header>
        <div className="tk-pdf-canvas" tabIndex={0} role="region" aria-label={t('PDF page preview', 'Pré-visualização da página PDF')}><img key={page} src={asset(`/resources/cv-101/page-${page}.jpg`)} alt={`${t('Page', 'Página')} ${page}: ${cvTitles[page-1]}`} /></div>
        <footer><button disabled={page===1} onClick={()=>setPage(p=>p-1)} aria-label={t('Previous page', 'Página anterior')}>←</button><label>{t('Page', 'Página')} <select value={page} onChange={e=>setPage(Number(e.target.value))}>{cvTitles.map((title,i)=><option key={title} value={i+1}>{i+1} / 7 — {title}</option>)}</select></label><button disabled={page===7} onClick={()=>setPage(p=>p+1)} aria-label={t('Next page', 'Página seguinte')}>→</button></footer><p className="tk-pdf-alternative"><a href={pdf} target="_blank" rel="noopener noreferrer">{t('Open the original PDF for selectable text and full-size viewing', 'Abrir o PDF original para texto selecionável e visualização completa')} ↗</a></p>
      </div>
    </dialog>}
  </section>
}
