import { people } from '../data'
import { goBack, navigate } from '../router'
import { useStore } from '../store'
import { Icon } from '../ui/Icon'
import { Note } from '../ui/Note'
import { Group, Row, Sheet, StatusBar } from '../ui/Screen'

export function Profile() {
  const { person } = useStore()
  const owner = people[0]
  const isChild = person.id !== owner.id

  return (
    <div className="flex min-h-full flex-col">
      <div className="zt-gradient">
        <StatusBar />
        <Note
          className="px-4 pb-8 pt-2"
          what="Профиль показывает того, кто выбран: имя, возраст и полис ребёнка. Владелец аккаунта указан отдельной строкой."
          finding="Отчёт, тема 2: в профиле ребёнка было имя родителя, так в четырёх сессиях. «Почему здесь Анна Сергеевна?» (Андрей, PMI). Рекомендация 4."
        >
          <button onClick={() => navigate('/insured')} className="flex w-full items-center gap-3 text-left text-white">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[18px] font-bold text-zt-accent">{person.initials}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-[18px] font-semibold leading-tight">{person.name}</span>
              <span className="block text-[13px] text-white/85">
                {isChild ? `${person.relation} · ${person.age} · ${person.birth}` : `Владелец аккаунта · ${person.phone}`}
              </span>
              {isChild && <span className="block text-[12px] text-white/70">Управляет: {owner.short}</span>}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[12px] font-medium">
              <Icon name="swap" size={14} /> Сменить
            </span>
          </button>
        </Note>
      </div>
      <div className="zt-gradient flex flex-1 flex-col">
        <div className="-mt-4 flex-1 rounded-t-[28px] bg-white px-4 pb-32">
          <div className="flex h-14 items-center">
            <button onClick={() => goBack()} className="-ml-2 flex h-11 w-11 items-center justify-center" aria-label="Назад"><Icon name="back" /></button>
            <h1 className="flex-1 pr-9 text-center text-[19px] font-bold">Профиль</h1>
          </div>

          <div className="mt-1 rounded-2xl bg-zt-mint p-4">
            <div className="text-[13px] text-zt-text2">Полис ДМС · программа «{person.program}»</div>
            <div className="mt-0.5 text-[17px] font-semibold">{person.policy}</div>
            <div className="text-[13px] text-zt-text2">Действует до {person.validTill}</div>
            <button onClick={() => navigate('/policy?id=' + person.id)} className="mt-3 h-10 rounded-full bg-zt-accent px-5 text-[14px] font-semibold text-white">Открыть полис</button>
          </div>

          {!isChild && (
            <Group>
              <Row icon="bell" title="Уведомления" right={<span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-zt-red px-1.5 text-[11px] font-bold text-white">4</span>} onClick={() => navigate('/wip?t=Уведомления')} />
            </Group>
          )}

          <Group title="Страхование">
            <Note
              what="«Активные полисы и архив» → «Полисы и архив»."
              finding="Отчёт, раздел «Названия»: первым читается «активные» (Александр, Райффайзенбанк). Рекомендация 10."
            >
              <Row icon="shield" title="Полисы и архив" onClick={() => navigate('/policies')} />
            </Note>
            <Row icon="list" title="Моя программа" onClick={() => navigate('/program')} />
            {!isChild && <Row icon="wallet" title="Мои финансы" sub="Франшиза, счета, возврат" onClick={() => navigate('/finances')} />}
            <Row icon="doc" title="Документы" onClick={() => navigate('/wip?t=Документы')} />
          </Group>

          <Group title="Записи и обращения">
            <Note
              what="В профиле те же входы, что на главной: записи и заявки, гарантийные письма."
              finding="Отчёт, тема 2: «Если у меня есть профиль, то всё, что касается меня: моя программа, мои записи, мои гарантийные письма» (Татьяна, mk3). Рекомендации 2 и 5."
            >
              <Row icon="calendar" title="Мои записи и заявки" onClick={() => navigate('/activities')} />
            </Note>
            <Row icon="doc" title="Гарантийные письма" onClick={() => navigate('/gp')} />
            <Row icon="chat" title="Мои обращения" onClick={() => navigate('/wip?t=Мои обращения')} />
          </Group>

          {!isChild && (
            <Group title="Приложение">
              <Row icon="settings" title="Настройки" onClick={() => navigate('/wip?t=Настройки')} />
              <Row icon="logout" title="Выйти" danger onClick={() => navigate('/login')} />
            </Group>
          )}
        </div>
      </div>
    </div>
  )
}

export function Insured() {
  const { person, setPersonId } = useStore()
  return (
    <Sheet title="Кто застрахован" header={false}>
      <p className="mb-3 text-[14px] text-zt-text2">Главная, записи и полис покажут выбранного человека.</p>
      <div className="divide-y divide-zt-stroke overflow-hidden rounded-2xl bg-white shadow-zt-card">
        {people.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setPersonId(p.id)
              goBack()
            }}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-zt-mint text-[14px] font-bold text-zt-accent">{p.initials}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-medium">{p.name}</span>
              <span className="block text-[13px] text-zt-text3">{p.relation} · {p.policy}</span>
            </span>
            {p.id === person.id && <Icon name="check" className="text-zt-accent" />}
          </button>
        ))}
      </div>
      <button onClick={() => navigate('/profile')} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-zt-mint py-3 text-[15px] font-semibold text-zt-accent">
        <Icon name="user" size={18} /> Профиль: {person.short}
      </button>
    </Sheet>
  )
}

export function Wip({ title }: { title: string }) {
  return (
    <Sheet title={title} close>
      <div className="flex flex-col items-center pt-10 text-center">
        <img src="zt/ops-empty.png" alt="" className="w-44" />
        <h2 className="mt-4 text-[18px] font-semibold">Раздел в прототипе не прорабатывали</h2>
        <p className="mt-1.5 max-w-72 text-[14px] text-zt-text2">В тестировании он не участвовал. Вернитесь назад или на главную.</p>
        <button onClick={() => goBack()} className="mt-6 h-12 w-60 rounded-full bg-zt-accent text-[16px] font-semibold text-white">Назад</button>
        <button onClick={() => navigate('/home')} className="mt-2 h-12 w-60 rounded-full text-[16px] font-semibold text-zt-accent">На главную</button>
      </div>
    </Sheet>
  )
}
