import type { ReactNode } from 'react'
import { franchise, rub } from '../data'
import { goBack, navigate } from '../router'
import { useStore } from '../store'
import { Icon } from './Icon'
import { Note } from './Note'

export function StatusBar({ dark = false }: { dark?: boolean }) {
  return (
    <div className={'flex h-11 items-center justify-between px-7 text-[15px] font-semibold ' + (dark ? 'text-zt-text' : 'text-white')}>
      <span>9:41</span>
      <span className="flex items-center gap-1.5">
        <svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="5" y="5" width="3" height="6" rx="1" /><rect x="10" y="2.5" width="3" height="8.5" rx="1" /><rect x="15" y="0" width="3" height="11" rx="1" /></svg>
        <svg width="24" height="11" viewBox="0 0 24 11" fill="none"><rect x=".5" y=".5" width="21" height="10" rx="3" stroke="currentColor" opacity=".5" /><rect x="2" y="2" width="18" height="7" rx="1.8" fill="currentColor" /></svg>
      </span>
    </div>
  )
}

// Шапка приложения: аватар ведёт в профиль, имя со стрелкой — выбор застрахованного,
// чип франшизы — сразу в раздел франшизы с текущим балансом.
export function AppHeader() {
  const { person } = useStore()
  return (
    <div className="flex items-center gap-3 px-4 pb-4 pt-1">
      <Note
        at="out-left"
        what="Вход в профиль отделён от выбора застрахованного: аватар с подписью «Профиль» ведёт в профиль, имя со стрелкой открывает список застрахованных."
        finding="Отчёт, тема 2: шестеро из семи с трудом находили дорогу в профиль или к полису. Рекомендация 2."
      >
        <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-0.5">
          <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-zt-accent">
            <Icon name="user" size={24} />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-zt-red px-1 text-[10px] font-bold text-white">4</span>
          </span>
          <span className="text-[10px] font-medium text-white/90">Профиль</span>
        </button>
      </Note>
      <button onClick={() => navigate('/insured')} className="min-w-0 flex-1 text-left text-white">
        <div className="flex items-center gap-1 text-[17px] font-semibold leading-tight">
          <span className="truncate">{person.short}</span>
          <Icon name="down" size={18} />
        </div>
        <div className="text-[12px] text-white/80">
          {person.relation === 'Вы' ? 'Вы' : person.relation} · {person.policy}
        </div>
      </button>
      <Note
        at="out-left"
        what="На чипе видно, сколько осталось на депозите франшизы; нажатие сразу открывает раздел франшизы, без промежуточного меню."
        finding="Отчёт, тема 1: сколько списали, без помощи узнала одна из семи. Остаток на чипе — наше дополнение к рекомендации 1."
      >
        <button
          onClick={() => navigate('/franchise')}
          className="flex flex-col items-end rounded-2xl border border-white/60 bg-white/15 px-3 py-1 text-white"
        >
          <span className="text-[10px] leading-tight text-white/85">Франшиза</span>
          <span className="text-[13px] font-semibold leading-tight">{rub(franchise.balance)}</span>
        </button>
      </Note>
    </div>
  )
}

// Экран-лист: градиентная шапка, белый лист со скруглением, заголовок, назад/закрыть.
export function Sheet({ title, children, back = true, close = false, footer, header = true, fallback = '/home' }: {
  title?: string
  children: ReactNode
  back?: boolean
  close?: boolean
  footer?: ReactNode
  header?: boolean
  fallback?: string
}) {
  return (
    <div className="flex min-h-full flex-col">
      <div className="zt-gradient">
        <StatusBar />
        {header && <AppHeader />}
      </div>
      <div className="zt-gradient flex flex-1 flex-col">
        <div className="flex flex-1 flex-col rounded-t-[28px] bg-white">
          {title !== undefined && (
            <div className="sticky top-0 z-10 flex h-14 items-center rounded-t-[28px] bg-white px-2">
              <div className="w-11">
                {back && (
                  <button onClick={() => goBack(fallback)} className="flex h-11 w-11 items-center justify-center" aria-label="Назад">
                    <Icon name="back" />
                  </button>
                )}
              </div>
              <h1 className="flex-1 text-center text-[19px] font-bold">{title}</h1>
              <div className="w-11">
                {close && (
                  <button onClick={() => navigate('/home')} className="flex h-11 w-11 items-center justify-center" aria-label="На главную">
                    <Icon name="close" />
                  </button>
                )}
              </div>
            </div>
          )}
          <div className="flex-1 px-4 pb-32">{children}</div>
          {footer && <div className="sticky bottom-24 px-4 pb-3">{footer}</div>}
        </div>
      </div>
    </div>
  )
}

const tabs = [
  { id: 'home', label: 'Главная', icon: 'home', to: '/home' },
  { id: 'chat', label: 'Чат', icon: 'chat', to: '/wip?t=Чат' },
  { id: 'sos', label: 'SOS', icon: 'siren', to: '/wip?t=SOS' },
  { id: 'clinics', label: 'Клиники', icon: 'pin', to: '/clinics' },
  { id: 'med', label: 'Медкарта', icon: 'folder', to: '/wip?t=Медкарта' },
]

export function TabBar({ active }: { active: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 px-3 pb-4">
      <div className="pointer-events-auto flex h-16 items-center justify-around rounded-[28px] bg-white shadow-zt-actions">
        {tabs.map((t) =>
          t.id === 'sos' ? (
            <button key={t.id} onClick={() => navigate(t.to)} className="-mt-5 flex h-16 w-16 flex-col items-center justify-center rounded-full bg-zt-accent text-white shadow-lg ring-4 ring-white">
              <Icon name={t.icon} size={24} />
              <span className="text-[11px] font-bold">SOS</span>
            </button>
          ) : (
            <button
              key={t.id}
              onClick={() => navigate(t.to)}
              className={'flex w-14 flex-col items-center gap-0.5 text-[11px] font-medium ' + (active === t.id ? 'text-zt-accent' : 'text-zt-inactive')}
            >
              <Icon name={t.icon} size={24} />
              {t.label}
            </button>
          ),
        )}
      </div>
    </div>
  )
}

// Карточки и строки списка в стиле 65apps
export function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  const C = onClick ? 'button' : 'div'
  return (
    <C onClick={onClick} className={'block w-full rounded-2xl bg-white text-left shadow-zt-card ' + className}>
      {children}
    </C>
  )
}

export function Row({ icon, title, sub, right, onClick, danger }: {
  icon?: string
  title: ReactNode
  sub?: ReactNode
  right?: ReactNode
  onClick?: () => void
  danger?: boolean
}) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
      {icon && <span className={danger ? 'text-zt-red' : 'text-zt-accent'}><Icon name={icon} /></span>}
      <span className="min-w-0 flex-1">
        <span className={'block text-[15px] font-medium ' + (danger ? 'text-zt-red' : '')}>{title}</span>
        {sub && <span className="block text-[13px] text-zt-text3">{sub}</span>}
      </span>
      {right}
      <Icon name="chevron" size={18} className="text-zt-text3" />
    </button>
  )
}

export function Group({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="mt-5">
      {title && <h2 className="mb-2 text-[17px] font-semibold">{title}</h2>}
      <div className="divide-y divide-zt-stroke overflow-hidden rounded-2xl bg-white shadow-zt-card">{children}</div>
    </section>
  )
}

export function Button({ children, onClick, variant = 'primary', className = '' }: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
}) {
  const v = {
    primary: 'bg-zt-accent text-white',
    secondary: 'bg-zt-mint text-zt-accent',
    ghost: 'bg-transparent text-zt-accent',
  }[variant]
  return (
    <button onClick={onClick} className={'h-12 w-full rounded-full text-[16px] font-semibold ' + v + ' ' + className}>
      {children}
    </button>
  )
}
