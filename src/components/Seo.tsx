import {useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import {useLang} from '../context/LanguageContext'
import {site,pages} from '../content/site'
export default function Seo(){
 const {pathname}=useLocation(),{lang}=useLang()
 useEffect(()=>{
 const path=pathname.replace(/\/+$/,'')||'/',page=pages[path]||pages['/'],i=lang==='pt'?1:0
 document.title=page.title[i]
 const meta=(key:string,value:string,property=false)=>{const attr=property?'property':'name';let el=document.head.querySelector<HTMLMetaElement>('meta['+attr+'="'+key+'"]');if(!el){el=document.createElement('meta');el.setAttribute(attr,key);document.head.append(el)}el.content=value}
 meta('description',page.description[i]);meta('robots',pages[path]?'index,follow':'noindex,follow')
 meta('og:title',page.title[i],true);meta('og:description',page.description[i],true);meta('og:url',site+(path==='/'?'/':path+'/'),true);meta('og:locale',lang==='pt'?'pt_PT':'en_GB',true)
 meta('twitter:title',page.title[i]);meta('twitter:description',page.description[i])
 const link=document.querySelector<HTMLLinkElement>('link[rel="canonical"]');if(link)link.href=site+(path==='/'?'/':path+'/')
 },[pathname,lang]);return null
}
