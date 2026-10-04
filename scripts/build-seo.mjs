import {readFile,writeFile,mkdir} from 'node:fs/promises'
import {resolve} from 'node:path'
import ts from 'typescript'
const source=await readFile('src/content/site.ts','utf8')
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2020}}).outputText
const {pages,site}=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'))
const template=await readFile('dist/index.html','utf8')
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
for(const [path,page] of Object.entries(pages)){
 const url=site+(path==='/'?'/':path+'/'),image=site+'/assets/social/244-club-preview.jpg'
 const tags=[['name','description',page.description[0]],['name','robots','index,follow,max-image-preview:large'],['property','og:title',page.title[0]],['property','og:description',page.description[0]],['property','og:url',url],['property','og:type','website'],['property','og:site_name','244 Careers'],['property','og:image',image],['property','og:image:width','1200'],['property','og:image:height','630'],['property','og:image:alt','244 Club — careers and professional development'],['name','twitter:card','summary_large_image'],['name','twitter:title',page.title[0]],['name','twitter:description',page.description[0]],['name','twitter:image',image]]
 let html=template.replace(/<title>[\s\S]*?<\/title>/,'<title>'+escape(page.title[0])+'</title>').replace(/<meta name="description"[^>]*>/,'').replace(/<link rel="canonical"[^>]*>/,'')
 html=html.replace('</head>',tags.map(([key,name,value])=>'<meta '+key+'="'+name+'" content="'+escape(value)+'">').join('\n')+'<link rel="canonical" href="'+url+'"></head>')
 const links=Object.entries(pages).map(([route,p])=>'<a href="'+route+'">'+escape(p.title[0])+'</a>').join(' · ')
 html=html.replace('<div id="root"></div>','<div id="root"></div><noscript><main><h1>'+escape(page.title[0])+'</h1><p>'+escape(page.description[0])+'</p><nav>'+links+'</nav></main></noscript>')
 const folder=path==='/'?'dist':resolve('dist',path.slice(1));await mkdir(folder,{recursive:true});await writeFile(resolve(folder,'index.html'),html)
}
await writeFile('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+Object.keys(pages).map(path=>'<url><loc>'+site+(path==='/'?'/':path+'/')+'</loc></url>').join('')+'</urlset>')
console.log('SEO: generated '+Object.keys(pages).length+' route pages and sitemap.')
