import { useState } from 'react'
import { franchise, invoice, people, rub } from '../data'
import { navigate } from '../router'
import { useStore } from '../store'
import { Icon } from '../ui/Icon'
import { Note } from '../ui/Note'
import { Button, Group, Row, Sheet } from '../ui/Screen'

export function Finances() {
  return (
    <Sheet title="Мои финансы" close>
      <Group>
        <Row icon="shield" title="Франшиза" sub="Ваша часть за приёмы и баланс" right={<span className="text-[14px] font-semibold">{rub(franchise.balance)}</span>} onClick={() => navigate('/franchise')} />
        <Row icon="doc" title="Счета" sub={`Счёт №${invoice.number} · ${invoice.status.toLowerCase()}`} onClick={() => navigate('/invoices')} />
        <Row icon="heart" title="Баланс на лекарства" right={<span className="text-[14px] font-semibold">{rub(franchise.drugsBalance)}</span>} onClick={() => navigate('/wip?t=Баланс на лекарства')} />
      </Group>
    </Sheet>
  )
}

// Раздел франшизы: сначала ответ на главный вопрос — сколько с меня за приём, потом баланс.
export function Franchise() {
  const owner = people[0]
  return (
    <Sheet title="Франшиза" close>
      <Note
        at="out-right"
        what="Первым на экране — «Ваша часть за последние приёмы»: услуги, их стоимость и сумма к оплате. Отсюда же — счёт и все счета."
        finding="Отчёт, тема 1: шестеро из семи искали списания на экране франшизы; «Я бы ожидала, что у меня тут последние списания, история, как в этом банковском» (респондент). Рекомендация 1."
      >
        <div className="rounded-3xl bg-white p-4 shadow-zt-card">
          <div className="text-[17px] font-semibold">Ваша часть за последние приёмы</div>
          <div className="mt-0.5 text-[13px] text-zt-text3">7 июля · {invoice.clinic}</div>
          <div className="mt-3 divide-y divide-zt-stroke">
            {invoice.lines.map((l) => (
              <div key={l.service} className="flex items-start justify-between gap-3 py-2.5">
                <div>
                  <div className={'text-[15px] ' + (l.cost === 0 ? 'text-zt-text3 line-through' : '')}>{l.service}</div>
                  <div className="text-[12.5px] text-zt-text3">{l.note}</div>
                </div>
                <div className="shrink-0 text-[15px] font-semibold">{rub(l.yourPart)}</div>
              </div>
            ))}
          </div>
          <div className="mt-1 flex items-center justify-between border-t border-zt-text/10 pt-3">
            <span className="text-[15px] font-semibold">Итого ваша часть</span>
            <span className="text-[17px] font-bold">{rub(invoice.total)}</span>
          </div>
          <button onClick={() => navigate('/invoice')} className="mt-3 flex w-full items-center justify-between rounded-2xl bg-zt-peach px-3.5 py-3 text-left">
            <span>
              <span className="block text-[14px] font-semibold">Счёт №{invoice.number} от {invoice.date}</span>
              <span className="block text-[12.5px] text-zt-orange">{invoice.status}: {rub(invoice.total)}</span>
            </span>
            <span className="flex items-center gap-1 text-[13px] font-medium text-zt-accent">Подробнее <Icon name="chevron" size={16} /></span>
          </button>
          <button onClick={() => navigate('/invoices')} className="mt-2 w-full py-2 text-center text-[14px] font-semibold text-zt-accent">Все счета</button>
        </div>
      </Note>

      <Note
        className="mt-4"
        what="Вместо повтора «Франшиза активирована / Ваша франшиза активна» — пример расчёта на реальном приёме."
        finding="Отчёт, раздел «Названия»: заголовок и первая строка повторяли друг друга (респондент); предложен пример «приём 2 250 ₽, ваша часть — 15 %, 337,50 ₽». Рекомендация 10."
      >
        <div className="flex gap-3 rounded-2xl bg-zt-mint p-4">
          <Icon name="info" className="shrink-0 text-zt-accent" />
          <div className="text-[14px] leading-snug text-zt-text2">
            <b className="text-zt-text">Как считается.</b> По вашей программе вы оплачиваете {franchise.percent}% стоимости каждой услуги. Приём терапевта стоит 2 250 ₽, ваша часть — 337,50 ₽.
          </div>
        </div>
      </Note>

      <h2 className="mb-2 mt-6 text-[17px] font-semibold">
        <Note
          className="inline-block pr-6"
          what="«Сумма обеспечительного платежа на балансе» → «Баланс» с объяснением, зачем он нужен."
          finding="Отчёт, тема 1: «Обеспечительный платёж — это вообще никто не понимает» (респондент); шестеро из семи не сразу поняли, зачем отдельный баланс. Рекомендация 10."
        >
          Баланс
        </Note>
      </h2>
      <div className="rounded-3xl bg-white p-4 shadow-zt-card">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[28px] font-bold leading-none">{rub(franchise.balance)}</div>
            <div className="mt-1 text-[13px] text-zt-text3">из {rub(franchise.deposit)} по полису</div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-zt-bg2 px-3 py-2 text-[13px]">
            <span className="flex">
              <span className="h-4 w-4 rounded-full bg-[#eb001b]" />
              <span className="-ml-1.5 h-4 w-4 rounded-full bg-[#f79e1b] opacity-90" />
            </span>
            {franchise.card}
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-zt-bg2">
          <div className="h-full rounded-full bg-zt-accent" style={{ width: `${(franchise.balance / franchise.deposit) * 100}%` }} />
        </div>
        <p className="mt-3 text-[13px] leading-snug text-zt-text2">
          Из этих денег оплачивается ваша часть за приёмы. Когда полис закончится, остаток можно вернуть.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={() => navigate('/wip?t=Пополнить баланс')}>Пополнить</Button>
          <Button variant="secondary" onClick={() => navigate('/refund')}>Вернуть</Button>
        </div>
      </div>

      <Group title="Ещё">
        <Row icon="heart" title="Баланс на лекарства" right={<span className="text-[14px] font-semibold">{rub(franchise.drugsBalance)}</span>} onClick={() => navigate('/wip?t=Баланс на лекарства')} />
        <Row icon="shield" title={owner.name} sub={`Полис ${owner.policy} · до ${owner.validTill}`} onClick={() => navigate('/policy?id=' + owner.id)} />
      </Group>
    </Sheet>
  )
}

export function Invoices() {
  return (
    <Sheet title="Счета" close>
      <div className="mb-2 text-[13px] text-zt-text3">Июль 2026</div>
      <button onClick={() => navigate('/invoice')} className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-zt-card">
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold">Счёт №{invoice.number} от {invoice.date}</span>
          <span className="block text-[13px] text-zt-text3">{invoice.clinic} · 4 услуги</span>
        </span>
        <span className="text-right">
          <span className="block text-[15px] font-semibold">{rub(invoice.total)}</span>
          <span className="block text-[12px] font-medium text-zt-orange">{invoice.status}</span>
        </span>
        <Icon name="chevron" size={18} className="text-zt-text3" />
      </button>
      <div className="mb-2 mt-5 text-[13px] text-zt-text3">Май 2026</div>
      <div className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 shadow-zt-card">
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold">Счёт №099874 от 14.05.2026</span>
          <span className="block text-[13px] text-zt-text3">{invoice.clinic} · 1 услуга</span>
        </span>
        <span className="text-right">
          <span className="block text-[15px] font-semibold">{rub(337.5)}</span>
          <span className="block text-[12px] font-medium text-zt-green">Оплачен</span>
        </span>
      </div>
    </Sheet>
  )
}

export function Invoice() {
  const [open, setOpen] = useState<number | null>(null)
  const owner = people[0]
  return (
    <Sheet title="Счёт" close>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[20px] font-bold">Счёт №{invoice.number}</div>
          <div className="text-[13px] text-zt-text3">от {invoice.date} · {invoice.clinic}</div>
        </div>
        <span className="rounded-full bg-zt-peach px-2.5 py-1 text-[12px] font-semibold text-zt-orange">{invoice.status}</span>
      </div>
      <Note
        className="mt-4"
        at="out-right"
        what="У каждой строки подпись «Подробнее» и стрелка, раскрытая строка показывает стоимость, вашу часть и застрахованного; номер полиса — в деталях."
        finding="Отчёт, тема 1: сумму за приём показывает только раскрытая строка, четверо раскрыли её лишь после подсказки. Застрахованный в строке — предложение из раздела «Где мнения разошлись». Рекомендация 8."
      >
        <div className="divide-y divide-zt-stroke overflow-hidden rounded-2xl bg-white shadow-zt-card">
          {invoice.lines.map((l, i) => (
            <div key={l.service}>
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-medium">{l.service}</span>
                  <span className="block text-[12.5px] text-zt-text3">{l.cost ? `${owner.short} · ${l.date}` : l.note}</span>
                </span>
                <span className="text-right">
                  <span className="block text-[15px] font-semibold">{rub(l.yourPart)}</span>
                  <span className="flex items-center justify-end gap-0.5 text-[12px] font-medium text-zt-accent">
                    {open === i ? 'Свернуть' : 'Подробнее'}
                    <Icon name="down" size={14} className={open === i ? 'rotate-180' : ''} />
                  </span>
                </span>
              </button>
              {open === i && (
                <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 bg-zt-bg3 px-4 py-3.5 text-[13px]">
                  <div><div className="text-zt-text3">Стоимость услуги</div><div className="font-medium">{rub(l.cost)}</div></div>
                  <div><div className="text-zt-text3">Ваша часть</div><div className="font-medium">{l.cost ? `${franchise.percent}% · ${rub(l.yourPart)}` : '—'}</div></div>
                  <div><div className="text-zt-text3">Застрахованный</div><div className="font-medium">{owner.short}</div></div>
                  <div><div className="text-zt-text3">Дата оказания</div><div className="font-medium">{l.date}</div></div>
                  <div><div className="text-zt-text3">Полис</div><div className="font-medium">{owner.policy}</div></div>
                  <div><div className="text-zt-text3">Клиника</div><div className="font-medium">{invoice.clinic}</div></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Note>
      <div className="mt-4 flex items-center justify-between px-1">
        <span className="text-[15px] font-semibold">К оплате</span>
        <span className="text-[20px] font-bold">{rub(invoice.total)}</span>
      </div>
      <Button className="mt-4" onClick={() => navigate('/wip?t=Оплата счёта')}>Оплатить {rub(invoice.total)}</Button>
    </Sheet>
  )
}

export function Refund() {
  const [to, setTo] = useState<'card' | 'account'>('card')
  const owner = people[0]
  const { addActivity } = useStore()
  return (
    <Sheet title="Возврат остатка" close>
      <div className="rounded-3xl bg-zt-mint p-4">
        <div className="text-[13px] text-zt-text2">Сумма к возврату</div>
        <div className="text-[28px] font-bold">{rub(franchise.balance)}</div>
      </div>
      <h2 className="mb-2 mt-5 text-[17px] font-semibold">Куда вернуть</h2>
      <Note
        at="out-right"
        what="По умолчанию возврат на привязанную карту, без паспорта и реквизитов. Реквизиты — только если выбрать «На другой счёт». Паспорт подставляется из профиля."
        finding="Отчёт, тема 1: до формы возврата дошли пятеро, четверо пожаловались на ручной ввод реквизитов при привязанной карте. Рекомендация 9 — если Зетта это допускает (вопросы к правилам 2 и 3)."
      >
        <div className="divide-y divide-zt-stroke overflow-hidden rounded-2xl bg-white shadow-zt-card">
          {[
            { id: 'card' as const, t: `На карту ${franchise.card}`, s: 'Та же карта, с которой пополняли баланс' },
            { id: 'account' as const, t: 'На другой счёт', s: 'Понадобятся БИК и номер счёта' },
          ].map((o) => (
            <button key={o.id} onClick={() => setTo(o.id)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
              <span className={'flex h-5 w-5 items-center justify-center rounded-full border-2 ' + (to === o.id ? 'border-zt-accent' : 'border-zt-inactive')}>
                {to === o.id && <span className="h-2.5 w-2.5 rounded-full bg-zt-accent" />}
              </span>
              <span className="flex-1">
                <span className="block text-[15px] font-medium">{o.t}</span>
                <span className="block text-[13px] text-zt-text3">{o.s}</span>
              </span>
            </button>
          ))}
        </div>
      </Note>
      {to === 'account' && (
        <div className="mt-4 space-y-3">
          {['БИК банка', 'Номер счёта', 'Получатель'].map((f) => (
            <label key={f} className="block">
              <span className="text-[13px] text-zt-text3">{f}</span>
              <input defaultValue={f === 'Получатель' ? owner.name : ''} className="mt-1 h-12 w-full rounded-2xl bg-zt-bg3 px-4 text-[15px] outline-zt-accent" />
            </label>
          ))}
        </div>
      )}
      <div className="mt-4 flex gap-3 rounded-2xl bg-zt-bg2 p-3.5 text-[13px] text-zt-text2">
        <Icon name="user" size={18} className="shrink-0 text-zt-text3" />
        Паспортные данные возьмём из профиля: {owner.short}, паспорт •• 4512.
      </div>
      <Button className="mt-5" onClick={() => {
          addActivity({
            id: 'refund',
            kind: 'refund',
            title: `Возврат остатка ${rub(franchise.balance)}`,
            place: to === 'card' ? `На карту ${franchise.card}` : 'На счёт по реквизитам',
            when: 'Заявка от 26 сентября',
            status: 'review',
            statusText: 'В обработке',
            personId: owner.id,
          })
          navigate('/refund-done', { replace: true })
        }}>Вернуть {rub(franchise.balance)}</Button>
    </Sheet>
  )
}

export function RefundDone() {
  return (
    <Sheet title="" back={false} close>
      <div className="flex flex-col items-center pt-8 text-center">
        <img src="zt/auth-success.png" alt="" className="w-36" />
        <h2 className="mt-4 text-[20px] font-bold">Заявка на возврат принята</h2>
        <p className="mt-2 max-w-72 text-[14px] text-zt-text2">{rub(franchise.balance)} вернутся на карту {franchise.card}. Статус заявки — в «Моих записях и заявках».</p>
        <Button className="mt-6" onClick={() => navigate('/activities', { replace: true })}>Мои записи и заявки</Button>
        <Button variant="ghost" className="mt-1" onClick={() => navigate('/home', { replace: true })}>На главную</Button>
      </div>
    </Sheet>
  )
}
