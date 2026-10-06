import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { useLang } from '../../context/LanguageContext'
import { cvTitles } from '../../content/tracker-guide'

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

export default function PdfReader({ file, title = "CV 101", template = false }: { file: string; title?: string; template?: boolean }) {
  const { lang } = useLang()
  const t = (en: string, pt: string) => lang === 'pt' ? pt : en
  const viewport = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(300)
  const [pages, setPages] = useState(0)
  const [current, setCurrent] = useState(1)
  const [zoom, setZoom] = useState(1)
  useEffect(() => {
    const el = viewport.current
    if (!el) return
    const observer = new ResizeObserver(() => setWidth(Math.max(180, el.clientWidth - 32)))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  function jump(page: number) {
    const el = viewport.current
    const target = el?.querySelector<HTMLElement>('[data-pdf-page="'+page+'"]')
    if (el && target) el.scrollTo({ top: el.scrollTop + target.getBoundingClientRect().top - el.getBoundingClientRect().top - 16, behavior: 'instant' })
    setCurrent(page)
  }
  function trackPage() {
    const el = viewport.current
    if (!el) return
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) { setCurrent(pages); return }
    const top = el.getBoundingClientRect().top
    let nearest = 1, distance = Infinity
    el.querySelectorAll<HTMLElement>('[data-pdf-page]').forEach(page => {
      const d = Math.abs(page.getBoundingClientRect().top - top - 16)
      if (d < distance) { distance = d; nearest = Number(page.dataset.pdfPage) }
    })
    setCurrent(nearest)
  }
  return <div className="tk-reader">
    <div className="tk-reader-toolbar">
      <label>{t('Page', 'Página')} <select disabled={!pages} value={current} onChange={e => jump(Number(e.target.value))}>
        {Array.from({length:pages || 1}, (_, i) => <option key={i} value={i+1}>{i+1} / {pages || '…'}</option>)}
      </select></label>
      <div className="tk-reader-zoom" role="group" aria-label={t('Document zoom', 'Zoom do documento')}>
        <button disabled={zoom <= 1} onClick={() => setZoom(z => Math.max(1, z-.25))} aria-label={t('Zoom out', 'Reduzir zoom')}>−</button>
        <button onClick={() => setZoom(1)} aria-label={t('Fit to width', 'Ajustar à largura')}>{zoom === 1 ? t('Fit width', 'Ajustar') : Math.round(zoom*100)+'%'}</button>
        <button disabled={zoom >= 2} onClick={() => setZoom(z => Math.min(2, z+.25))} aria-label={t('Zoom in', 'Aumentar zoom')}>+</button>
      </div>
      <a href={file} target="_blank" rel="noopener noreferrer">{t('Open PDF', 'Abrir PDF')} ↗</a>
    </div>
    <p className="tk-reader-hint">{template ? t('Scroll inside the document. Download the Word file to edit your own copy.', 'Desliza dentro do documento. Descarrega o ficheiro Word para editar a tua cópia.') : t('Scroll inside the document to read all seven pages.', 'Desliza dentro do documento para ler as sete páginas.')}</p>
    <div className="tk-reader-viewport" ref={viewport} onScroll={trackPage} role="region" tabIndex={0} aria-label={title + t(', scrollable PDF document', ', documento PDF com deslocamento')}>
      <Document file={file} onLoadSuccess={({numPages}) => setPages(numPages)}
        loading={<p role="status">{t('Loading PDF…', 'A carregar o PDF…')}</p>}
        error={<p role="alert">{t('The document could not load.', 'Não foi possível carregar o documento.')} <a href={file} target="_blank" rel="noopener noreferrer">{t('Open the PDF directly', 'Abrir o PDF diretamente')} ↗</a></p>}>
        {Array.from({length:pages}, (_, i) => <figure className="tk-reader-page" data-pdf-page={i+1} key={i} style={{width:Math.min(width,800)*zoom}}>
          <Page pageNumber={i+1} width={Math.min(width,800)*zoom} devicePixelRatio={Math.min(window.devicePixelRatio || 1, 2)} renderAnnotationLayer renderTextLayer loading={<p>{t('Loading page', 'A carregar página')} {i+1}…</p>}/>
          <figcaption>{i+1} / {pages} · {template ? title : cvTitles[i] || title}</figcaption>
        </figure>)}
      </Document>
    </div>
  </div>
}
