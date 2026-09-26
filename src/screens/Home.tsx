import type { Activity } from '../data'
import { navigate } from '../router'
import { useStore } from '../store'
import { Icon } from '../ui/Icon'
import { Note } from '../ui/Note'
import { AppHeader, StatusBar } from '../ui/Screen'

const statusStyle: Record<Activity['status'], string> = {
  upcoming: 'bg-zt-mint text-zt-accent',
  review: 'bg-zt-peach text-zt-orange',
  ready: 'bg-[#e8f8ee] text-zt-green',
  done: 'bg-zt-bg2 text-zt-text3',
  cancelled: 'bg-zt-bg2 text-zt-text3',
}

export function StatusPill({ a }: { a: Activity }) {
  return <span className={'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ' + statusStyle[a.status]}>{a.statusText}</span>
}

export function ActivityRow({ a }: { a: Activity }) {
  const icon = a.kind === 'gp' ? 'doc' : a.kind === 'doctor-home' ? 'home' : a.kind === 'refund' ? 'wallet' : a.kind === 'emergency' ? 'siren' : 'calendar'
  return (
    <button onClick={() => navigate('/activity?id=' + a.id)} className="flex w-full items-center gap-3 px-4 py-3 text-left">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zt-mint text-zt-accent">
        <Icon name={icon} size={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-medium">{a.title}</span>
        <span className="block truncate text-[13px] text-zt-text3">{a.when} · {a.place}</span>
      </span>
      <StatusPill a={a} />
    </button>
  )
}

const quick = [
  { label: 'Полис', icon: 'shield', to: '/policies' },
  { label: 'Программа', icon: 'list', to: '/program' },
  { label: 'Финансы', icon: 'wallet', to: '/finances' },
  { label: 'Записи и заявки', icon: 'calendar', to: '/activities' },
]

const services = [
  { title: 'Онлайн-приём врача', sub: 'Консультация с врачом в удобное время', img: 'srv-online.png', to: '/wip?t=Онлайн-приём', wide: true },
  { title: 'Запись в клинику', sub: 'Выбрать клинику или врача', img: 'srv-clinic.png', to: '/booking' },
  { title: 'Вызов врача на дом', sub: 'Выбрать клинику или врача', img: 'srv-home.png', to: '/wip?t=Вызов врача на дом' },
  { title: 'Согласование услуг', sub: 'Подача и статус запросов', img: 'srv-approval.png', to: '/wip?t=Согласование услуг' },
  { title: 'Гарантийные письма', sub: 'Запросить и узнать статус', img: 'srv-letter.png', to: '/gp', note: true },
  { title: 'Чекап', sub: 'Комплексное обследование', img: 'srv-checkup.png', to: '/wip?t=Чекап', wide: true },
]

export function Home() {
  const { person, activities } = useStore()
  const mine = activities.filter((a) => a.personId === person.id && (a.status === 'upcoming' || a.status === 'review' || a.status === 'ready'))

  return (
    <div className="min-h-full bg-white">
      <div className="zt-gradient">
        <StatusBar />
        <AppHeader />
        <Note
          className="px-4 pb-6"
          what="Ряд быстрых входов на главной: полис, программа, финансы, записи и заявки. Те же пункты остаются в профиле."
          finding="Отчёт, тема 2: одни ищут всё в профиле, другие только на главной, поэтому «моё» открывается с обеих сторон. Рекомендация 2."
        >
          <div className="grid grid-cols-4 gap-2">
            {quick.map((q) => (
              <button key={q.label} onClick={() => navigate(q.to)} className="flex flex-col items-center gap-1.5 rounded-2xl bg-white/15 px-1 py-2.5 text-white backdrop-blur-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-zt-accent">
                  <Icon name={q.icon} size={20} />
                </span>
                <span className="text-center text-[11.5px] font-medium leading-tight">{q.label}</span>
              </button>
            ))}
          </div>
        </Note>
      </div>

      <div className="-mt-4 rounded-t-[28px] bg-white px-4 pb-32 pt-5">
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="text-[20px] font-bold">
              <Note
                className="inline-block pr-6"
          what="Вместо листающегося блока событий — компактный список своих записей и заявок: что, где, когда, статус. Экстренные события показываются отдельной плашкой, только когда они есть. Внизу — вход в историю."
          finding="Отчёт, тема 3: четверо из семи не восприняли блок событий как свои дела; трое попросили строки «что, где, когда». Рекомендация 3."
              >
                Мои записи и заявки
              </Note>
            </h2>
            <button onClick={() => navigate('/activities')} className="text-[14px] font-medium text-zt-accent">Все</button>
          </div>
          <div className="divide-y divide-zt-stroke overflow-hidden rounded-2xl bg-white shadow-zt-card">
            {mine.length ? (
              mine.map((a) => <ActivityRow key={a.id} a={a} />)
            ) : (
              <div className="px-4 py-5 text-[14px] text-zt-text3">
                Активных записей и заявок нет. Здесь появятся визиты к врачу и гарантийные письма.
              </div>
            )}
          </div>
        </div>

        <h2 className="mb-3 mt-7 text-[20px] font-bold">
          <Note
            className="inline-block pr-6"
            what="«Услуги вашего полиса» → «Мои услуги»."
            finding="Отчёт, раздел «Названия»: «это относится ко мне, а не к полису» (Татьяна, mk3). Рекомендация 10."
          >
            Мои услуги
          </Note>
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {services.map((s) => {
            const tile = (
              <button
                onClick={() => navigate(s.to)}
                className={'relative flex w-full flex-col overflow-hidden rounded-3xl bg-cover bg-right-bottom p-4 text-left shadow-zt-card ' + (s.wide ? 'h-36' : 'h-44')}
                style={{ backgroundImage: `url(zt/${s.img})` }}
              >
                <span className="max-w-[70%] text-[17px] font-semibold leading-tight">{s.title}</span>
                <span className="mt-1.5 max-w-[65%] text-[12.5px] leading-snug text-zt-text2">{s.sub}</span>
              </button>
            )
            return (
              <div key={s.title} className={s.wide ? 'col-span-2' : ''}>
                {s.note ? (
                  <Note
                    what="Плитка во множественном числе ведёт в список писем со статусами и сроками, оттуда же — новый запрос."
                    finding="Отчёт, тема 4: плитку трое нашли только с подсказкой; трое спросили, где смотреть старые письма. Рекомендация 5."
                  >
                    {tile}
                  </Note>
                ) : (
                  tile
                )}
              </div>
            )
          })}
        </div>

        <h2 className="mb-3 mt-7 text-[20px] font-bold">
          <Note
            className="inline-block pr-6"
            what="«Мы всегда на связи» → «Контакты»."
            finding="Отчёт, раздел «Названия»: заголовок читается как рекламный слоган (Светлана, PepsiCo). Рекомендация 10."
          >
            Контакты
          </Note>
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/wip?t=Чат')} className="row-span-2 flex h-full min-h-44 flex-col rounded-3xl bg-cover bg-bottom p-4 text-left shadow-zt-card" style={{ backgroundImage: 'url(zt/cta-chat.png)' }}>
            <span className="text-[16px] font-semibold">Чат с поддержкой</span>
            <span className="mt-1 text-[12.5px] text-zt-text2">Ответим в течение 5 минут</span>
          </button>
          <button onClick={() => navigate('/contacts')} className="flex h-[84px] flex-col rounded-3xl bg-cover p-3.5 text-left shadow-zt-card" style={{ backgroundImage: 'url(zt/cta-call.png)' }}>
            <span className="text-[15px] font-semibold">Позвонить</span>
            <span className="text-[12px] text-zt-text2">Круглосуточно</span>
          </button>
          <button onClick={() => navigate('/contacts')} className="flex h-[84px] flex-col rounded-3xl bg-cover p-3.5 text-left shadow-zt-card" style={{ backgroundImage: 'url(zt/cta-mail.png)' }}>
            <span className="text-[15px] font-semibold">Написать</span>
            <span className="text-[12px] text-zt-text2">На почту</span>
          </button>
        </div>

        <h2 className="mb-3 mt-7 text-[20px] font-bold">Полезное</h2>
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4">
          {[
            { t: 'Что такое ДМС', img: 'content-card-1.png' },
            { t: 'Как работает франшиза', img: 'content-card-2.png', to: '/franchise' },
            { t: 'Как получить гарантийное письмо', img: 'content-card-1.png', to: '/gp' },
          ].map((c) => (
            <button key={c.t} onClick={() => navigate(c.to ?? '/wip?t=' + c.t)} className="flex h-40 w-36 shrink-0 flex-col justify-end rounded-3xl bg-cover bg-center p-3.5 text-left shadow-zt-card" style={{ backgroundImage: `url(zt/${c.img})` }}>
              <span className="text-[14px] font-semibold leading-tight">{c.t}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
