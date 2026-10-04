import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const data = JSON.parse(fs.readFileSync(new URL('../src/content/tracker-data.json', import.meta.url), 'utf8'));
const business = JSON.parse(fs.readFileSync(new URL('../src/content/tracker-business.json', import.meta.url), 'utf8'));
const spring = JSON.parse(fs.readFileSync(new URL('../src/content/tracker-spring.json', import.meta.url), 'utf8'));
const source = fs.readFileSync(new URL('../src/utils/tracker.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
const module = { exports: {} };
vm.runInNewContext(compiled, { module, exports: module.exports, require: path => path.includes('tracker-spring') ? spring : path.includes('tracker-business') ? business : data, Intl, Date, URL });
const { availability, isoDate, safeExternal, dateLabel, isStale, businessOpportunities, programmeKind, locationOptions } = module.exports;
const row = { ...data[0], opens: 'Not published', closes: 'Not published', checked: '2026-10-04', audit: { state: 'reachable' } };

test('source collection preserves 153 unique records across 60 employers', () => {
  assert.equal(data.length, 153);
  assert.equal(new Set(data.map(r => r.company)).size, 60);
  assert.equal(new Set(data.map(r => r.id)).size, 153);
  for (const r of data) {
    assert.ok(safeExternal(r.url), r.company);
    assert.ok(safeExternal(r.source), r.company);
    assert.equal(r.location, 'Unspecified');
    assert.equal(r.checked, '2026-10-04');
  }
});
test('HTTP success alone never creates an Open or Verified status', () => {
  assert.equal(availability(row, '2026-10-04'), 'listed');
  assert.equal(availability({ ...row, audit: { state: 'needs-review' } }, '2026-10-04'), 'review');
  assert.equal(availability({ ...row, audit: { state: 'closed-signal' } }, '2026-10-04'), 'review');
});
test('past deadline, same-day deadline and future openings are distinct', () => {
  assert.equal(availability({ ...row, closes: '2026-10-03' }, '2026-10-04'), 'closed');
  assert.equal(availability({ ...row, closes: '2026-10-04' }, '2026-10-04'), 'listed');
  assert.equal(availability({ ...row, opens: '2026-10-10' }, '2026-10-04'), 'soon');
  assert.equal(availability({ ...row, opens: '2026-11-01' }, '2026-10-04'), 'upcoming');
});
test('invalid and unknown dates are never inferred', () => {
  for (const value of ['2026-02-30', '2026-13-01', 'Not published', '', '04/10/2026']) assert.equal(isoDate(value), null);
  assert.equal(isoDate('2028-02-29'), '2028-02-29');
  assert.equal(dateLabel('Not published', 'pt'), 'Não publicado');
  assert.equal(isStale(row, '2026-10-11'), false);
  assert.equal(isStale(row, '2026-10-12'), true);
});
test('external links accept HTTPS only', () => {
  assert.equal(safeExternal('javascript:alert(1)'), undefined);
  assert.equal(safeExternal('http://example.com'), undefined);
  assert.equal(safeExternal('/relative'), undefined);
  assert.equal(safeExternal('https://example.com/jobs'), 'https://example.com/jobs');
});
test('original PDF and seven mobile-safe preview pages are shipped', () => {
  const pdf=fs.readFileSync(new URL('../public/resources/cv-101/244-club-cv-101.pdf', import.meta.url));
  assert.equal(pdf.subarray(0,5).toString(), '%PDF-');
  for(let page=1;page<=7;page++){
    const jpg=fs.readFileSync(new URL('../public/resources/cv-101/page-'+page+'.jpg', import.meta.url));
    assert.equal(jpg[0],255);assert.equal(jpg[1],216);
  }
});


test('broader collection has 40 unique records and preserves distinct programme types', () => {
  assert.equal(businessOpportunities.length,40);
  assert.equal(new Set(business.map(r=>r.company)).size,40);
  assert.equal(new Set([...data,...business].map(r=>r.id)).size,193);
  assert.equal(business.filter(r=>programmeKind(r)==='summer').length,39);
  assert.equal(business.filter(r=>programmeKind(r)==='other').length,1);
  assert.equal(business.some(r=>programmeKind(r)==='spring'),false);
  assert.equal(business.some(r=>programmeKind(r)==='graduate'),false);
  for(const row of business) assert.ok(safeExternal(row.url));
});
test('uncertain location and source classification are not silently presented as verified', () => {
  const trackr=business.find(r=>r.company==='Trackr');
  assert.equal(programmeKind(trackr),'other');
  assert.equal(availability(trackr,'2026-10-04'),'review');
  const farrans=business.find(r=>r.company==='Farrans Construction');
  assert.equal(locationOptions(farrans).length,0);
  assert.equal(availability(farrans,'2026-10-04'),'review');
  assert.ok(locationOptions(business.find(r=>r.company==='Babcock')).includes('Bristol'));
});

test('public tables exclude review records without altering the source files',()=>{
 const {publicFinanceOpportunities:f,publicBusinessOpportunities:b,isPublicOpportunity}=module.exports;
 assert.equal(f.length,150);
 assert.ok(f.every(isPublicOpportunity));
 assert.ok(b.every(isPublicOpportunity));
 assert.equal(b.some(r=>r.company==='Trackr'||r.company==='Farrans Construction'),false);
 assert.ok(b.some(r=>r.sector==='Real Estate'));
 assert.equal(new Set(f.map(r=>r.id)).size,f.length);
});
test('spring records carry employer sources, supported dates and UK locations',()=>{
 assert.equal(spring.length,10);
 for(const r of spring){
  assert.equal(programmeKind(r),'spring');assert.ok(safeExternal(r.source));
  assert.ok(module.exports.publicLocationOptions(r).length>0);
  assert.ok(!r.source.includes('the-trackr.com'));
 }
 assert.equal(spring.find(r=>r.company==='Jefferies').closes,'2026-12-01');
 assert.equal(availability(spring.find(r=>r.id==='spring-db-2027'),'2026-10-04'),'upcoming');
 assert.equal(availability(spring.find(r=>r.company==='Lazard'),'2026-10-04'),'upcoming');
});
test('public location options contain only named UK places, not regions or review labels',()=>{
 const rows=[...module.exports.publicFinanceOpportunities,...module.exports.publicBusinessOpportunities];
 const locations=rows.flatMap(module.exports.publicLocationOptions);
 for(const name of ['Scotland','East Anglia','Midlands','Unspecified','Location requires review']) assert.ok(!locations.includes(name));
 assert.ok(locations.includes('Bristol'));assert.ok(locations.includes('Edinburgh'));
});
test('internal CSVs are not deployed as public assets',()=>{
 for(const name of ['uk-finance-2027.csv','uk-business-opportunities.csv']){
  assert.equal(fs.existsSync(new URL('../public/data/'+name,import.meta.url)),false);
  assert.equal(fs.existsSync(new URL('../public/'+name,import.meta.url)),false);
 }
});

test('unified tracker deduplicates programmes, not shared employer portals',()=>{
 const {publicOpportunities:rows,publicFinanceOpportunities:f,publicBusinessOpportunities:b,opportunityKey:key}=module.exports;
 assert.equal(new Set(rows.map(key)).size,rows.length);
 assert.equal(rows.length,new Set([...f,...b].map(key)).size);
 assert.equal(new Set(rows.map(r=>r.id)).size,rows.length);
 assert.equal(rows.filter(r=>r.company==='Shell').length,1);
 assert.equal(rows.filter(r=>r.company==='Deloitte').length,3);
 assert.equal(rows.filter(r=>r.company==='Deutsche Bank').length,f.filter(r=>r.company==='Deutsche Bank').length);
 for(const sourceRow of [...f,...b])assert.ok(rows.some(r=>key(r)===key(sourceRow)),sourceRow.programme);
 assert.ok(module.exports.publicLocationOptions(rows.find(r=>r.company==='Shell')).includes('London'));
});
test('visible areas are backed by roles and work across source collections',()=>{
 const {publicOpportunities:rows,opportunityAreas:areas,areasForOpportunity:classify}=module.exports;
 for(const area of areas)assert.ok(rows.some(r=>classify(r).includes(area.id)),area.id);
 assert.ok(classify(rows.find(r=>r.company==='Figma')).includes('technology'));
 assert.ok(!classify(rows.find(r=>r.company==='Figma')).includes('finance'));
 assert.ok(classify(rows.find(r=>r.company==='SSE')).includes('engineering'));
 assert.ok(classify(rows.find(r=>r.company==='Eastdil Secured')).includes('real-estate'));
 assert.ok(classify(rows.find(r=>r.company==='Oliver Wyman')).includes('consulting'));
 assert.ok(classify(rows.find(r=>r.company==='Bain & Company')).includes('technology'));
 for(const row of rows)assert.ok(classify(row).length>0);
});
test('employer grouping preserves every programme and respects filtered results',()=>{
 const {publicOpportunities:rows,groupByEmployer:group,programmeKind}=module.exports;
 const groups=group(rows);
 assert.equal(groups.length,new Set(rows.map(r=>r.company.toLowerCase())).size);
 assert.equal(groups.flatMap(g=>g.rows).length,rows.length);
 assert.ok(groups.find(g=>g.company==='Deutsche Bank').rows.length>4);
 const spring=group(rows.filter(r=>programmeKind(r)==='spring'));
 assert.equal(spring.find(g=>g.company==='Deutsche Bank').rows.length,4);
});
