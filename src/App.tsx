import { useEffect } from 'react'
import { useRoute } from './router'
import { StoreProvider } from './store'
import { Home } from './screens/Home'
import { Insured, Profile, Wip } from './screens/Profile'
import { TabBar } from './ui/Screen'
import { Finances, Franchise, Invoice, Invoices, Refund, RefundDone } from './screens/Finances'
import { Activities, ActivityDetail } from './screens/Activities'
import { Policies, Policy, Program } from './screens/Policy'
import { Login, Pin, Register } from './screens/Auth'
import { Go, Start } from './screens/Start'
import { Appeals, GpDone, GpForm, GpList, GpNew } from './screens/Gp'
import { BookingClinic, BookingComplaints, BookingConfirm, BookingDoctors, BookingDone, BookingSpecialty, BookingWish, Clinics } from './screens/Booking'

// Экраны с нижней панелью. Остальные — пошаговые сценарии, где панель мешает.
const tabbed: Record<string, string> = {
  '/home': 'home',
  '/profile': 'home',
  '/activities': 'home',
  '/policies': 'home',
  '/program': 'home',
  '/finances': 'home',
  '/franchise': 'home',
  '/gp': 'home',
  '/appeals': 'home',
  '/contacts': 'home',
  '/invoices': 'home',
  '/invoice': 'home',
  '/policy': 'home',
  '/activity': 'home',
  '/clinics': 'clinics',
  '/wip': '',
}

function Screens() {
  const { path, params } = useRoute()
  useEffect(() => {
    document.getElementById('screen-scroll')?.scrollTo(0, 0)
  }, [path])

  let screen
  switch (path) {
    case '/start':
      screen = <Start />
      break
    case '/go':
      screen = <Go task={params.get('task') || ''} notes={params.get('notes')} />
      break
    case '/home':
      screen = <Home />
      break
    case '/profile':
      screen = <Profile />
      break
    case '/insured':
      screen = <Insured />
      break
    case '/finances':
      screen = <Finances />
      break
    case '/franchise':
      screen = <Franchise />
      break
    case '/invoices':
      screen = <Invoices />
      break
    case '/invoice':
      screen = <Invoice />
      break
    case '/refund':
      screen = <Refund />
      break
    case '/refund-done':
      screen = <RefundDone />
      break
    case '/activities':
      screen = <Activities />
      break
    case '/activity':
      screen = <ActivityDetail id={params.get('id') || ''} />
      break
    case '/policies':
      screen = <Policies />
      break
    case '/policy':
      screen = <Policy id={params.get('id')} />
      break
    case '/program':
      screen = <Program />
      break
    case '/clinics':
      screen = <Clinics />
      break
    case '/booking':
      screen = <BookingClinic />
      break
    case '/booking/specialty':
      screen = <BookingSpecialty clinicParam={params.get('clinic')} />
      break
    case '/booking/doctors':
      screen = <BookingDoctors />
      break
    case '/booking/wish':
      screen = <BookingWish />
      break
    case '/booking/complaints':
      screen = <BookingComplaints />
      break
    case '/booking/confirm':
      screen = <BookingConfirm />
      break
    case '/booking/done':
      screen = <BookingDone />
      break
    case '/gp':
      screen = <GpList />
      break
    case '/gp/new':
      screen = <GpNew />
      break
    case '/gp/form':
      screen = <GpForm type={params.get('type') || 'service'} />
      break
    case '/gp/done':
      screen = <GpDone />
      break
    case '/appeals':
      screen = <Appeals />
      break
    case '/login':
      screen = <Login />
      break
    case '/register':
      screen = <Register />
      break
    case '/pin':
      screen = <Pin next={params.get('next') || '/home'} first={params.get('first') === '1'} />
      break
    case '/wip':
      screen = <Wip title={params.get('t') || 'Раздел'} />
      break
    default:
      // Этапы 2–4 ещё впереди: любой непостроенный маршрут ведёт на заглушку с рабочим «назад»
      screen = <Wip title="Скоро в прототипе" />
  }
  const tab = tabbed[path]

  return (
    <div className="relative h-full overflow-hidden">
      <div id="screen-scroll" className="no-scrollbar h-full overflow-y-auto">{screen}</div>
      {tab !== undefined && <TabBar active={tab} />}
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <div className="flex min-h-full items-center justify-center sm:py-3">
        <div className="relative h-[100dvh] w-full overflow-hidden bg-white sm:h-[min(844px,calc(100dvh-24px))] sm:w-[390px] sm:rounded-[44px] sm:shadow-2xl sm:ring-8 sm:ring-[#1b1f24]">
          <Screens />
          <div id="note-layer" />
        </div>
      </div>
    </StoreProvider>
  )
}
