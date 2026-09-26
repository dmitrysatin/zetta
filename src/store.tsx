import { createContext, useContext, useState, type ReactNode } from 'react'
import { activities as baseActivities, people, type Activity, type Person } from './data'

type Store = {
  person: Person
  setPersonId: (id: string) => void
  notes: boolean
  setNotes: (v: boolean) => void
  activities: Activity[]
  addActivity: (a: Activity) => void
  booking: BookingDraft
  setBooking: (patch: Partial<BookingDraft>) => void
  resetBooking: () => void
  firstLogin: boolean
  setFirstLogin: (v: boolean) => void
}

export type BookingDraft = {
  clinicId?: string
  specialty?: string
  doctorId?: string
  day?: string
  time?: string
  // запись через оператора: желаемые даты и время суток
  wish: { day: string; part: string }[]
  symptoms: string
  temperature: string
  tempNormal: boolean
  sickLeave: boolean
  comment: string
}

const emptyBooking: BookingDraft = { wish: [], symptoms: '', temperature: '', tempNormal: false, sickLeave: false, comment: '' }

const Ctx = createContext<Store | null>(null)

function initialNotes(): boolean {
  const q = new URLSearchParams(window.location.hash.split('?')[1] || window.location.search)
  if (q.get('notes') === '0') return false
  try {
    return localStorage.getItem('zt-notes') !== '0'
  } catch {
    return true
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [personId, setPersonId] = useState('anna')
  const [notes, setNotesState] = useState(initialNotes)
  const [added, setAdded] = useState<Activity[]>([])
  const activities = [...added, ...baseActivities]
  const addActivity = (a: Activity) => setAdded((xs) => [a, ...xs.filter((x) => x.id !== a.id)])
  const [booking, setBookingState] = useState<BookingDraft>(emptyBooking)
  const setBooking = (patch: Partial<BookingDraft>) => setBookingState((b) => ({ ...b, ...patch }))
  const resetBooking = () => setBookingState(emptyBooking)
  const [firstLogin, setFirstLogin] = useState(false)
  const person = people.find((p) => p.id === personId) ?? people[0]
  const setNotes = (v: boolean) => {
    setNotesState(v)
    try {
      localStorage.setItem('zt-notes', v ? '1' : '0')
    } catch {
      /* без хранилища пометки просто не запоминаются */
    }
  }
  return <Ctx.Provider value={{ person, setPersonId, notes, setNotes, activities, addActivity, booking, setBooking, resetBooking, firstLogin, setFirstLogin }}>{children}</Ctx.Provider>
}

export function useStore(): Store {
  const s = useContext(Ctx)
  if (!s) throw new Error('StoreProvider missing')
  return s
}
