import { useEffect, useState } from 'react'
import { navigate } from '../router'
import { useStore } from '../store'
import { Icon } from '../ui/Icon'

// Задания — те же, что в гайде тестирования 21–25.09
export const tasks = [
  { id: 'first-new', n: '1', t: 'Первый вход: новый пользователь', s: 'Регистрация по номеру полиса, код быстрого входа', to: '/register' },
  { id: 'first', n: '1', t: 'Первый вход: вход по паролю', s: 'Пароль, код быстрого входа, главная', to: '/login' },
  { id: 'booking', n: '2', t: 'Записаться к хирургу', s: 'Клиника, врач, время, жалобы', to: '/home' },
  { id: 'profile', n: '3', t: 'Профиль и застрахованные', s: 'Переключиться на ребёнка, его полис и запись', to: '/home' },
  { id: 'gp', n: '4', t: 'Гарантийное письмо', s: 'На главной нет заявок на письмо', to: '/home', noGp: true },
  { id: 'franchise', n: '5', t: 'Франшиза', s: 'Сколько списали за приём, вернуть остаток', to: '/home' },
]

// /go?task=…&notes=0 — готовит состояние задания и открывает его первый экран
export function Go({ task, notes }: { task: string; notes: string | null }) {
  const { startTask, setNotes } = useStore()
  useEffect(() => {
    const t = tasks.find((x) => x.id === task)
    startTask({ noGp: t?.noGp })
    if (notes === '0') setNotes(false)
    if (notes === '1') setNotes(true)
    navigate(t?.to ?? '/home', { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task, notes])
  return null
}

function linkFor(id: string, notes: boolean) {
  return `${window.location.origin}${window.location.pathname}#/go?task=${id}${notes ? '' : '&notes=0'}`
}

export function Start() {
  const { notes, setNotes } = useStore()
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (id: string) => {
    try {
      await navigator.clipboard.writeText(linkFor(id, false))
      setCopied(id)
      setTimeout(() => setCopied(null), 1600)
    } catch {
      window.prompt('Ссылка для респондента', linkFor(id, false))
    }
  }
  return (
    <div className="min-h-full bg-white px-5 pb-10 pt-12">
      <div className="zt-gradient mb-5 rounded-3xl p-5 text-white">
        <div className="text-[13px] opacity-85">UsabilityLab · по итогам тестирования 21–25.09.2026</div>
        <h1 className="mt-1 text-[24px] font-bold leading-tight">MyZetta: прототип с исправленной логикой</h1>
      </div>
      <p className="text-[14px] leading-snug text-zt-text2">
        Визуальный стиль прототипа 65apps сохранён, логика изменена по находкам и рекомендациям сводного отчёта. Задания — те же, что на тестировании.
      </p>

      <label className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-[#f5f3ff] px-4 py-3.5">
        <span>
          <span className="block text-[15px] font-medium">Показывать изменения</span>
          <span className="block text-[12.5px] text-zt-text2">Значки <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#7c3aed] align-[-2px] text-[9px] font-bold text-white">✎</span> — что поменяли и почему, со ссылкой на отчёт</span>
        </span>
        <input type="checkbox" checked={notes} onChange={(e) => setNotes(e.target.checked)} className="h-5 w-5 shrink-0 accent-[#7c3aed]" />
      </label>

      <h2 className="mb-2 mt-6 text-[13px] font-semibold uppercase tracking-wide text-zt-text3">Задания</h2>
      <div className="divide-y divide-zt-stroke overflow-hidden rounded-2xl shadow-zt-card">
        {tasks.map((t) => (
          <div key={t.id} className="flex items-center gap-3 px-4 py-3">
            <button onClick={() => navigate('/go?task=' + t.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zt-mint text-[14px] font-bold text-zt-accent">{t.n}</span>
              <span className="min-w-0">
                <span className="block text-[15px] font-medium">{t.t}</span>
                <span className="block text-[12.5px] text-zt-text3">{t.s}</span>
              </span>
            </button>
            <button onClick={() => copy(t.id)} title="Скопировать ссылку для респондента, без пометок" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zt-bg2 text-zt-text2">
              {copied === t.id ? <Icon name="check" size={18} className="text-zt-green" /> : <Icon name="share" size={18} />}
            </button>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[12.5px] text-zt-text3">Кнопка справа копирует ссылку для респондента: задание откроется сразу, без пометок.</p>

      <button onClick={() => navigate('/go?task=free')} className="mt-6 h-12 w-full rounded-full bg-zt-accent text-[16px] font-semibold text-white">Открыть главную</button>
    </div>
  )
}
