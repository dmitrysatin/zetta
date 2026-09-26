import { useState } from 'react'
import { people } from '../data'
import { navigate } from '../router'
import { useStore } from '../store'
import { Icon } from '../ui/Icon'
import { Note } from '../ui/Note'
import { Button, Sheet } from '../ui/Screen'
import { ActivityRow, StatusPill } from './Home'

const isActive = (s: string) => s === 'upcoming' || s === 'review' || s === 'ready'

// Все записи и заявки семьи с фильтром. Экстренное — отдельной плашкой, только когда оно есть.
export function Activities() {
  const { activities } = useStore()
  const [tab, setTab] = useState<'active' | 'done'>('active')
  const emergency = activities.filter((a) => a.kind === 'emergency' && isActive(a.status))
  const list = activities.filter((a) => a.kind !== 'emergency' && (tab === 'active' ? isActive(a.status) : !isActive(a.status)))
  const byPerson = people
    .map((p) => ({ p, items: list.filter((a) => a.personId === p.id) }))
    .filter((g) => g.items.length)

  return (
    <Sheet title="Мои записи и заявки" close>
      {emergency.map((a) => (
        <button key={a.id} onClick={() => navigate('/activity?id=' + a.id)} className="mb-4 flex w-full items-center gap-3 rounded-2xl bg-zt-pink p-4 text-left">
          <Icon name="siren" className="text-zt-red" />
          <span className="flex-1 text-[15px] font-semibold">{a.title}</span>
          <StatusPill a={a} />
        </button>
      ))}
      <Note
        what="История записей и заявок: активные и завершённые, по каждому застрахованному. Гарантийные письма и возвраты — в том же списке."
        finding="Отчёт, тема 3: трое спросили, где смотреть старые гарантийные письма и записи, когда они уйдут с главной. Рекомендация 3."
      >
        <div className="flex rounded-full bg-zt-bg2 p-1">
          {(['active', 'done'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={'h-9 flex-1 rounded-full text-[14px] font-semibold ' + (tab === t ? 'bg-white text-zt-text shadow' : 'text-zt-text3')}>
              {t === 'active' ? 'Активные' : 'Завершённые'}
            </button>
          ))}
        </div>
      </Note>
      {byPerson.length === 0 && <div className="py-10 text-center text-[14px] text-zt-text3">Здесь пока пусто</div>}
      {byPerson.map(({ p, items }) => (
        <section key={p.id} className="mt-5">
          <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-zt-text3">
            {p.short}{p.relation !== 'Вы' ? ` · ${p.relation.toLowerCase()}` : ''}
          </h2>
          <div className="divide-y divide-zt-stroke overflow-hidden rounded-2xl bg-white shadow-zt-card">
            {items.map((a) => <ActivityRow key={a.id} a={a} />)}
          </div>
        </section>
      ))}
      <div className="mt-6 grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={() => navigate('/booking')}>Записаться</Button>
        <Button variant="secondary" onClick={() => navigate('/gp')}>Гарантийное письмо</Button>
      </div>
    </Sheet>
  )
}

export function ActivityDetail({ id }: { id: string }) {
  const { activities } = useStore()
  const a = activities.find((x) => x.id === id)
  if (!a) {
    return (
      <Sheet title="Заявка" close>
        <div className="py-10 text-center text-zt-text3">Заявка не найдена</div>
      </Sheet>
    )
  }
  const person = people.find((p) => p.id === a.personId)!
  const isGp = a.kind === 'gp'
  const steps = isGp ? ['Отправлено 25 сентября', 'На рассмотрении в Зетте', 'Письмо готово, отправим в клинику'] : []
  return (
    <Sheet title={isGp ? 'Гарантийное письмо' : a.kind === 'refund' ? 'Возврат' : 'Запись'} close>
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-[20px] font-bold leading-tight">{a.title}</h2>
        <StatusPill a={a} />
      </div>
      <div className="mt-4 space-y-3 rounded-2xl bg-white p-4 shadow-zt-card">
        {[
          ['clock', a.when],
          ['pin', a.place],
          ['user', person.name],
        ].map(([icon, text]) => (
          <div key={icon} className="flex items-center gap-3 text-[15px]">
            <Icon name={icon} size={20} className="text-zt-accent" />
            {text}
          </div>
        ))}
      </div>
      {isGp && (
        <Note
          className="mt-4"
          what="В статусе письма — ожидаемый срок ответа и этапы; по заявке можно написать в чат."
          finding="Отчёт, тема 3: в статусе гарантийного письма нет ожидаемого срока, написать по конкретной заявке нельзя. Рекомендация 5."
        >
          <div className="rounded-2xl bg-zt-peach p-4">
            <div className="text-[15px] font-semibold">Ответим до 29 сентября</div>
            <div className="text-[13px] text-zt-text2">Обычно 1–3 рабочих дня</div>
            <ol className="mt-3 space-y-2">
              {steps.map((s, i) => (
                <li key={s} className="flex items-center gap-2.5 text-[14px]">
                  <span className={'flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ' + (i < 2 ? 'bg-zt-orange text-white' : 'bg-white text-zt-text3')}>{i < 1 ? '✓' : i + 1}</span>
                  <span className={i < 2 ? '' : 'text-zt-text3'}>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </Note>
      )}
      <div className="mt-5 space-y-2">
        {isGp && <Button variant="secondary" onClick={() => navigate('/wip?t=Чат по заявке')}>Написать по заявке</Button>}
        {a.kind === 'visit' && a.status === 'upcoming' && (
          <>
            <Button variant="secondary" onClick={() => navigate('/wip?t=Перенос записи')}>Перенести</Button>
            <Button variant="ghost" onClick={() => navigate('/wip?t=Отмена записи')}>Отменить запись</Button>
          </>
        )}
      </div>
    </Sheet>
  )
}
