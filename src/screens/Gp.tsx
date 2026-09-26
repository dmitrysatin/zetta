import { useState } from 'react'
import { clinics } from '../data'
import { navigate } from '../router'
import { useStore } from '../store'
import { Icon } from '../ui/Icon'
import { Note } from '../ui/Note'
import { Button, Sheet } from '../ui/Screen'
import { ActivityRow } from './Home'

const archived = {
  title: 'Консультация кардиолога',
  place: 'Клиника «Медси»',
  when: 'Выдано 12 августа',
}

export function GpList() {
  const { activities, person } = useStore()
  const letters = activities.filter((a) => a.kind === 'gp' && a.personId === person.id)
  return (
    <Sheet
      title="Гарантийные письма"
      close
      footer={<Button onClick={() => navigate('/gp/new')}>Запросить гарантийное письмо</Button>}
    >
      <Note
        at="out-right"
        what="Отдельный раздел писем: текущие заявки со статусом и сроком, выданные письма — ниже. Сюда ведут плитка на главной, профиль, «Мои обращения» и справочная статья."
        finding="Отчёт, тема 4: плитку трое нашли только с подсказкой, искали в «Моих обращениях», профиле и справке; тема 3: «А где посмотреть архив этих гарантийных писем?» (Александр). Рекомендация 5."
      >
        <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-zt-text3">В работе</h2>
        <div className="divide-y divide-zt-stroke overflow-hidden rounded-2xl bg-white shadow-zt-card">
          {letters.length ? letters.map((a) => <ActivityRow key={a.id} a={a} />) : <div className="px-4 py-4 text-[14px] text-zt-text3">Заявок в работе нет</div>}
        </div>
      </Note>
      {person.id === 'anna' && (
        <>
          <h2 className="mb-2 mt-5 text-[13px] font-semibold uppercase tracking-wide text-zt-text3">Выданные</h2>
          <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-zt-card">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zt-bg2 text-zt-text3"><Icon name="doc" size={20} /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-medium">{archived.title}</span>
              <span className="block text-[13px] text-zt-text3">{archived.when} · {archived.place}</span>
            </span>
            <span className="rounded-full bg-[#e8f8ee] px-2 py-0.5 text-[11px] font-semibold text-zt-green">Выдано</span>
          </div>
        </>
      )}
      <div className="mt-5 flex gap-3 rounded-2xl bg-zt-sky p-4">
        <Icon name="info" className="shrink-0 text-zt-accent" />
        <p className="text-[13.5px] leading-snug text-zt-text2">
          <b className="text-zt-text">Когда нужно письмо.</b> Если клиника не входит в прямой доступ по вашей программе или врач назначил обследование, которого нет в программе. Письмо Зетта отправит в клинику сама.
        </p>
      </div>
    </Sheet>
  )
}

export function GpNew() {
  return (
    <Sheet title="Гарантийное письмо" close>
      <p className="mb-4 text-[14px] text-zt-text2">Для чего нужно письмо?</p>
      <div className="space-y-3">
        {[
          { t: 'На приём врача', s: 'Нужен приём у специалиста', type: 'visit', icon: 'user' },
          { t: 'На услуги или обследования', s: 'Есть направление от врача', type: 'service', icon: 'doc' },
        ].map((o) => (
          <button key={o.type} onClick={() => navigate('/gp/form?type=' + o.type)} className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-zt-card">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-zt-mint text-zt-accent"><Icon name={o.icon} /></span>
            <span className="flex-1">
              <span className="block text-[16px] font-semibold">{o.t}</span>
              <span className="block text-[13px] text-zt-text3">{o.s}</span>
            </span>
            <Icon name="chevron" size={18} className="text-zt-text3" />
          </button>
        ))}
      </div>
    </Sheet>
  )
}

export function GpForm({ type }: { type: string }) {
  const { person, addActivity } = useStore()
  const service = type === 'service'
  const [clinicId, setClinicId] = useState('sm')
  const [what, setWhat] = useState('')
  const [files, setFiles] = useState<string[]>([])
  const clinic = clinics.find((c) => c.id === clinicId)!
  const add = (name: string) => setFiles((f) => [...f, name])
  return (
    <Sheet
      title={service ? 'Письмо на услуги' : 'Письмо на приём'}
      close
      footer={
        <Button
          onClick={() => {
            addActivity({
              id: 'new-gp',
              kind: 'gp',
              title: `Гарантийное письмо: ${what.trim() || (service ? 'обследование' : 'приём врача')}`,
              place: clinic.name,
              when: 'Ответ до 30 сентября',
              status: 'review',
              statusText: 'На рассмотрении',
              personId: person.id,
            })
            navigate('/gp/done', { replace: true })
          }}
        >
          Запросить письмо
        </Button>
      }
    >
      <label className="block">
        <span className="text-[16px] font-semibold">Клиника</span>
        <select value={clinicId} onChange={(e) => setClinicId(e.target.value)} className="mt-2 h-12 w-full appearance-none rounded-2xl bg-zt-bg3 px-4 text-[15px] outline-zt-accent">
          {clinics.map((c) => <option key={c.id} value={c.id}>{c.name}, м. {c.metro}</option>)}
        </select>
      </label>
      <label className="mt-5 block">
        <span className="text-[16px] font-semibold">{service ? 'Какие услуги нужны' : 'К какому врачу'}</span>
        <input value={what} onChange={(e) => setWhat(e.target.value)} placeholder={service ? 'Например, МРТ коленного сустава' : 'Например, травматолог-ортопед'} className="mt-2 h-12 w-full rounded-2xl bg-zt-bg3 px-4 text-[15px] outline-zt-accent" />
      </label>

      <div className="mt-5">
        <div className="text-[16px] font-semibold">Документы</div>
        <Note
          className="mt-2"
          at="out-right"
          what="Над загрузкой — подсказка, что именно приложить и как должно выглядеть фото; документ можно сразу сфотографировать камерой. Про паспорт — наше предположение, его надо сверить с Зеттой."
          finding="Отчёт, тема 4: форма показывала только форматы файлов, четверо сказали, что рядовой сотрудник не поймёт, что от него ждут. Рекомендация 5."
        >
          <div className="rounded-2xl bg-zt-peach p-4 text-[13.5px] leading-snug">
            <div className="font-semibold">Что приложить</div>
            {service ? (
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-zt-text2">
                <li><b className="text-zt-text">Направление врача</b> — видны печать клиники и подпись</li>
                <li>Протокол осмотра или выписка, если есть</li>
              </ul>
            ) : (
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-zt-text2">
                <li>Направление или выписка от предыдущего врача, если есть</li>
                <li>Можно отправить и без документов</li>
              </ul>
            )}
            <div className="mt-2 text-zt-text3">Паспорт и полис прикладывать не нужно.</div>
          </div>
        </Note>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button onClick={() => add(`Фото ${files.length + 1}.jpg`)} className="flex h-20 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-zt-accent/40 bg-zt-mint text-[14px] font-semibold text-zt-accent">
            <Icon name="camera" />Сфотографировать
          </button>
          <button onClick={() => add(service ? 'Направление.pdf' : 'Выписка.pdf')} className="flex h-20 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-zt-stroke bg-white text-[14px] font-semibold text-zt-text2">
            <Icon name="folder" />Выбрать файл
          </button>
        </div>
        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((f, i) => (
              <div key={f + i} className="flex items-center gap-3 rounded-2xl bg-zt-bg2 px-4 py-2.5 text-[14px]">
                <Icon name="doc" size={18} className="text-zt-accent" />
                <span className="flex-1">{f}</span>
                <button onClick={() => setFiles((xs) => xs.filter((_, j) => j !== i))} aria-label="Удалить" className="text-zt-text3"><Icon name="close" size={16} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
      <label className="mt-5 block">
        <span className="text-[16px] font-semibold">Комментарий</span>
        <textarea rows={3} placeholder="Если нужно, добавьте пожелания по клинике" className="mt-2 w-full resize-none rounded-2xl bg-zt-bg3 p-4 text-[15px] outline-zt-accent" />
      </label>
    </Sheet>
  )
}

export function GpDone() {
  return (
    <Sheet title="" back={false} close>
      <div className="flex flex-col items-center pt-8 text-center">
        <img src="zt/gp-sent.png" alt="" className="w-48" />
        <h2 className="mt-4 text-[20px] font-bold">Запрос отправлен</h2>
        <p className="mt-2 max-w-72 text-[14px] text-zt-text2">Ответим до 30 сентября, обычно за 1–3 рабочих дня. Готовое письмо отправим в клинику, статус — в «Гарантийных письмах» и на главной.</p>
        <Button className="mt-6" onClick={() => navigate('/gp', { replace: true })}>Гарантийные письма</Button>
        <Button variant="ghost" className="mt-1" onClick={() => navigate('/home', { replace: true })}>На главную</Button>
      </div>
    </Sheet>
  )
}

// «Мои обращения»: здесь тоже искали гарантийное письмо — даём прямой вход
export function Appeals() {
  return (
    <Sheet title="Мои обращения" close>
      <Note
        at="out-right"
        what="В «Моих обращениях» — прямой вход в гарантийные письма и запись."
        finding="Отчёт, тема 4: гарантийное письмо искали в «Моих обращениях». Рекомендация 5."
      >
        <div className="space-y-2.5">
          <button onClick={() => navigate('/gp')} className="flex w-full items-center gap-3 rounded-2xl bg-zt-peach p-4 text-left">
            <Icon name="doc" className="text-zt-orange" />
            <span className="flex-1">
              <span className="block text-[15px] font-semibold">Гарантийные письма</span>
              <span className="block text-[13px] text-zt-text2">Запросить или узнать статус</span>
            </span>
            <Icon name="chevron" size={18} className="text-zt-text3" />
          </button>
          <button onClick={() => navigate('/activities')} className="flex w-full items-center gap-3 rounded-2xl bg-zt-mint p-4 text-left">
            <Icon name="calendar" className="text-zt-accent" />
            <span className="flex-1">
              <span className="block text-[15px] font-semibold">Мои записи и заявки</span>
              <span className="block text-[13px] text-zt-text2">Визиты к врачу, возвраты</span>
            </span>
            <Icon name="chevron" size={18} className="text-zt-text3" />
          </button>
        </div>
      </Note>
      <h2 className="mb-2 mt-6 text-[13px] font-semibold uppercase tracking-wide text-zt-text3">Обращения в поддержку</h2>
      <div className="rounded-2xl bg-white px-4 py-3.5 shadow-zt-card">
        <div className="text-[15px] font-medium">Вопрос о франшизе</div>
        <div className="text-[13px] text-zt-text3">Закрыто 14 июля · ответ в чате</div>
      </div>
    </Sheet>
  )
}
