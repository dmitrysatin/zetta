import { useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useStore } from '../store'

// Пометка «что поменяли и почему». Видна только при включённом режиме изменений.
// Значок стоит внутри элемента, чтобы его не срезали контейнеры с overflow-hidden,
// а пояснение открывается карточкой поверх всего кадра — ширина соседей на него не влияет.

// at: 'in' — внутри правого верхнего угла; 'out-left' / 'out-right' — снаружи, над углом
// (для мелких элементов, где значок закрыл бы текст).
const pos = {
  in: 'right-1 top-1',
  'out-left': '-left-2 -top-2',
  'out-right': '-right-2 -top-2',
}

export function Note({ what, finding, children, className = '', at = 'in' }: {
  what: string
  finding: string
  children?: ReactNode
  className?: string
  at?: keyof typeof pos
}) {
  const { notes } = useStore()
  const [open, setOpen] = useState(false)
  if (!notes) return <>{children}</>
  const layer = document.getElementById('note-layer')
  return (
    <div className={'relative ' + className}>
      {children}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}
        className={"absolute z-20 " + pos[at] + " flex h-5 w-5 items-center justify-center rounded-full bg-[#7c3aed] text-[10px] font-bold text-white shadow ring-2 ring-white"}
        aria-label="Что изменено"
      >
        ✎
      </button>
      {open &&
        layer &&
        createPortal(
          <div onClick={() => setOpen(false)} className="absolute inset-0 z-50 flex items-end bg-black/35 p-3 pb-24">
            <div onClick={(e) => e.stopPropagation()} className="w-full rounded-3xl bg-[#2e1065] p-4 text-left text-[14px] leading-snug text-white shadow-2xl">
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#c4b5fd]">Что изменено</div>
              <div>{what}</div>
              <div className="mt-3 border-t border-white/15 pt-3 text-[13px] text-[#ddd6fe]">{finding}</div>
              <button onClick={() => setOpen(false)} className="mt-4 h-10 w-full rounded-full bg-white/15 text-[14px] font-semibold">Понятно</button>
            </div>
          </div>,
          layer,
        )}
    </div>
  )
}
