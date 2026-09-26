import { useEffect } from 'react'
import { navigate, useRoute } from './router'
import { StoreProvider, useStore } from './store'
import { Home } from './screens/Home'
import { Insured, Profile, Wip } from './screens/Profile'
import { TabBar } from './ui/Screen'

// Экраны с нижней панелью. Остальные — пошаговые сценарии, где панель мешает.
const tabbed: Record<string, string> = {
  '/home': 'home',
  '/profile': 'home',
  '/activities': 'home',
  '/policies': 'home',
  '/program': 'home',
  '/finances': 'home',
  '/franchise': 'home',
  '/gp': 'home',
  '/contacts': 'home',
  '/clinics': 'clinics',
  '/wip': '',
}

function Start() {
  const { notes, setNotes } = useStore()
  const tasks = [
    { n: 1, t: 'Первый вход', to: '/login' },
    { n: 2, t: 'Запись к врачу', to: '/booking' },
    { n: 3, t: 'Профиль и запись ребёнка', to: '/home' },
    { n: 4, t: 'Гарантийное письмо', to: '/home' },
    { n: 5, t: 'Франшиза: сколько списали', to: '/home' },
  ]
  return (
    <div className="min-h-full bg-white px-5 pb-10 pt-14">
      <div className="zt-gradient mb-5 rounded-3xl p-5 text-white">
        <div className="text-[13px] opacity-85">UsabilityLab · по итогам тестирования 21–25.09</div>
        <h1 className="mt-1 text-[24px] font-bold leading-tight">MyZetta: прототип с исправленной логикой</h1>
      </div>
      <p className="text-[14px] leading-snug text-zt-text2">
        Визуальный стиль прототипа 65apps сохранён, изменена логика по находкам сводного отчёта. Задания — те же, что на тестировании.
      </p>
      <div className="mt-5 divide-y divide-zt-stroke overflow-hidden rounded-2xl shadow-zt-card">
        {tasks.map((t) => (
          <button key={t.n} onClick={() => navigate(t.to)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zt-mint text-[14px] font-bold text-zt-accent">{t.n}</span>
            <span className="flex-1 text-[15px] font-medium">{t.t}</span>
          </button>
        ))}
      </div>
      <label className="mt-5 flex items-center justify-between rounded-2xl bg-[#f5f3ff] px-4 py-3.5">
        <span>
          <span className="block text-[15px] font-medium">Показывать изменения</span>
          <span className="block text-[12.5px] text-zt-text2">Фиолетовые значки ✎: что поменяли и почему</span>
        </span>
        <input type="checkbox" checked={notes} onChange={(e) => setNotes(e.target.checked)} className="h-5 w-5 accent-[#7c3aed]" />
      </label>
      <button onClick={() => navigate('/home')} className="mt-5 h-12 w-full rounded-full bg-zt-accent text-[16px] font-semibold text-white">Открыть главную</button>
    </div>
  )
}

function Screens() {
  const { path, params } = useRoute()
  useEffect(() => {
    document.getElementById('screen-scroll')?.scrollTo(0, 0)
  }, [path])

  let screen
  switch (path) {
    case '/start':
      screen = <Start />
      break
    case '/home':
      screen = <Home />
      break
    case '/profile':
      screen = <Profile />
      break
    case '/insured':
      screen = <Insured />
      break
    case '/wip':
      screen = <Wip title={params.get('t') || 'Раздел'} />
      break
    default:
      // Этапы 2–4 ещё впереди: любой непостроенный маршрут ведёт на заглушку с рабочим «назад»
      screen = <Wip title="Скоро в прототипе" />
  }
  const tab = tabbed[path]

  return (
    <div className="relative h-full overflow-hidden">
      <div id="screen-scroll" className="no-scrollbar h-full overflow-y-auto">{screen}</div>
      {tab !== undefined && <TabBar active={tab} />}
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <div className="flex min-h-full items-center justify-center sm:py-3">
        <div className="relative h-[100dvh] w-full overflow-hidden bg-white sm:h-[min(844px,calc(100dvh-24px))] sm:w-[390px] sm:rounded-[44px] sm:shadow-2xl sm:ring-8 sm:ring-[#1b1f24]">
          <Screens />
          <div id="note-layer" />
        </div>
      </div>
    </StoreProvider>
  )
}
