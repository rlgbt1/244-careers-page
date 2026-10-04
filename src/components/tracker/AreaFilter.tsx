import { useLang } from '../../context/LanguageContext'
import { opportunityAreas, publicOpportunities, areasForOpportunity } from '../../utils/tracker'

const availableAreas=opportunityAreas.filter(a=>publicOpportunities.some(r=>areasForOpportunity(r).includes(a.id)))
export default function AreaFilter({value,onChange,compact=false}:{value:string;onChange:(value:string)=>void;compact?:boolean}) {
 const {lang}=useLang()
 return <fieldset className={'tk-area-filter'+(compact?' is-compact':'')}>
  <legend>{lang==='pt'?'Explora por área':'Explore by area'}</legend>
  <div className="tk-area-options">
   <button type="button" aria-pressed={value==='all'} onClick={()=>onChange('all')}>{lang==='pt'?'Todas as áreas':'All areas'}</button>
   {availableAreas.map(a=><button type="button" key={a.id} aria-pressed={value===a.id} onClick={()=>onChange(a.id)}>{a[lang]}</button>)}
  </div>
 </fieldset>
}
