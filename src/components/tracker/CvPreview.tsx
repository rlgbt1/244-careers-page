import { lazy, Suspense } from 'react'
import { useLang } from '../../context/LanguageContext'
import { asset } from '../../utils/asset'
const PdfReader = lazy(() => import('./PdfReader'))

export default function CvPreview({ standalone = false }: { standalone?: boolean }) {
  const Heading = standalone ? 'h1' : 'h2'
  const { lang } = useLang()
  const t = (en: string, pt: string) => lang === 'pt' ? pt : en
  const pdf = asset('/resources/cv-101/244-club-cv-101.pdf')
  return <section className="tk-cv tk-section tk-cv-reader-section" id="cv-guide" aria-labelledby="cv-title">
    <div className="tk-wrap tk-cv-reader-layout">
      <div className="tk-cv-reader-heading">
        <div><p className="tk-eyebrow">{t('THE 244 TOOLKIT', 'O GUIA 244')}</p><Heading id="cv-title">CV 101</Heading>
          <p>{t('Read Yusseni Furtado’s practical guide to CV structure, stronger bullet points and final checks. Read the guide in the document window.', 'Lê o guia prático de Yusseni Furtado sobre estrutura, pontos mais fortes e revisão do CV. Lê o guia na janela do documento.')}</p>
          <p className="tk-cv-reader-credit">244 Club · Yusseni Furtado · 7 {t('pages · In English', 'páginas · Em inglês')}</p>
        </div>
        <a className="tk-btn tk-btn-lime" href={pdf} download>{t('Download PDF', 'Descarregar PDF')} ↓</a>
      </div>
      <Suspense fallback={<p className="tk-reader-loading" role="status">{t('Loading document…', 'A carregar o documento…')}</p>}>
        <PdfReader file={pdf}/>
      </Suspense>
    </div>
  </section>
}
