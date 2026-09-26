import { createContext, useContext, useState, type ReactNode } from 'react'
import { people, type Person } from './data'

type Store = {
  person: Person
  setPersonId: (id: string) => void
  notes: boolean
  setNotes: (v: boolean) => void
}

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
  const person = people.find((p) => p.id === personId) ?? people[0]
  const setNotes = (v: boolean) => {
    setNotesState(v)
    try {
      localStorage.setItem('zt-notes', v ? '1' : '0')
    } catch {
      /* без хранилища пометки просто не запоминаются */
    }
  }
  return <Ctx.Provider value={{ person, setPersonId, notes, setNotes }}>{children}</Ctx.Provider>
}

export function useStore(): Store {
  const s = useContext(Ctx)
  if (!s) throw new Error('StoreProvider missing')
  return s
}
