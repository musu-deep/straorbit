import { useCallback, useEffect, useMemo, useState } from 'react';
import { BookOpen, Command, Languages, Menu, Orbit, Save, Settings, Sparkles, X } from 'lucide-react';
import AnalyticsSection from './components/AnalyticsDashboard';
import CommandCenter from './components/CommandCenter';
import CopilotPanel from './components/CopilotPanel';
import DashboardSidebar from './components/DashboardSidebar';
import DashboardStats from './components/DashboardStats';
import EntitiesManagement from './components/EntitiesManager';
import HelpSection from './components/HelpCenter';
import QuestionWizard from './components/QuestionWizard';
import SettingsPanel from './components/SettingsPanel';
import UsersManagement from './components/UserManagement';
import ValuesEngine from './components/ValuesEngine';
import WorkshopSession from './components/WorkshopSession';
import WorkshopsManagement from './components/WorkshopsManager';
import { INITIAL_PARTICIPANTS, INITIAL_QUESTIONS, INITIAL_VALUES_STRATEGIES } from './data';
import type { AppView, StrategicQuestion, ValuesStrategy } from './types';

const STORAGE_KEY = 'straorbit.workspace.v1';
const languageText = {
  ar: {
    lab: 'المختبر الاستراتيجي',
    command: 'مركز القيادة',
    users: 'إدارة المستخدمين',
    entities: 'الكيانات',
    workshops: 'الورش',
    analytics: 'التحليلات',
    settings: 'الإعدادات',
    help: 'المساعدة',
    save: 'حفظ الجلسة',
    saved: 'تم حفظ الجلسة',
    subtitle: 'نظام تشغيل الذكاء الاستراتيجي',
    vision: 'الرؤية',
    mission: 'الرسالة',
    values: 'القيم',
  },
  en: {
    lab: 'Strategy Lab',
    command: 'Command Center',
    users: 'Users',
    entities: 'Entities',
    workshops: 'Workshops',
    analytics: 'Analytics',
    settings: 'Settings',
    help: 'Help',
    save: 'Save session',
    saved: 'Session saved',
    subtitle: 'Strategic Intelligence Operating System',
    vision: 'Vision',
    mission: 'Mission',
    values: 'Values',
  },
} as const;

function loadWorkspace() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as {
      questions?: StrategicQuestion[];
      values?: ValuesStrategy[];
      lang?: 'ar' | 'en';
      view?: AppView;
      engine?: 'vision' | 'mission' | 'values';
    };
  } catch {
    return null;
  }
}

export default function App() {
  const restored = useMemo(loadWorkspace, []);
  const [lang, setLang] = useState<'ar' | 'en'>(restored?.lang ?? 'ar');
  const [view, setView] = useState<AppView>(restored?.view ?? 'lab');
  const [engine, setEngine] = useState<'vision' | 'mission' | 'values'>(restored?.engine ?? 'vision');
  const [questions, setQuestions] = useState<StrategicQuestion[]>(restored?.questions ?? INITIAL_QUESTIONS);
  const [strategies, setStrategies] = useState<ValuesStrategy[]>(restored?.values ?? INITIAL_VALUES_STRATEGIES);
  const [logs, setLogs] = useState<string[]>([]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [saved, setSaved] = useState(false);
  const t = languageText[lang];
  const isAr = lang === 'ar';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
  }, [isAr, lang]);

  const addLog = useCallback((message: string) => {
    setLogs((current) => [message, ...current].slice(0, 10));
  }, []);

  const updateQuestion = useCallback((id: string, patch: Partial<StrategicQuestion>) => {
    setQuestions((current) => current.map((question) => question.id === id ? { ...question, ...patch } : question));
  }, []);

  const saveWorkspace = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ questions, values: strategies, lang, view, engine }));
    setSaved(true);
    addLog(isAr ? 'تم حفظ بيانات الجلسة محليًا.' : 'Workspace saved locally.');
    window.setTimeout(() => setSaved(false), 1800);
  }, [addLog, engine, isAr, lang, questions, strategies, view]);

  const navItems: Array<{ id: AppView; label: string; icon: typeof Orbit }> = [
    { id: 'lab', label: t.lab, icon: Orbit },
    { id: 'command', label: t.command, icon: Command },
    { id: 'analytics', label: t.analytics, icon: Sparkles },
    { id: 'settings', label: t.settings, icon: Settings },
    { id: 'help', label: t.help, icon: BookOpen },
  ];

  const renderLab = () => (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="space-y-5">
        <DashboardStats questions={questions} lang={lang} />
        <div className="rounded-[28px] border border-white/10 bg-slate-950/55 p-4 shadow-2xl backdrop-blur-2xl md:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">STRAORBIT LAB</p>
              <h2 className="mt-1 text-2xl font-black text-white">{t[engine]}</h2>
            </div>
            <div className="flex rounded-2xl border border-white/10 bg-black/25 p-1">
              {(['vision', 'mission', 'values'] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setEngine(item)}
                  className={`rounded-xl px-4 py-2 text-sm font-bold transition ${engine === item ? 'bg-cyan-400 text-slate-950' : 'text-slate-300 hover:text-white'}`}
                >
                  {t[item]}
                </button>
              ))}
            </div>
          </div>

          {engine === 'values' ? (
            <ValuesEngine onAddLog={addLog} lang={lang} strategies={strategies} onStrategiesChange={setStrategies} />
          ) : (
            <QuestionWizard
              questions={questions}
              section={engine}
              onUpdateQuestion={updateQuestion}
              onAddLog={addLog}
              lang={lang}
            />
          )}
        </div>
      </section>

      <aside className="space-y-5">
        <CopilotPanel questions={questions} section={engine} onAddLog={addLog} lang={lang} />
        <WorkshopSession participants={INITIAL_PARTICIPANTS} logs={logs} lang={lang} />
      </aside>
    </div>
  );

  const renderView = () => {
    switch (view) {
      case 'command': return <CommandCenter onAddLog={addLog} lang={lang} />;
      case 'users': return <UsersManagement onAddLog={addLog} lang={lang} />;
      case 'entities': return <EntitiesManagement onAddLog={addLog} lang={lang} />;
      case 'workshops': return <WorkshopsManagement onAddLog={addLog} lang={lang} />;
      case 'analytics': return <AnalyticsSection questions={questions} lang={lang} />;
      case 'settings': return <SettingsPanel onAddLog={addLog} lang={lang} />;
      case 'help': return <HelpSection lang={lang} />;
      default: return renderLab();
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-48 h-[34rem] w-[34rem] rounded-full bg-cyan-500/15 blur-[120px]" />
        <div className="absolute -bottom-52 right-0 h-[38rem] w-[38rem] rounded-full bg-indigo-500/15 blur-[130px]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.08)_1px,transparent_1px)] [background-size:54px_54px]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1680px] items-center justify-between gap-4 px-4 py-3 lg:px-7">
          <button className="rounded-xl border border-white/10 p-2 lg:hidden" onClick={() => setMobileMenu(true)} aria-label="Open navigation">
            <Menu size={21} />
          </button>
          <button onClick={() => setView('lab')} className="flex items-center gap-3 text-start">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-indigo-500 text-slate-950 shadow-lg shadow-cyan-500/20">
              <Orbit size={25} strokeWidth={2.4} />
            </span>
            <span>
              <strong className="block text-lg font-black tracking-[0.16em] text-white">STRAORBIT</strong>
              <small className="block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{t.subtitle}</small>
            </span>
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(isAr ? 'en' : 'ar')} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold hover:bg-white/10">
              <Languages size={17} /> {isAr ? 'EN' : 'عربي'}
            </button>
            <button onClick={saveWorkspace} className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-3 py-2 text-xs font-black text-slate-950 hover:bg-cyan-300">
              <Save size={17} /> {saved ? t.saved : t.save}
            </button>
          </div>
        </div>
      </header>

      <div className="relative mx-auto flex max-w-[1680px] gap-5 px-4 py-5 lg:px-7">
        <nav className="hidden w-64 shrink-0 space-y-2 lg:block">
          <DashboardSidebar
            questions={questions}
            onUpdateQuestion={updateQuestion}
            onAddLog={addLog}
            engine={engine}
            lang={lang}
          />
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-2 backdrop-blur-xl">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setView(id)} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${view === id ? 'bg-cyan-400 text-slate-950' : 'text-slate-300 hover:bg-white/8 hover:text-white'}`}>
                <Icon size={18} /> {label}
              </button>
            ))}
          </div>
        </nav>
        <main className="min-w-0 flex-1">{renderView()}</main>
      </div>

      {mobileMenu && (
        <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenu(false)}>
          <aside className={`h-full w-[82%] max-w-sm bg-slate-950 p-4 shadow-2xl ${isAr ? 'mr-auto' : 'ml-auto'}`} onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <strong>STRAORBIT</strong>
              <button className="rounded-xl border border-white/10 p-2" onClick={() => setMobileMenu(false)} aria-label="Close navigation"><X size={20} /></button>
            </div>
            <div className="space-y-2">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => { setView(id); setMobileMenu(false); }} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 font-bold ${view === id ? 'bg-cyan-400 text-slate-950' : 'bg-white/5 text-slate-200'}`}>
                  <Icon size={18} /> {label}
                </button>
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
