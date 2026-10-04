import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import TrackerDirectory from '../components/tracker/TrackerDirectory'
import DiscoveryPlatforms from '../components/tracker/DiscoveryPlatforms'
import UkFlag from '../components/tracker/UkFlag'
import '../styles/tracker.css'
export default function OpportunitiesPage(){
 const {lang}=useLang();const t=(en:string,pt:string)=>lang==='pt'?pt:en
 return <div className="tk-page tk-directory-page"><div className="tk-directory-intro tk-wrap"><Link className="tk-back-guide" to="/">← {t('Back to the career guide','Voltar ao guia de carreira')}</Link><p className="tk-eyebrow"><UkFlag/> 244 / {t('UK OPPORTUNITIES','OPORTUNIDADES NO REINO UNIDO')}</p><h1>{t('Opportunities tracker','Tracker de oportunidades')}</h1><p>{t('Spring insights, summer internships and placements. Search the table and follow each programme link to the employer.','Spring insights, estágios de verão e placements. Pesquisa na tabela e segue a ligação de cada programa para o empregador.')}</p></div><TrackerDirectory/><DiscoveryPlatforms/><div className="tk-directory-return tk-wrap"><Link to="#discovery-platforms">{t('More opportunity platforms','Mais plataformas de oportunidades')} ↗</Link><Link to="/process">{t('Recruitment process guide','Guia do processo de recrutamento')} ↗</Link></div></div>
}
