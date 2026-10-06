/** Run manually: node scripts/check-vacancies.mjs [--limit=20]
 * Read-only employer checks. JSON goes to stdout; never rewrites public data.
 * Generic HTTP success is deliberately NOT evidence of an open vacancy.
 */
import fs from 'node:fs'
const root = new URL('../', import.meta.url)
const rows = ['tracker-data', 'tracker-business', 'tracker-spring', 'tracker-researched'].flatMap(name =>
  JSON.parse(fs.readFileSync(new URL(`src/content/${name}.json`, root), 'utf8')))
const extra = new URL('research/priority-cities-open-2026-10-06.json', root)
if (fs.existsSync(extra)) rows.push(...JSON.parse(fs.readFileSync(extra, 'utf8')).opportunities)
const limitArg = process.argv.find(arg => arg.startsWith('--limit='))
const limit = limitArg ? Number(limitArg.split('=')[1]) : rows.length
if (!Number.isInteger(limit) || limit < 1) throw new Error('Use a positive integer --limit')
const today = new Intl.DateTimeFormat('en-CA', {timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())
const seen = new Set()
const targets = rows.filter(row => row.url && !seen.has(row.url) && seen.add(row.url)).slice(0, limit)
async function check(row) {
  const result = {company:row.company, programme:row.programme, url:row.url, checked:new Date().toISOString(), state:'unknown', evidence:''}
  if (/^\d{4}-\d{2}-\d{2}$/.test(row.closes) && row.closes < today)
    return {...result,state:'deadline_passed',evidence:'Recorded closing date has passed; no employer check performed.'}
  try {
    const url = new URL(row.url)
    if (url.protocol !== 'https:') return {...result,evidence:'Only HTTPS URLs are checked.'}
    const gh = /^(?:job-boards|boards)\.greenhouse\.io$/.test(url.hostname) && url.pathname.match(/^\/([^/]+)\/jobs\/(\d+)/)
    const endpoint = gh ? `https://boards-api.greenhouse.io/v1/boards/${gh[1]}/jobs/${gh[2]}` : url.href
    const response = await fetch(endpoint,{signal:AbortSignal.timeout(12000),headers:{'User-Agent':'244Careers-LinkCheck/1.0'}})
    if ([403,429].includes(response.status)) return {...result,state:'blocked',evidence:`HTTP ${response.status}; no availability inference.`}
    if (!response.ok) return {...result,state:'needs_review',evidence:`HTTP ${response.status}; unavailable page does not prove applications closed.`}
    if (gh) {
      const job = await response.json()
      if (String(job.id) === gh[2] && job.title && job.absolute_url)
        return {...result,state:'listed_on_employer_ats',evidence:'Exact job ID is present in the employer’s public Greenhouse API. Review eligibility and application form before labelling open.'}
    }
    return {...result,state:'needs_review',evidence:'Page responds; JavaScript, generic portals and filled vacancies require employer-specific review.'}
  } catch (error) { return {...result,state:'unknown',evidence:error.name === 'TimeoutError' ? 'Request timed out.' : 'Request failed; availability unknown.'} }
}
const results = []
let cursor = 0
await Promise.all(Array.from({length:3},async()=>{
  while(cursor < targets.length) {
    const row=targets[cursor++]
    results.push(await check(row))
  }
}))
console.log(JSON.stringify({checked:new Date().toISOString(),scope:'Internal review report; not a live-status feed and never marks HTTP 200 as open.',counts:results.reduce((a,r)=>(a[r.state]=(a[r.state]||0)+1,a),{}),results},null,2))
