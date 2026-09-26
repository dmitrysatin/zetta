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
  kind: 'visit' | 'gp' | 'doctor-home' | 'emergency'
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
    place: 'Клиника «Медси», Белорусская',
    when: '8 июля',
    status: 'cancelled',
    statusText: 'Отменено',
    personId: 'anna',
  },
  {
    id: 'a5',
    kind: 'visit',
    title: 'Терапевт, Смирнова Е. В.',
    place: 'Клиника «Медси», Белорусская',
    when: '8 июля',
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
  clinic: 'Клиника «Медси», Белорусская',
  lines: [
    { service: 'Приём терапевта', date: '08.07.2026', cost: 2250, yourPart: 337.5, note: '15% от 2 250 ₽' },
    { service: 'Общий анализ крови', date: '08.07.2026', cost: 1000, yourPart: 150, note: '15% от 1 000 ₽' },
    { service: 'УЗИ брюшной полости', date: '08.07.2026', cost: 4000, yourPart: 600, note: '15% от 4 000 ₽' },
    { service: 'Приём офтальмолога', date: '08.07.2026', cost: 0, yourPart: 0, note: 'Приём отменён' },
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

export function rub(n: number): string {
  return (
    n.toLocaleString('ru-RU', {
      minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
      maximumFractionDigits: 2,
    }) + ' ₽'
  )
}
