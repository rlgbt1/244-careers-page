import {useRef} from 'react'
import {motion, useReducedMotion, useScroll, useTransform} from 'motion/react'

export function CalendarIllustration(){
 const reduce=useReducedMotion()
 return <svg className="career-calendar-art" viewBox="0 0 240 180" aria-hidden="true">
  <rect x="25" y="24" width="190" height="140" rx="12" fill="var(--ivory)" stroke="var(--forest-mid)"/>
  <path d="M25 65h190" stroke="var(--forest-mid)"/><path d="M70 14v24m100-24v24" stroke="var(--forest-mid)" strokeWidth="6" strokeLinecap="round"/>
  {Array.from({length:21},(_,i)=><motion.rect key={i} x={44+(i%7)*23} y={80+Math.floor(i/7)*25} width="14" height="14" rx="3" fill={i===10?'var(--forest-mid)':'var(--sage-light)'} initial={reduce?false:{opacity:0,scale:.7}} whileInView={{opacity:1,scale:1}} transition={{delay:reduce?0:i*.025,duration:.25}} viewport={{once:true}}/>)}
  <motion.path d="m112 111 4 4 7-9" fill="none" stroke="var(--ivory)" strokeWidth="2" initial={reduce?false:{pathLength:0}} whileInView={{pathLength:1}} transition={{delay:reduce?0:.6,duration:.3}} viewport={{once:true}}/>
 </svg>
}

export default function OpeningBook(){
 const reduce=useReducedMotion()
 const book=useRef<HTMLDivElement>(null)
 const {scrollYProgress}=useScroll({target:book,offset:['start 0.9','start 0.55']})
 const rotateY=useTransform(scrollYProgress,[0,.15,1],[0,0,-180])
 const x=useTransform(scrollYProgress,[0,.15,1],['-25%','-25%','0%'])
 return <div ref={book} className="career-book" aria-hidden="true"><motion.div className="career-book-spread" style={{x:reduce?'0%':x}}>
  <div className="career-book-page career-book-right"><span>CAREERS</span><i/><i/><i/><i/></div>
  <motion.div className="career-book-leaf" style={{rotateY:reduce?-180:rotateY}}>
   <div className="career-book-cover"><img src="/assets/logo.png" width="84" height="84" alt=""/><small>244 CAREERS</small></div>
   <div className="career-book-page career-book-inside"><span>244</span><i/><i/><i/><i/></div>
  </motion.div>
 </motion.div></div>
}

export function TipIcon({index,animated=false}:{index:number,animated?:boolean}){
 const reduce=useReducedMotion()
 const paths=[
  'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6M3 20v-2a6 6 0 0 1 12 0v2M17 5a3 3 0 0 1 0 6m1 3a5 5 0 0 1 3 4v2',
  'M3 6h18v13H3zM3 6l9 7 9-7M7 3h10',
  'M4 5h16v16H4zM8 3v4m8-4v4M4 10h16M8 15l3 3 5-5',
  'M5 3h14v18H5zM9 7h6M9 12l1 1 2-2M9 17l1 1 2-2M15 12h1m-1 5h1'
 ]
 return <motion.svg className={animated?'career-tip-icon is-large':'career-tip-icon'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" initial={animated&&!reduce?{y:8,rotate:-8}:false} animate={{y:0,rotate:0}} transition={{duration:.5}}><motion.path d={paths[index]} initial={animated&&!reduce?{pathLength:0}:false} animate={{pathLength:1}} transition={{duration:reduce?0:.85}}/></motion.svg>
}
