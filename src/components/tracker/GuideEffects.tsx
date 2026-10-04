import { useRef, useState, type ReactNode } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'

/* Adapted from Aceternity's sticky-scroll-reveal, lamp and parallax-scroll
   patterns: https://ui.aceternity.com/components/sticky-scroll-reveal
   https://ui.aceternity.com/components/lamp-effect
   https://ui.aceternity.com/components/parallax-scroll
   Project CSS replaces Tailwind. Page scrolling avoids a nested scroll trap. */
export function StickyScroll({items,visual,inlineOnMobile=false}:{items:ReactNode[];visual:(active:number)=>ReactNode;inlineOnMobile?:boolean}){
 const ref=useRef<HTMLDivElement>(null)
 const [active,setActive]=useState(0)
 const {scrollYProgress}=useScroll({target:ref,offset:['start center','end center']})
 useMotionValueEvent(scrollYProgress,'change',()=>{
  const sections=ref.current?.querySelectorAll<HTMLElement>('.tk-reveal-item')
  if(!sections)return
  let nearest=0,distance=Infinity
  sections.forEach((el,i)=>{const d=Math.abs(el.getBoundingClientRect().top-window.innerHeight*.35);if(d<distance){nearest=i;distance=d}})
  setActive(nearest)
 })
 return <div className={'tk-process-grid tk-sticky-reveal'+(inlineOnMobile?' tk-inline-mobile':'')} ref={ref}><div className="tk-process-sticky">{visual(active)}</div><div className="tk-process-stages">{items.map((item,i)=><div className={'tk-reveal-item '+(active===i?'is-active':'')} key={i}>{inlineOnMobile&&<div className="tk-mobile-stage-visual">{visual(i)}</div>}{item}</div>)}</div></div>
}
export function Lamp(){
 const reduce=useReducedMotion()
 return <div className="tk-aceternity-lamp" aria-hidden="true">
 <motion.div className="tk-lamp-cones" initial={reduce?false:{scaleX:.5,opacity:.2}} whileInView={{scaleX:1,opacity:1}} viewport={{once:true,amount:.25}} transition={{duration:.8,ease:'easeInOut'}}><i/><i/></motion.div>
 <motion.div className="tk-lamp-line" initial={reduce?false:{scaleX:.4}} whileInView={{scaleX:1}} viewport={{once:true}} transition={{duration:.8}}/>
 </div>
}
export function ParallaxScroll({images,onOpen,label}:{images:{src:string;page:number}[];onOpen:(page:number)=>void;label:string}){
 const ref=useRef<HTMLDivElement>(null),reduce=useReducedMotion()
 const {scrollYProgress}=useScroll({target:ref,offset:['start end','end start']})
 const up=useTransform(scrollYProgress,[0,1],[35,-35]),down=useTransform(scrollYProgress,[0,1],[-35,35])
 return <div className="tk-document-parallax" ref={ref}>{images.map((im,i)=><motion.button key={im.page} style={{y:reduce?0:i%2?down:up}} onClick={()=>onOpen(im.page)} aria-label={label+' '+im.page}><img src={im.src} width="1012" height="1432" loading="lazy" alt=""/><span>CV 101 / {String(im.page).padStart(2,'0')} ↗</span></motion.button>)}</div>
}
