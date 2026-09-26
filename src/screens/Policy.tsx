import { useState } from 'react'
import { people } from '../data'
import { navigate } from '../router'
import { useStore } from '../store'
import { Icon } from '../ui/Icon'
import { Note } from '../ui/Note'
import { Button, Sheet } from '../ui/Screen'

export function Policies() {
  const [archive, setArchive] = useState(false)
  return (
    <Sheet title="Полисы и архив" close>
      <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-zt-text3">Действующие</h2>
      <div className="space-y-2.5">
        {people.map((p) => (
          <button key={p.id} onClick={() => navigate('/policy?id=' + p.id)} className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-zt-card">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zt-mint text-zt-accent"><Icon name="shield" size={20} /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold">{p.policy}</span>
              <span className="block text-[13px] text-zt-text3">{p.short} · до {p.validTill}</span>
            </span>
            <span className="text-[13px] font-semibold text-zt-accent">Открыть</span>
          </button>
        ))}
      </div>
      <button onClick={() => setArchive((v) => !v)} className="mt-5 flex w-full items-center justify-between py-2 text-[13px] font-semibold uppercase tracking-wide text-zt-text3">
        Архив · 1 полис <Icon name="down" size={16} className={archive ? 'rotate-180' : ''} />
      </button>
      {archive && (
        <div className="flex w-full items-center gap-3 rounded-2xl bg-zt-bg2 p-4 text-left">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zt-text3"><Icon name="shield" size={20} /></span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold text-zt-text2">ДМС-6620-0042</span>
            <span className="block text-[13px] text-zt-text3">{people[0].short} · закончился 08.01.2026</span>
          </span>
        </div>
      )}
    </Sheet>
  )
}

// Псевдо-QR: детерминированный узор по номеру полиса, для вида экрана
function Qr({ seed }: { seed: string }) {
  const n = 25
  let h = 0
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0
  const cells: boolean[] = []
  for (let i = 0; i < n * n; i++) {
    h = (h * 1103515245 + 12345) >>> 0
    cells.push(((h >> 16) & 1) === 1)
  }
  const finder = (x: number, y: number) => {
    for (const [fx, fy] of [[0, 0], [n - 7, 0], [0, n - 7]]) {
      const dx = x - fx, dy = y - fy
      if (dx >= 0 && dx < 7 && dy >= 0 && dy < 7) {
        return dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4) ? 1 : 0
      }
    }
    return -1
  }
  return (
    <svg viewBox={`0 0 ${n} ${n}`} className="h-44 w-44" shapeRendering="crispEdges">
      {cells.map((on, i) => {
        const x = i % n, y = Math.floor(i / n)
        const f = finder(x, y)
        return (f === 1 || (f === -1 && on)) ? <rect key={i} x={x} y={y} width={1} height={1} fill="#18181b" /> : null
      })}
    </svg>
  )
}

export function Policy({ id }: { id: string | null }) {
  const { person } = useStore()
  const p = people.find((x) => x.id === id) ?? person
  const [shared, setShared] = useState(false)
  return (
    <Sheet title="Полис ДМС" close>
      <Note
        what="«Открыть» показывает полис прямо на экране: номер, срок, программа и QR — чтобы предъявить в клинике. «Поделиться» и «Скачать PDF» — отдельными кнопками."
        finding="Отчёт, тема 6: трое сказали, что в клинике полис показывают с экрана; сейчас «Скачать» открывает системный экран выбора приложения. Рекомендация 7."
      >
        <div className="zt-gradient rounded-3xl p-5 text-white shadow-zt-card">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-[12px] font-semibold">Действует</span>
            <span className="text-[13px] font-semibold opacity-90">Зетта Страхование</span>
          </div>
          <div className="mt-4 text-[13px] opacity-80">Застрахованный</div>
          <div className="text-[18px] font-semibold">{p.name}</div>
          <div className="mt-0.5 text-[13px] opacity-80">Дата рождения {p.birth}</div>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/25 pt-3">
            <div><div className="text-[12px] opacity-75">Номер полиса</div><div className="text-[16px] font-semibold">{p.policy}</div></div>
            <div><div className="text-[12px] opacity-75">Действует до</div><div className="text-[16px] font-semibold">{p.validTill}</div></div>
            <div><div className="text-[12px] opacity-75">Программа</div><div className="text-[16px] font-semibold">«{p.program}»</div></div>
            <div><div className="text-[12px] opacity-75">Страхователь</div><div className="text-[16px] font-semibold">ООО «Компания»</div></div>
          </div>
        </div>
      </Note>
      <div className="mt-4 flex flex-col items-center rounded-3xl bg-white p-4 shadow-zt-card">
        <Qr seed={p.policy} />
        <div className="mt-2 text-[13px] text-zt-text3">Покажите в регистратуре клиники</div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={() => setShared(true)}>
          <span className="flex items-center justify-center gap-2"><Icon name="share" size={18} />Поделиться</span>
        </Button>
        <Button variant="secondary" onClick={() => setShared(true)}>
          <span className="flex items-center justify-center gap-2"><Icon name="doc" size={18} />Скачать PDF</span>
        </Button>
      </div>
      {shared && <div className="mt-3 rounded-2xl bg-zt-bg2 p-3 text-center text-[13px] text-zt-text2">В приложении здесь откроется системное меню</div>}
      <button onClick={() => navigate('/program')} className="mt-4 flex w-full items-center justify-between rounded-2xl bg-zt-mint px-4 py-3.5 text-left">
        <span className="text-[15px] font-semibold">Что входит в программу</span>
        <Icon name="chevron" size={18} className="text-zt-accent" />
      </button>
    </Sheet>
  )
}

const programItems = [
  { t: 'Поликлиника', s: 'Приёмы врачей, анализы, диагностика', ok: true },
  { t: 'Вызов врача на дом', s: 'В пределах МКАД', ok: true },
  { t: 'Онлайн-консультации', s: 'Терапевт и педиатр без ограничений', ok: true },
  { t: 'Скорая помощь', s: 'Круглосуточно', ok: true },
  { t: 'Госпитализация', s: 'Плановая — по гарантийному письму', ok: true },
  { t: 'Стоматология', s: 'В программу не входит', ok: false },
]

export function Program() {
  const { person } = useStore()
  return (
    <Sheet title="Моя программа" close>
      <div className="rounded-3xl bg-zt-mint p-4">
        <div className="text-[13px] text-zt-text2">{person.short} · полис {person.policy}</div>
        <div className="text-[20px] font-bold">Программа «{person.program}»</div>
        <div className="text-[13px] text-zt-text2">Франшиза 15% · до {person.validTill}</div>
      </div>
      <div className="mt-4 divide-y divide-zt-stroke overflow-hidden rounded-2xl bg-white shadow-zt-card">
        {programItems.map((i) => (
          <div key={i.t} className="flex items-center gap-3 px-4 py-3.5">
            <span className={'flex h-7 w-7 items-center justify-center rounded-full ' + (i.ok ? 'bg-zt-mint text-zt-accent' : 'bg-zt-bg2 text-zt-text3')}>
              <Icon name={i.ok ? 'check' : 'close'} size={16} />
            </span>
            <span>
              <span className={'block text-[15px] font-medium ' + (i.ok ? '' : 'text-zt-text3')}>{i.t}</span>
              <span className="block text-[13px] text-zt-text3">{i.s}</span>
            </span>
          </div>
        ))}
      </div>
      <Button variant="secondary" className="mt-4" onClick={() => navigate('/clinics')}>Клиники по программе</Button>
    </Sheet>
  )
}
