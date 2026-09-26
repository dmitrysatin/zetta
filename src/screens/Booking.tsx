import { useState, type ReactNode } from 'react'
import { accessLabel, clinics, days, doctorsFor, slotsFor, specialties, type Clinic } from '../data'
import { navigate } from '../router'
import { useStore } from '../store'
import { Icon } from '../ui/Icon'
import { Note } from '../ui/Note'
import { Button, Sheet } from '../ui/Screen'

function Progress({ step }: { step: number }) {
  return (
    <div className="mb-4 flex gap-1.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={'h-[3px] flex-1 rounded-full ' + (i <= step ? 'bg-zt-accent' : 'bg-zt-stroke')} />
      ))}
    </div>
  )
}

function Flow({ title, step, children, footer }: { title: string; step: number; children: ReactNode; footer?: ReactNode }) {
  return (
    <Sheet title={title} close footer={footer}>
      <Progress step={step} />
      {children}
    </Sheet>
  )
}

const accessDot: Record<Clinic['access'], string> = {
  online: 'bg-zt-orange',
  direct: 'bg-zt-blue',
  zetta: 'bg-zt-accent',
}

// Список клиник с поиском по названию, адресу и метро и фильтром по способу записи.
// Используется и в записи, и во вкладке «Клиники».
export function ClinicList({ onPick }: { onPick: (c: Clinic) => void }) {
  const { person } = useStore()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<'all' | 'fav' | Clinic['access']>('all')
  const [fav, setFav] = useState<string[]>(['chaika'])
  const child = person.relation !== 'Вы'
  const needle = q.trim().toLowerCase()
  const list = clinics
    .filter((c) => (child ? true : !c.kids))
    .filter((c) => (filter === 'all' ? true : filter === 'fav' ? fav.includes(c.id) : c.access === filter))
    .filter((c) => !needle || [c.name, c.address, c.metro].some((f) => f.toLowerCase().includes(needle)))
  const chips: { id: typeof filter; label: ReactNode }[] = [
    { id: 'all', label: 'Все' },
    { id: 'fav', label: <span className="flex items-center gap-1"><Icon name="heart" size={14} />Избранное</span> },
    ...(['online', 'direct', 'zetta'] as const).map((a) => ({
      id: a,
      label: <span className="flex items-center gap-1.5"><span className={'h-2 w-2 rounded-full ' + accessDot[a]} />{accessLabel[a]}</span>,
    })),
  ]
  return (
    <>
      <Note
        at="out-right"
        what="Поиск ищет и по станции метро: в подсказке так и написано, в карточке клиники метро указано рядом с адресом."
        finding="Отчёт, тема 5: двое искали клинику по станции метро рядом с работой."
      >
        <label className="flex h-12 items-center gap-2 rounded-2xl bg-zt-bg2 px-4">
          <Icon name="search" size={20} className="text-zt-text3" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Название, адрес или метро" className="flex-1 bg-transparent text-[15px] outline-none" />
        </label>
      </Note>
      <Note
        className="mt-3"
        at="out-right"
        what="Бывшая легенда карты стала фильтром: нажатие на «Онлайн-запись», «Прямой доступ» или «Запись через Зетту» оставляет только такие клиники. «Любимые» → «Избранное» со значком сердца."
        finding="Отчёт, тема 5: трое ждали, что значки легенды работают как фильтр; раздел «Названия»: «Любимые» — «слишком большое слово для клиники» (Александр). Рекомендация 10."
      >
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          {chips.map((c) => (
            <button key={c.id} onClick={() => setFilter(c.id)} className={'h-9 shrink-0 rounded-full px-3.5 text-[13.5px] font-medium ' + (filter === c.id ? 'bg-zt-accent text-white' : 'bg-zt-mint text-zt-text')}>
              {c.label}
            </button>
          ))}
        </div>
      </Note>
      <div className="mt-4 space-y-2.5">
        {list.map((c) => (
          <div key={c.id} className="flex items-start gap-2 rounded-2xl bg-white p-4 shadow-zt-card">
            <button onClick={() => onPick(c)} className="min-w-0 flex-1 text-left">
              <span className="block text-[15px] font-semibold">{c.name}</span>
              <span className="mt-0.5 flex items-center gap-1 text-[13px] text-zt-text2">
                <span className="font-medium text-zt-blue">м. {c.metro}</span> · {c.address}
              </span>
              <span className="mt-2 flex flex-wrap gap-1.5">
                <span className="flex items-center gap-1.5 rounded-full bg-zt-bg2 px-2 py-0.5 text-[12px]"><span className={'h-2 w-2 rounded-full ' + accessDot[c.access]} />{accessLabel[c.access]}</span>
                {c.franchise && <span className="rounded-full bg-zt-pink px-2 py-0.5 text-[12px]">Услуги с франшизой</span>}
              </span>
            </button>
            <button onClick={() => setFav((f) => (f.includes(c.id) ? f.filter((x) => x !== c.id) : [...f, c.id]))} aria-label="Избранное" className={fav.includes(c.id) ? 'text-zt-red' : 'text-zt-inactive'}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill={fav.includes(c.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>
            </button>
          </div>
        ))}
        {list.length === 0 && <div className="py-8 text-center text-[14px] text-zt-text3">Ничего не нашлось. Попробуйте другую станцию или название.</div>}
      </div>
    </>
  )
}

export function Clinics() {
  return (
    <Sheet title="Список клиник" back={false}>
      <ClinicList onPick={(c) => navigate('/booking/specialty?clinic=' + c.id)} />
    </Sheet>
  )
}

export function BookingClinic() {
  const { setBooking, resetBooking } = useStore()
  return (
    <Flow title="Выберите клинику" step={1}>
      <ClinicList
        onPick={(c) => {
          resetBooking()
          setBooking({ clinicId: c.id })
          navigate('/booking/specialty')
        }}
      />
    </Flow>
  )
}

export function BookingSpecialty({ clinicParam }: { clinicParam: string | null }) {
  const { booking, setBooking, resetBooking } = useStore()
  const clinicId = clinicParam ?? booking.clinicId
  const clinic = clinics.find((c) => c.id === clinicId) ?? clinics[0]
  return (
    <Flow title="Специальность" step={2}>
      <div className="mb-3 text-[14px] text-zt-text2">{clinic.name}</div>
      <div className="grid grid-cols-2 gap-2">
        {specialties.map((s) => (
          <button
            key={s}
            onClick={() => {
              if (clinicParam) resetBooking()
              setBooking({ clinicId: clinic.id, specialty: s, doctorId: undefined, day: undefined, time: undefined })
              navigate(clinic.access === 'zetta' ? '/booking/wish' : '/booking/doctors')
            }}
            className="h-14 rounded-2xl bg-white px-4 text-left text-[15px] font-medium shadow-zt-card"
          >
            {s}
          </button>
        ))}
      </div>
    </Flow>
  )
}

export function BookingDoctors() {
  const { booking, setBooking } = useStore()
  const day = booking.day ?? days[0].key
  const doctors = doctorsFor(booking.specialty ?? 'Терапевт')
  const chosen = booking.doctorId && booking.time && booking.day
  return (
    <Flow
      title={booking.specialty ?? 'Врачи'}
      step={3}
      footer={chosen ? <Button onClick={() => navigate('/booking/complaints')}>Далее</Button> : undefined}
    >
      <Note
        at="out-right"
        what="Лента дат сверху, у каждого врача сразу видны свободные слоты на выбранный день — раскрывать карточки по одной не нужно."
        finding="Отчёт, тема 5: свободное время видно только после нажатия на врача; «Лента времени сверху, ниже карточки врачей, около каждой — лента со свободными слотами» (Ирина, PMI). Рекомендация 6."
      >
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {days.map((d) => (
            <button
              key={d.key}
              onClick={() => setBooking({ day: d.key, time: booking.day === d.key ? booking.time : undefined })}
              className={'flex h-16 w-12 shrink-0 flex-col items-center justify-center rounded-2xl ' + (d.key === day ? 'bg-zt-accent text-white' : 'bg-zt-bg2')}
            >
              <span className={'text-[12px] ' + (d.key === day ? 'text-white/85' : 'text-zt-text3')}>{d.wd}</span>
              <span className="text-[17px] font-semibold">{d.day}</span>
            </button>
          ))}
        </div>
      </Note>
      <div className="mt-4 space-y-3">
        {doctors.map((doc) => {
          const slots = slotsFor(doc.id, day)
          return (
            <div key={doc.id} className="rounded-2xl bg-white p-4 shadow-zt-card">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zt-mint text-zt-accent"><Icon name="user" size={20} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold leading-tight">{doc.name}</span>
                  <span className="block text-[12.5px] text-zt-text3">{doc.hours} · ★ {doc.rating}</span>
                </span>
              </div>
              {slots.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {slots.map((t) => {
                    const on = booking.doctorId === doc.id && booking.time === t && booking.day === day
                    return (
                      <button key={t} onClick={() => setBooking({ doctorId: doc.id, time: t, day })} className={'h-9 rounded-full px-3.5 text-[14px] font-medium ' + (on ? 'bg-zt-accent text-white' : 'bg-zt-mint text-zt-text')}>
                        {t}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="mt-3 text-[13px] text-zt-text3">На этот день свободного времени нет</div>
              )}
            </div>
          )
        })}
      </div>
      <button onClick={() => navigate('/booking/wish')} className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-zt-sky p-4 text-left">
        <Icon name="clock" className="text-zt-accent" />
        <span className="flex-1">
          <span className="block text-[15px] font-semibold">Нет подходящего времени?</span>
          <span className="block text-[13px] text-zt-text2">Укажите желаемую дату — оператор подберёт и перезвонит</span>
        </span>
      </button>
    </Flow>
  )
}

const parts = ['Утро', 'День', 'Вечер']

// Желаемые даты: одна обязательна, вторая по желанию. Повторное нажатие на выбранную
// дату не снимает её и не стирает время — убрать дату можно крестиком.
export function BookingWish() {
  const { booking, setBooking } = useStore()
  const [active, setActive] = useState<string | undefined>(booking.wish[0]?.day)
  const wish = booking.wish
  const toggleDay = (key: string) => {
    if (wish.some((w) => w.day === key)) {
      setActive(key)
      return
    }
    if (wish.length >= 2) return
    setBooking({ wish: [...wish, { day: key, part: 'Утро' }] })
    setActive(key)
  }
  const setPart = (key: string, part: string) => setBooking({ wish: wish.map((w) => (w.day === key ? { ...w, part } : w)) })
  const remove = (key: string) => setBooking({ wish: wish.filter((w) => w.day !== key) })
  return (
    <Flow
      title="Желаемая дата"
      step={3}
      footer={<Button onClick={() => wish.length && navigate('/booking/complaints')} className={wish.length ? '' : 'opacity-40'}>Далее</Button>}
    >
      <Note
        at="out-right"
        what="Достаточно одной даты. Вторую можно добавить, и рядом объяснено зачем. Повторное нажатие на дату не снимает её и не стирает время, убрать — крестиком."
        finding="Отчёт, тема 5: обязательные две даты провоцируют неявку (Александр, Райффайзенбанк); повторное нажатие снимало дату вместе со временем; сообщение об ошибке было выше видимой части экрана. Рекомендация 6."
      >
        <p className="text-[14px] leading-snug text-zt-text2">
          Выберите удобный день — оператор запишет вас и перезвонит. <b className="text-zt-text">Можно добавить второй день</b>: если на первый не будет мест, запишем на него.
        </p>
      </Note>
      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {days.map((d) => {
          const picked = wish.some((w) => w.day === d.key)
          return (
            <button key={d.key} onClick={() => toggleDay(d.key)} className={'flex h-16 flex-col items-center justify-center rounded-2xl ' + (picked ? 'bg-zt-accent text-white' : 'bg-zt-bg2') + (d.key === active ? ' ring-2 ring-zt-blue ring-offset-2' : '')}>
              <span className={'text-[12px] ' + (picked ? 'text-white/85' : 'text-zt-text3')}>{d.wd}</span>
              <span className="text-[17px] font-semibold">{d.day}</span>
            </button>
          )
        })}
      </div>
      <div className="mt-4 space-y-3">
        {wish.map((w, i) => {
          const d = days.find((x) => x.key === w.day)!
          return (
            <div key={w.day} className="rounded-2xl bg-white p-4 shadow-zt-card">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-semibold">{i === 0 ? 'Основной день' : 'Запасной день'}: {d.label}, {d.weekday}</span>
                <button onClick={() => remove(w.day)} aria-label="Убрать дату" className="text-zt-text3"><Icon name="close" size={18} /></button>
              </div>
              <div className="mt-3 flex gap-2">
                {parts.map((p) => (
                  <button key={p} onClick={() => setPart(w.day, p)} className={'h-9 flex-1 rounded-full text-[14px] font-medium ' + (w.part === p ? 'bg-zt-accent text-white' : 'bg-zt-mint')}>{p}</button>
                ))}
              </div>
            </div>
          )
        })}
        {wish.length === 0 && <div className="rounded-2xl bg-zt-bg2 p-4 text-[14px] text-zt-text2">Нажмите на день в календаре</div>}
        {wish.length === 1 && <div className="text-center text-[13px] text-zt-text3">Запасной день — по желанию</div>}
      </div>
    </Flow>
  )
}

export function BookingComplaints() {
  const { booking, setBooking } = useStore()
  return (
    <Flow title="Жалобы" step={4} footer={<Button onClick={() => navigate('/booking/confirm')}>Далее</Button>}>
      <Note
        at="out-right"
        what="Поле симптомов первое и с понятной подписью, температура — короткое поле ввода с вариантом «нормальная» вместо крупной шкалы."
        finding="Отчёт, тема 5: трое сочли шкалу лишней, Александр пропустил поле симптомов над ней, на телефоне шкала уходит под клавиатуру (Татьяна, mk3); раздел «Названия»: «Укажите симптомы, на которые жалуетесь». Рекомендации 6 и 10."
      >
        <label className="block">
          <span className="text-[16px] font-semibold">Укажите симптомы, на которые жалуетесь</span>
          <textarea
            value={booking.symptoms}
            onChange={(e) => setBooking({ symptoms: e.target.value })}
            placeholder="Например: болит горло третий день, слабость"
            rows={4}
            className="mt-2 w-full resize-none rounded-2xl bg-zt-bg3 p-4 text-[15px] outline-zt-accent"
          />
        </label>
      </Note>
      <div className="mt-5">
        <div className="text-[16px] font-semibold">Температура</div>
        <div className="mt-2 flex items-center gap-3">
          <label className={'flex h-12 w-32 items-center rounded-2xl bg-zt-bg3 px-4 ' + (booking.tempNormal ? 'opacity-40' : '')}>
            <input
              inputMode="decimal"
              value={booking.temperature}
              disabled={booking.tempNormal}
              onChange={(e) => setBooking({ temperature: e.target.value.replace(/[^\d.,]/g, '').slice(0, 4) })}
              placeholder="36,6"
              className="w-full bg-transparent text-[15px] outline-none"
            />
            <span className="text-zt-text3">°C</span>
          </label>
          <label className="flex items-center gap-2 text-[15px]">
            <input type="checkbox" checked={booking.tempNormal} onChange={(e) => setBooking({ tempNormal: e.target.checked, temperature: '' })} className="h-5 w-5 accent-[#00b7bc]" />
            Нормальная
          </label>
        </div>
      </div>
      <label className="mt-5 flex items-center justify-between border-t border-zt-stroke pt-4">
        <span className="text-[15px]">Нужен больничный лист</span>
        <input type="checkbox" checked={booking.sickLeave} onChange={(e) => setBooking({ sickLeave: e.target.checked })} className="h-5 w-5 accent-[#00b7bc]" />
      </label>
      <label className="mt-5 block">
        <span className="text-[16px] font-semibold">Дополнительные пожелания</span>
        <textarea
          value={booking.comment}
          onChange={(e) => setBooking({ comment: e.target.value })}
          placeholder="Например, к конкретному врачу, поближе к метро, удобнее вечером"
          rows={3}
          className="mt-2 w-full resize-none rounded-2xl bg-zt-bg3 p-4 text-[15px] outline-zt-accent"
        />
      </label>
    </Flow>
  )
}

export function BookingConfirm() {
  const { booking, person, addActivity } = useStore()
  const clinic = clinics.find((c) => c.id === booking.clinicId) ?? clinics[0]
  const doctor = doctorsFor(booking.specialty ?? 'Терапевт').find((d) => d.id === booking.doctorId)
  const d = days.find((x) => x.key === booking.day)
  const viaOperator = !doctor
  const when = viaOperator
    ? booking.wish.map((w) => `${days.find((x) => x.key === w.day)!.label}, ${w.part.toLowerCase()}`).join(' или ') || '—'
    : `${d?.label}, ${booking.time}`
  const rows: [string, string, string][] = [
    ['Пациент', person.name, '/insured'],
    ['Клиника', `${clinic.name}, м. ${clinic.metro}`, '/booking'],
    ['Специальность', booking.specialty ?? '—', '/booking/specialty'],
    ...(doctor ? [['Врач', doctor.name, '/booking/doctors'] as [string, string, string]] : []),
    [viaOperator ? 'Желаемое время' : 'Дата и время', when, viaOperator ? '/booking/wish' : '/booking/doctors'],
    ['Жалобы', booking.symptoms || (booking.tempNormal ? 'Температура нормальная' : '—'), '/booking/complaints'],
  ]
  return (
    <Flow
      title="Проверьте запись"
      step={5}
      footer={
        <Button
          onClick={() => {
            addActivity({
              id: 'new-visit',
              kind: 'visit',
              title: `${booking.specialty}${doctor ? ', ' + doctor.name.split(' ').slice(0, 1).join('') + ' ' + doctor.name.split(' ').slice(1).map((x) => x[0] + '.').join(' ') : ''}`,
              place: clinic.name,
              when: viaOperator ? `Перезвоним до 27 сентября` : `${d?.label}, ${booking.time}`,
              status: viaOperator ? 'review' : 'upcoming',
              statusText: viaOperator ? 'Подбираем время' : 'Записаны',
              personId: person.id,
            })
            navigate('/booking/done', { replace: true })
          }}
        >
          {viaOperator ? 'Отправить заявку' : 'Записаться'}
        </Button>
      }
    >
      <div className="divide-y divide-zt-stroke overflow-hidden rounded-2xl bg-white shadow-zt-card">
        {rows.map(([k, v, to]) => (
          <div key={k} className="flex items-start gap-3 px-4 py-3">
            <span className="min-w-0 flex-1">
              <span className="block text-[12.5px] text-zt-text3">{k}</span>
              <span className="block text-[15px]">{v}</span>
            </span>
            <button onClick={() => navigate(to)} className="text-[13px] font-medium text-zt-accent">Изменить</button>
          </div>
        ))}
      </div>
    </Flow>
  )
}

export function BookingDone() {
  const { activities } = useStore()
  const a = activities.find((x) => x.id === 'new-visit')
  return (
    <Sheet title="" back={false} close>
      <div className="flex flex-col items-center pt-8 text-center">
        <img src="zt/gp-success.png" alt="" className="w-40" />
        <h2 className="mt-4 text-[20px] font-bold">{a?.status === 'upcoming' ? 'Вы записаны' : 'Заявка отправлена'}</h2>
        <p className="mt-2 max-w-72 text-[14px] text-zt-text2">
          {a?.title.replace(/\.$/, '')}. {a?.when}. {a?.status === 'upcoming' ? 'Запись' : 'Заявка'} уже в списке «Мои записи и заявки» на главной.
        </p>
        <Button className="mt-6" onClick={() => navigate('/home', { replace: true })}>На главную</Button>
        <Button variant="ghost" className="mt-1" onClick={() => navigate('/activities', { replace: true })}>Мои записи и заявки</Button>
      </div>
    </Sheet>
  )
}
