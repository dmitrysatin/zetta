// Моки прототипа. Те же персонажи и суммы, что в прототипе 65apps и в заданиях теста.

export type Person = {
  id: string
  name: string
  short: string
  initials: string
  birth: string
  age: string
  relation: 'Вы' | 'Сын' | 'Дочь'
  policy: string
  program: string
  validTill: string
  phone?: string
  email?: string
}

export const people: Person[] = [
  {
    id: 'anna',
    name: 'Петрова Анна Сергеевна',
    short: 'Анна Петрова',
    initials: 'АП',
    birth: '14.03.1989',
    age: '37 лет',
    relation: 'Вы',
    policy: 'ДМС-7781-0042',
    program: 'Стандарт',
    validTill: '08.01.2027',
    phone: '+7 916 123-45-67',
    email: 'a.petrova@mail.ru',
  },
  {
    id: 'ivan',
    name: 'Петров Иван Андреевич',
    short: 'Иван Петров',
    initials: 'ИП',
    birth: '21.08.2017',
    age: '9 лет',
    relation: 'Сын',
    policy: 'ДМС-7781-0044',
    program: 'Детский',
    validTill: '08.01.2027',
  },
  {
    id: 'pavel',
    name: 'Петров Павел Андреевич',
    short: 'Павел Петров',
    initials: 'ПП',
    birth: '20.06.2013',
    age: '13 лет',
    relation: 'Сын',
    policy: 'ДМС-7781-0043',
    program: 'Детский',
    validTill: '08.01.2027',
  },
]

export type ItemStatus = 'upcoming' | 'review' | 'ready' | 'done' | 'cancelled'

export type Activity = {
  id: string
  kind: 'visit' | 'gp' | 'doctor-home' | 'emergency' | 'refund'
  title: string
  place: string
  when: string
  status: ItemStatus
  statusText: string
  personId: string
}

export const activities: Activity[] = [
  {
    id: 'a1',
    kind: 'visit',
    title: 'Терапевт, Смирнова Е. В.',
    place: 'Клиника «Медси», Белорусская',
    when: '30 сентября, 10:30',
    status: 'upcoming',
    statusText: 'Записаны',
    personId: 'anna',
  },
  {
    id: 'a2',
    kind: 'gp',
    title: 'Гарантийное письмо: МРТ колена',
    place: 'СМ-Клиника, Ленинский пр.',
    when: 'Ответ до 29 сентября',
    status: 'review',
    statusText: 'На рассмотрении',
    personId: 'anna',
  },
  {
    id: 'a3',
    kind: 'visit',
    title: 'Педиатр, Орлова Н. А.',
    place: 'Детская клиника «Мать и дитя»',
    when: '2 октября, 16:00',
    status: 'upcoming',
    statusText: 'Записаны',
    personId: 'ivan',
  },
  {
    id: 'a4',
    kind: 'visit',
    title: 'Офтальмолог',
    place: 'Клиника «Чайка»',
    when: '7 июля',
    status: 'cancelled',
    statusText: 'Отменено',
    personId: 'anna',
  },
  {
    id: 'a5',
    kind: 'visit',
    title: 'Терапевт, Смирнова Е. В.',
    place: 'Клиника «Чайка»',
    when: '7 июля',
    status: 'done',
    statusText: 'Состоялся',
    personId: 'anna',
  },
]

export type InvoiceLine = {
  service: string
  date: string
  cost: number
  yourPart: number
  note?: string
}

export const invoice = {
  number: '100241',
  date: '08.07.2026',
  clinic: 'Клиника «Чайка»',
  status: 'К оплате',
  lines: [
    { service: 'Приём терапевта', date: '07.07.2026', cost: 2250, yourPart: 337.5, note: '15% от 2 250 ₽' },
    { service: 'Общий анализ крови', date: '07.07.2026', cost: 1000, yourPart: 150, note: '15% от 1 000 ₽' },
    { service: 'УЗИ брюшной полости', date: '07.07.2026', cost: 4000, yourPart: 600, note: '15% от 4 000 ₽' },
    { service: 'Приём офтальмолога', date: '07.07.2026', cost: 0, yourPart: 0, note: 'Приём отменён' },
  ] as InvoiceLine[],
  total: 1087.5,
}

export const franchise = {
  percent: 15,
  balance: 500,
  deposit: 3000,
  card: '•••• 4417',
  drugsBalance: 1200,
}

// Суммы с копейками, как в прототипе 65apps; short — без копеек для чипов и крупных цифр
export function rub(n: number, short = false): string {
  return (
    n.toLocaleString('ru-RU', {
      minimumFractionDigits: short && Number.isInteger(n) ? 0 : 2,
      maximumFractionDigits: 2,
    }) + ' ₽'
  )
}

export type Clinic = {
  id: string
  name: string
  address: string
  metro: string
  kids?: boolean
  access: 'online' | 'direct' | 'zetta'
  franchise?: boolean
}

// access: online — онлайн-запись со слотами; direct — прямой доступ по полису;
// zetta — запись через оператора Зетты (желаемые даты)
export const clinics: Clinic[] = [
  { id: 'chaika', name: 'Клиника «Чайка»', address: 'ул. Лесная, 43', metro: 'Белорусская', access: 'online', franchise: true },
  { id: 'medsi', name: 'Клиника «Медси»', address: 'ул. 1-я Брестская, 29', metro: 'Белорусская', access: 'online' },
  { id: 'sm', name: 'СМ-Клиника', address: 'Ленинский пр., 90', metro: 'Новые Черёмушки', access: 'direct' },
  { id: 'zdorovie', name: 'Клиника «Здоровье+»', address: 'Ленинградский пр., 62', metro: 'Аэропорт', access: 'zetta' },
  { id: 'mama', name: 'Детская клиника «Мать и дитя»', address: 'ул. Бутырская, 46', metro: 'Савёловская', access: 'online', kids: true },
]

export const accessLabel: Record<Clinic['access'], string> = {
  online: 'Онлайн-запись',
  direct: 'Прямой доступ',
  zetta: 'Запись через Зетту',
}

export const specialties = ['Терапевт', 'Хирург', 'Офтальмолог', 'Невролог', 'Кардиолог', 'Педиатр', 'Гастроэнтеролог', 'ЛОР', 'Дерматолог', 'Гинеколог']

const doctorNames = ['Самарина Лариса Евгеньевна', 'Кочевников Анатолий Викторович', 'Иванова Мария Александровна', 'Петров Сергей Николаевич']

export type Doctor = { id: string; name: string; hours: string; rating: string }

export function doctorsFor(specialty: string): Doctor[] {
  return doctorNames.map((n, i) => ({
    id: `${specialty}-${i}`,
    name: n,
    hours: i === 3 ? 'Приём с 08:30 до 15:30' : 'Приём с 08:30 до 16:00',
    rating: ['4,9', '4,8', '4,7', '4,9'][i],
  }))
}

// 7 дней с понедельника 28 сентября; сегодня в прототипе — 26 сентября
export const days = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(2026, 8, 28 + i)
  return {
    key: d.toISOString().slice(0, 10),
    wd: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][d.getDay()],
    day: d.getDate(),
    label: d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }),
    weekday: d.toLocaleDateString('ru-RU', { weekday: 'long' }),
  }
})

const allSlots = ['08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '12:00', '13:30', '14:00', '15:00']

// Детерминированные свободные слоты: у кого-то пусто, у кого-то много
export function slotsFor(doctorId: string, dayKey: string): string[] {
  let h = 0
  for (const c of doctorId + dayKey) h = (h * 33 + c.charCodeAt(0)) >>> 0
  if (h % 7 === 0) return []
  return allSlots.filter((_, i) => ((h >> i) & 3) === 0 || (h >> (i + 3)) % 5 === 0).slice(0, 6)
}
