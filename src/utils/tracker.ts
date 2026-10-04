import data from '../content/tracker-data.json'

import springData from '../content/tracker-spring.json'
import businessData from '../content/tracker-business.json'

export interface Opportunity {
  id: string; company: string; programme: string; group: string; type: string; sector: string;
  location: string; eligibility: string; opens: string; closes: string; coverLetter: string;
  visa: string; process: string; url: string; source: string; sourceLabel?: string;
  checked: string; rolling: boolean; notes: string; eligibilityPt?: string;
  audit: { state: string; checked: string; http?: number | null; [key: string]: unknown };
}
export const businessOpportunities: Opportunity[] = businessData
export function programmeKind(row: Opportunity): 'summer' | 'spring' | 'graduate' | 'other' {
  if (/other internship/i.test(row.type)) return 'other'
  if (/spring|insight/i.test(row.type)) return 'spring'
  if (/graduate/i.test(row.type)) return 'graduate'
  return /summer/i.test(row.type) ? 'summer' : 'other'
}
export function locationOptions(row: Opportunity): string[] {
  if (row.location === 'Unspecified' || /requires review/i.test(row.location)) return []
  return row.location.split(';').map(part => part.split('/').slice(-1)[0].trim()).filter(Boolean)
}
export type Availability = 'listed' | 'review' | 'closed' | 'soon' | 'upcoming'
export const opportunities: Opportunity[] = data
export const researchDate = '2026-10-04'
export function londonToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
}
export function isoDate(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const d = new Date(`${value}T12:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value ? value : null
}
export function availability(row: Opportunity, today = londonToday()): Availability {
  const closing = isoDate(row.closes)
  const opening = isoDate(row.opens)
  if (closing && closing < today) return 'closed'
  if (row.audit.state !== 'reachable') return 'review'
  if (opening && opening > today) {
    const days = (Date.parse(opening) - Date.parse(today)) / 86400000
    return days <= 14 ? 'soon' : 'upcoming'
  }
  // HTTP success and third-party provenance do not verify a live application.
  return 'listed'
}
export function isStale(row: Opportunity, today = londonToday()) {
  return Date.parse(today) - Date.parse(row.checked) > 7 * 86400000
}
export function dateLabel(value: string, lang: 'en' | 'pt') {
  const date = isoDate(value)
  return date ? new Intl.DateTimeFormat(lang === 'pt' ? 'pt-PT' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`)) : lang === 'pt' ? 'Não publicado' : 'Not published'
}
export function safeExternal(url: string) {
  try { const parsed = new URL(url); return parsed.protocol === 'https:' ? parsed.href : undefined } catch { return undefined }
}

/** Raw imports stay untouched for editorial review; only eligible records reach the UI. */
export function isPublicOpportunity(row: Opportunity) {
 return row.audit.state === 'reachable' && !!safeExternal(row.url) && !/requires review/i.test(row.location)
}
export const springOpportunities: Opportunity[] = springData
export const publicFinanceOpportunities = [...opportunities, ...springOpportunities].filter(isPublicOpportunity)
export const publicBusinessOpportunities = [...businessOpportunities, ...opportunities.filter(r => r.company === 'Eastdil Secured').map(r => ({...r, sector: 'Real Estate'}))].filter(isPublicOpportunity)
const ukPlaces = new Set(['London','Edinburgh','Bristol','Birmingham','Manchester','Leeds','Glasgow','Cardiff','York','Newcastle upon Tyne','Croydon','Basingstoke','Ipswich','Exeter','Falmer','Melbourn','Bolton','Stevenage','Warrington','Chester','Prestwick','Farnborough','Welwyn Garden City','Ringwood','Bridgend','Rosyth','Devonport','Guildford','Hillsborough'])
export function publicLocationOptions(row: Opportunity) {
 return locationOptions(row).filter(place => ukPlaces.has(place))
}

/** A shared programme can appear in both research sources. Match by employer and
 * programme, never URL alone: several distinct roles share a search portal. */
export function opportunityKey(row: Opportunity) {
 const clean = (v: string) => v.toLowerCase().replace(/[^a-z0-9]/g, '')
 const employer = clean(row.company)
 const title = clean(row.programme)
 return employer + ':' + (title.startsWith(employer) ? title.slice(employer.length) : title)
}
export function mergeOpportunities(rows: Opportunity[]): Opportunity[] {
 const merged = new Map<string, Opportunity>()
 for (const row of rows) {
  const key = opportunityKey(row), previous = merged.get(key)
  if (!previous) { merged.set(key, {...row}); continue }
  merged.set(key, {
   ...previous,
   sector: [...new Set([...previous.sector.split(';'), ...row.sector.split(';')].map(s=>s.trim()))].join('; '),
   location: publicLocationOptions(row).length > publicLocationOptions(previous).length ? row.location : previous.location,
  })
 }
 return [...merged.values()]
}
export const publicOpportunities = mergeOpportunities([...publicFinanceOpportunities, ...publicBusinessOpportunities])

export const opportunityAreas = [
 {id:'finance', en:'Finance', pt:'Finanças'},
 {id:'consulting', en:'Consulting', pt:'Consultoria'},
 {id:'real-estate', en:'Real estate', pt:'Imobiliário'},
 {id:'technology', en:'Technology', pt:'Tecnologia'},
 {id:'engineering', en:'Engineering', pt:'Engenharia'},
 {id:'accounting', en:'Accounting & tax', pt:'Contabilidade e fiscalidade'},
 {id:'energy', en:'Energy', pt:'Energia'},
] as const
export type OpportunityArea = typeof opportunityAreas[number]['id']
/** Areas describe the role, not the dataset it came from. A role can span areas. */
export function areasForOpportunity(row: Opportunity): OpportunityArea[] {
 const text = row.sector + ' ' + row.programme
 const areas: OpportunityArea[] = []
 if (/consulting|consultan/i.test(text)) areas.push('consulting')
 if (/real estate/i.test(text) || row.company === 'Eastdil Secured') areas.push('real-estate')
 if (/technology|software|data sci|cyber|ai engineering/i.test(text)) areas.push('technology')
 if (/construction|infrastructure|aerospace|defence|engineering/i.test(text) && !/software|ai engineering/i.test(text)) areas.push('engineering')
 if (/audit|accounting|tax/i.test(text)) areas.push('accounting')
 if (/energy|utilities|chemicals|oil/i.test(row.sector)) areas.push('energy')
 if (/bank|financ|investment|trading|asset management|wealth|equity|credit|capital|hedge|quantitative|actuarial|restructur|private market|private invest|commodit|risk|economic crime|middle.*office|middle market|bulge bracket/i.test(text) || areas.length === 0) areas.push('finance')
 return [...new Set(areas)]
}
export function groupByEmployer(rows: Opportunity[]) {
 const groups = new Map<string, {company:string; rows:Opportunity[]}>()
 for (const row of rows) {
  const key = row.company.trim().toLowerCase()
  if (!groups.has(key)) groups.set(key, {company:row.company, rows:[]})
  groups.get(key)!.rows.push(row)
 }
 return [...groups.values()]
}
