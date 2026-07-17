import { useEffect, useMemo, useState } from 'react';
import { Activity, BarChart3, Bot, CheckCircle2, Languages, Menu, Orbit, RotateCcw, Save, Send, Settings, Sparkles, Target, X } from 'lucide-react';
import { INITIAL_QUESTIONS, INITIAL_VALUES_STRATEGIES } from './data';
import type { StrategicQuestion, ValuesStrategy } from './types';
import './standalone.css';

type View = 'lab' | 'copilot' | 'analytics' | 'settings';
type Engine = 'vision' | 'mission' | 'values';
type Lang = 'ar' | 'en';

const KEY = 'straorbit-workspace-v1';
const labels = {
  ar: { lab:'المختبر الاستراتيجي', copilot:'المستشار الذكي', analytics:'التحليلات', settings:'الإعدادات', save:'حفظ', saved:'تم الحفظ', title:'نظام تشغيل الذكاء الاستراتيجي', subtitle:'من الطموح الجماعي إلى استراتيجية قابلة للقياس', vision:'الرؤية', mission:'الرسالة', values:'القيم', answer:'اكتب إجابتك الاستراتيجية هنا...', score:'الجاهزية', complete:'الأسئلة المكتملة', ask:'اكتب سؤالك أو اطلب صياغة استراتيجية...', send:'إرسال', draft:'صياغة مسودة', analyze:'تحليل الفجوات', empty:'ابدأ بسؤال أو اختر إجراءً سريعاً', reset:'إعادة ضبط البيانات', resetHint:'يحذف الإجابات والمسودات المحفوظة محلياً.', categories:'تقدم المحاور', aiMode:'وضع المحرك', simulation:'محاكاة', online:'Gemini', health:'حالة الخدمة', healthy:'تعمل بصورة طبيعية' },
  en: { lab:'Strategy Lab', copilot:'AI Copilot', analytics:'Analytics', settings:'Settings', save:'Save', saved:'Saved', title:'Strategic Intelligence Operating System', subtitle:'From collective ambition to measurable strategy', vision:'Vision', mission:'Mission', values:'Values', answer:'Write your strategic answer here...', score:'Readiness', complete:'Completed questions', ask:'Ask a question or request a strategic formulation...', send:'Send', draft:'Generate draft', analyze:'Gap analysis', empty:'Ask a question or choose a quick action', reset:'Reset workspace', resetHint:'Deletes locally saved answers and drafts.', categories:'Category progress', aiMode:'Engine mode', simulation:'Simulation', online:'Gemini', health:'Service health', healthy:'Operating normally' }
} as const;

function restore() {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null') as null | { lang?:Lang; view?:View; engine?:Engine; questions?:StrategicQuestion[]; values?:ValuesStrategy[] }; }
  catch { return null; }
}

export default function StandaloneApp() {
  const savedState = useMemo(restore, []);
  const [lang,setLang] = useState<Lang>(savedState?.lang || 'ar');
  const [view,setView] = useState<View>(savedState?.view || 'lab');
  const [engine,setEngine] = useState<Engine>(savedState?.engine || 'vision');
  const [questions,setQuestions] = useState<StrategicQuestion[]>(savedState?.questions || INITIAL_QUESTIONS);
  const [values,setValues] = useState<ValuesStrategy[]>(savedState?.values || INITIAL_VALUES_STRATEGIES);
  const [menu,setMenu] = useState(false);
  const [saved,setSaved] = useState(false);
  const [prompt,setPrompt] = useState('');
  const [result,setResult] = useState('');
  const [loading,setLoading] = useState(false);
  const [health,setHealth] = useState<{aiMode?:string;status?:string}>({});
  const t = labels[lang];
  const isAr = lang === 'ar';

  useEffect(() => { document.documentElement.lang=lang; document.documentElement.dir=isAr?'rtl':'ltr'; }, [lang,isAr]);
  useEffect(() => { fetch('/api/health').then(r=>r.json()).then(setHealth).catch(()=>setHealth({status:'offline'})); }, []);

  const sectionQuestions = questions.filter(q=>q.section===engine);
  const answered = questions.filter(q=>q.answer?.trim()).length;
  const readiness = Math.round((answered / Math.max(questions.length,1))*100);
  const nav = [
    {id:'lab' as View,label:t.lab,icon:Target},
    {id:'copilot' as View,label:t.copilot,icon:Bot},
    {id:'analytics' as View,label:t.analytics,icon:BarChart3},
    {id:'settings' as View,label:t.settings,icon:Settings},
  ];

  function persist() {
    localStorage.setItem(KEY,JSON.stringify({lang,view,engine,questions,values}));
    setSaved(true); window.setTimeout(()=>setSaved(false),1400);
  }
  function updateQuestion(id:string, patch:Partial<StrategicQuestion>) { setQuestions(list=>list.map(q=>q.id===id?{...q,...patch}:q)); }
  function updateValue(id:string, patch:Partial<ValuesStrategy>) { setValues(list=>list.map(v=>v.id===id?{...v,...patch}:v)); }
  function reset() { localStorage.removeItem(KEY); setQuestions(INITIAL_QUESTIONS); setValues(INITIAL_VALUES_STRATEGIES); setResult(''); setPrompt(''); }

  async function callCopilot(action:'ask'|'draft'|'analyze') {
    setLoading(true); setResult('');
    try {
      const response = await fetch('/api/copilot',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,section:engine==='values'?'vision':engine,questions,additionalPrompt:prompt,lang})});
      const data = await response.json();
      if(!response.ok) throw new Error(data.error || 'Request failed');
      setResult(data.result || ''); setView('copilot');
    } catch (error) { setResult(isAr?`تعذر الاتصال بالمحرك: ${String(error)}`:`Unable to reach the engine: ${String(error)}`); }
    finally { setLoading(false); }
  }

  const categoryProgress = useMemo(()=>{
    const map = new Map<string,{total:number;done:number}>();
    questions.forEach(q=>{ const key=isAr?q.category:(q.categoryEn||q.category); const x=map.get(key)||{total:0,done:0}; x.total++; if(q.answer?.trim()) x.done++; map.set(key,x); });
    return [...map.entries()].map(([name,x])=>({name,...x,pct:Math.round(x.done/x.total*100)}));
  },[questions,isAr]);

  const Sidebar = ({mobile=false}:{mobile?:boolean}) => <div className="so-sidebar-card">
    {mobile && <button className="so-close" onClick={()=>setMenu(false)} aria-label="close"><X size={19}/></button>}
    <div className="so-brand"><span><Orbit size={25}/></span><div><strong>STRAORBIT</strong><small>{t.title}</small></div></div>
    <nav>{nav.map(({id,label,icon:Icon})=><button key={id} className={view===id?'active':''} onClick={()=>{setView(id);setMenu(false)}}><Icon size={18}/><span>{label}</span></button>)}</nav>
    <div className="so-side-score"><span>{t.score}</span><strong>{readiness}%</strong><div><i style={{width:`${readiness}%`}}/></div><small>{answered}/{questions.length} {t.complete}</small></div>
  </div>;

  return <div className="so-app">
    <div className="so-grid-bg"/>
    <aside className="so-sidebar"><Sidebar/></aside>
    <header className="so-topbar">
      <button className="so-menu" onClick={()=>setMenu(true)} aria-label="menu"><Menu size={20}/></button>
      <div><strong>{nav.find(n=>n.id===view)?.label}</strong><small>AI STRATEGIC INTELLIGENCE OS</small></div>
      <div className="so-actions"><button onClick={()=>setLang(isAr?'en':'ar')}><Languages size={17}/><span>{isAr?'EN':'عربي'}</span></button><button className="primary" onClick={persist}><Save size={17}/><span>{saved?t.saved:t.save}</span></button></div>
    </header>
    <main className="so-main">
      {view==='lab' && <div className="so-layout">
        <section className="so-stack">
          <article className="so-hero"><div><span>STRAORBIT LAB / 01</span><h1>{t.title}</h1><p>{t.subtitle}</p></div><div className="so-orbit-score"><Sparkles size={21}/><strong>{readiness}%</strong><small>{t.score}</small></div></article>
          <div className="so-tabs">{(['vision','mission','values'] as Engine[]).map(id=><button key={id} className={engine===id?'active':''} onClick={()=>setEngine(id)}>{t[id]}</button>)}</div>
          {engine==='values' ? <div className="so-values">{values.map((v,i)=><article className="so-card" key={v.id}><span className="so-index">0{i+1}</span><input value={isAr?v.title:(v.titleEn||v.title)} onChange={e=>updateValue(v.id,isAr?{title:e.target.value}:{titleEn:e.target.value})}/><textarea value={isAr?v.description:(v.descriptionEn||v.description)} onChange={e=>updateValue(v.id,isAr?{description:e.target.value}:{descriptionEn:e.target.value})}/><small>{isAr?v.priority:(v.priorityEn||v.priority)}</small></article>)}</div> : <div className="so-questions">{sectionQuestions.map((q,i)=><article className="so-card" key={q.id}><div className="so-question-head"><span>0{i+1}</span><div><small>{isAr?q.category:(q.categoryEn||q.category)}</small><h3>{isAr?q.text:(q.textEn||q.text)}</h3></div><CheckCircle2 size={19}/></div><textarea placeholder={t.answer} value={q.answer||''} onChange={e=>updateQuestion(q.id,{answer:e.target.value})}/><div className="so-rating"><span>{isAr?'درجة الوضوح':'Clarity'}</span>{[1,2,3,4,5].map(n=><button className={q.rating===n?'active':''} key={n} onClick={()=>updateQuestion(q.id,{rating:n})}>{n}</button>)}</div></article>)}</div>}
        </section>
        <aside className="so-rail"><article className="so-metric"><span>{t.complete}</span><strong>{answered}</strong><small>{questions.length} TOTAL</small><div><i style={{width:`${readiness}%`}}/></div></article><article className="so-copilot-card"><Bot size={23}/><h3>{t.copilot}</h3><p>{isAr?'صياغة وتحليل استراتيجي فوري اعتماداً على مدخلات الورشة.':'Instant strategy drafting and analysis based on workshop inputs.'}</p><button onClick={()=>callCopilot('draft')}>{t.draft}</button><button className="ghost" onClick={()=>callCopilot('analyze')}>{t.analyze}</button></article><article className="so-status"><Activity size={19}/><div><strong>{t.health}</strong><small>{health.status==='ok'?t.healthy:(isAr?'غير متصل':'Offline')}</small></div><b>{health.aiMode==='gemini'?t.online:t.simulation}</b></article></aside>
      </div>}
      {view==='copilot' && <section className="so-page"><div className="so-heading"><span><Bot size={24}/></span><div><small>AI STRATEGIC ADVISOR</small><h1>{t.copilot}</h1></div></div><div className="so-compose"><textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder={t.ask}/><button disabled={loading} onClick={()=>callCopilot('ask')}>{loading?<span className="so-spinner"/>:<Send size={18}/>} {t.send}</button></div><div className="so-quick"><button onClick={()=>callCopilot('draft')}>{t.draft}</button><button onClick={()=>callCopilot('analyze')}>{t.analyze}</button></div><div className="so-output">{result?<pre>{result}</pre>:<div><Sparkles size={42}/><p>{t.empty}</p></div>}</div></section>}
      {view==='analytics' && <section className="so-page"><div className="so-heading"><span><BarChart3 size={24}/></span><div><small>REAL-TIME WORKSHOP SIGNALS</small><h1>{t.analytics}</h1></div></div><div className="so-analytics"><article><span>{t.score}</span><strong>{readiness}%</strong></article><article><span>{t.complete}</span><strong>{answered}</strong></article><article><span>{isAr?'القيم المؤسسية':'Core values'}</span><strong>{values.length}</strong></article></div><h2>{t.categories}</h2><div className="so-category-list">{categoryProgress.map(c=><article key={c.name}><div><span>{c.name}</span><b>{c.pct}%</b></div><div><i style={{width:`${c.pct}%`}}/></div></article>)}</div></section>}
      {view==='settings' && <section className="so-page"><div className="so-heading"><span><Settings size={24}/></span><div><small>WORKSPACE CONTROL</small><h1>{t.settings}</h1></div></div><div className="so-setting"><Languages size={20}/><div><strong>{isAr?'لغة الواجهة':'Interface language'}</strong><small>{isAr?'العربية':'English'}</small></div><button onClick={()=>setLang(isAr?'en':'ar')}>{isAr?'English':'العربية'}</button></div><div className="so-setting"><Activity size={20}/><div><strong>{t.aiMode}</strong><small>{health.aiMode==='gemini'?t.online:t.simulation}</small></div><b>{health.status==='ok'?'ONLINE':'OFFLINE'}</b></div><div className="so-setting danger"><RotateCcw size={20}/><div><strong>{t.reset}</strong><small>{t.resetHint}</small></div><button onClick={reset}>{t.reset}</button></div></section>}
    </main>
    {menu && <div className="so-overlay" onClick={()=>setMenu(false)}><div onClick={e=>e.stopPropagation()}><Sidebar mobile/></div></div>}
  </div>;
}
