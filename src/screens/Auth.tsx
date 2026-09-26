import { useEffect, useState, type ReactNode } from 'react'
import { navigate } from '../router'
import { useStore } from '../store'
import { Icon } from '../ui/Icon'
import { Note } from '../ui/Note'
import { Button, StatusBar } from '../ui/Screen'

function AuthScreen({ title, sub, children, back }: { title: string; sub?: string; children: ReactNode; back?: string }) {
  return (
    <div className="flex min-h-full flex-col bg-cover bg-top" style={{ backgroundImage: 'url(zt/auth-bg.jpg)' }}>
      <StatusBar />
      <div className="flex h-12 items-center px-2">
        {back && (
          <button onClick={() => navigate(back, { replace: true })} className="flex h-11 w-11 items-center justify-center text-white" aria-label="Назад">
            <Icon name="back" />
          </button>
        )}
      </div>
      <div className="px-6 pb-6 pt-4 text-white">
        <h1 className="text-[28px] font-bold leading-tight">{title}</h1>
        {sub && <p className="mt-2 text-[15px] text-white/85">{sub}</p>}
      </div>
      <div className="flex flex-1 flex-col rounded-t-[28px] bg-white px-5 pb-8 pt-6">{children}</div>
    </div>
  )
}

function Field({ label, type = 'text', value, onChange, placeholder, hint }: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  hint?: ReactNode
}) {
  return (
    <label className="mb-4 block">
      <span className="text-[13px] text-zt-text3">{label}</span>
      <input type={type} autoComplete={type === 'password' ? 'new-password' : 'off'} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1 h-12 w-full rounded-2xl bg-zt-bg3 px-4 text-[15px] outline-zt-accent" />
      {hint}
    </label>
  )
}

export function Login() {
  const [phone, setPhone] = useState('+7 916 123-45-67')
  const [pass, setPass] = useState('')
  return (
    <AuthScreen title="Вход в MyZetta" sub="Всё о вашем полисе ДМС в одном приложении">
      <Field label="Телефон или e-mail" value={phone} onChange={setPhone} />
      <Field label="Пароль" type="password" value={pass} onChange={setPass} placeholder="Пароль" />
      <button className="-mt-2 mb-6 self-start text-[14px] font-medium text-zt-accent" onClick={() => navigate('/wip?t=Восстановление пароля')}>Забыли пароль?</button>
      <Button onClick={() => navigate('/pin?next=/home', { replace: true })}>Войти</Button>
      <div className="mt-auto pt-8 text-center text-[14px] text-zt-text2">
        Первый раз в приложении?{' '}
        <button onClick={() => navigate('/register', { replace: true })} className="font-semibold text-zt-accent">Зарегистрироваться</button>
      </div>
    </AuthScreen>
  )
}

export function Register() {
  const [policy, setPolicy] = useState('ДМС-7781-0042')
  const [p1, setP1] = useState('')
  const [p2, setP2] = useState('')
  const rules = [
    { t: 'Не меньше 8 символов', ok: p1.length >= 8 },
    { t: 'Есть цифра', ok: /\d/.test(p1) },
    { t: 'Есть заглавная буква', ok: /[A-ZА-Я]/.test(p1) },
  ]
  const mismatch = p2.length > 0 && p1 !== p2
  return (
    <AuthScreen title="Регистрация" sub="Понадобится номер полиса — он есть в письме от работодателя или Зетты" back="/login">
      <Field label="Номер полиса" value={policy} onChange={setPolicy} />
      <Note
        at="out-right"
        what="«Подтверждение пароля» стоит сразу под паролем, требования к паролю — под обоими полями и отмечаются по мере ввода."
        finding="Отчёт, «Вход и первое знакомство»: поле подтверждения стояло под блоком требований к паролю, и один респондент его пропустил. Рекомендация 12."
      >
        <Field label="Пароль" type="password" value={p1} onChange={setP1} placeholder="Придумайте пароль" />
        <Field
          label="Подтверждение пароля"
          type="password"
          value={p2}
          onChange={setP2}
          placeholder="Повторите пароль"
          hint={mismatch ? <span className="mt-1 block text-[13px] text-zt-red">Пароли не совпадают</span> : undefined}
        />
      </Note>
      <ul className="-mt-1 mb-6 space-y-1.5">
        {rules.map((r) => (
          <li key={r.t} className={'flex items-center gap-2 text-[13px] ' + (r.ok ? 'text-zt-green' : 'text-zt-text3')}>
            <Icon name={r.ok ? 'check' : 'info'} size={15} />{r.t}
          </li>
        ))}
      </ul>
      <Button onClick={() => navigate('/pin?next=/home&first=1', { replace: true })}>Зарегистрироваться</Button>
    </AuthScreen>
  )
}

// Код быстрого входа: 4 цифры, крупные заметные точки
export function Pin({ next, first }: { next: string; first: boolean }) {
  const { setFirstLogin } = useStore()
  const [code, setCode] = useState('')
  const [stage, setStage] = useState<'create' | 'repeat'>('create')
  const [firstCode, setFirstCode] = useState('')
  const [error, setError] = useState(false)
  const press = (d: string) => {
    setError(false)
    setCode((c) => (c.length >= 4 ? c : c + d))
  }
  useEffect(() => {
    if (code.length < 4) return
    const t = setTimeout(() => {
      if (stage === 'create') {
        setFirstCode(code)
        setStage('repeat')
        setCode('')
      } else if (code === firstCode) {
        if (first) setFirstLogin(true)
        navigate(next, { replace: true })
      } else {
        setError(true)
        setCode('')
      }
    }, 180)
    return () => clearTimeout(t)
  }, [code, stage, firstCode, first, next, setFirstLogin])
  return (
    <AuthScreen title={stage === 'create' ? 'Придумайте код' : 'Повторите код'} sub="4 цифры для быстрого входа в приложение">
      <Note
        at="out-right"
        what="Код быстрого входа из 4 цифр вместо 6, точки крупные и контрастные."
        finding="Отчёт, «Вход и первое знакомство»: трое ждали код короче; бледные точки — один респондент насчитал пять вместо шести. Рекомендация 11."
      >
        <div className="flex justify-center gap-5 py-4">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={'h-4 w-4 rounded-full border-2 ' + (error ? 'border-zt-red bg-zt-red/20' : i < code.length ? 'border-zt-accent bg-zt-accent' : 'border-zt-text3 bg-white')} />
          ))}
        </div>
      </Note>
      <div className="h-6 text-center text-[14px] text-zt-red">{error ? 'Коды не совпали, попробуйте ещё раз' : ''}</div>
      <div className="mx-auto mt-2 grid w-64 grid-cols-3 gap-4">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((k, i) =>
          k === '' ? (
            <span key={i} />
          ) : (
            <button
              key={i}
              onClick={() => (k === '⌫' ? setCode((c) => c.slice(0, -1)) : press(k))}
              className="flex h-16 w-16 items-center justify-center justify-self-center rounded-full bg-zt-bg2 text-[24px] font-medium active:bg-zt-mint"
            >
              {k}
            </button>
          ),
        )}
      </div>
      <button onClick={() => navigate(next, { replace: true })} className="mt-6 text-center text-[14px] font-medium text-zt-text3">Пропустить</button>
    </AuthScreen>
  )
}

// Подсказка новичку на главной: где теперь полис, записи и заявки
export function FirstLoginTip() {
  const { firstLogin, setFirstLogin } = useStore()
  if (!firstLogin) return null
  return (
    <Note
      className="mb-5"
      at="out-right"
      what="При первом входе — короткая подсказка, где лежит «своё». Закрывается одним нажатием."
      finding="Отчёт, «Вход и первое знакомство»: предложено показать новичку, где «основная информация обо мне»; пользователям текущего приложения в первые дни понадобятся подсказки. Онбординг Зетта уже прорабатывает."
    >
      <div className="rounded-3xl bg-zt-lavender p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="text-[16px] font-semibold">Где что лежит</div>
          <button onClick={() => setFirstLogin(false)} aria-label="Закрыть" className="text-zt-text3"><Icon name="close" size={18} /></button>
        </div>
        <ul className="mt-2 space-y-1.5 text-[14px] leading-snug text-zt-text2">
          <li><b className="text-zt-text">Полис, программа, финансы</b> — в ряду кнопок наверху</li>
          <li><b className="text-zt-text">Ваши записи и заявки</b> — сразу под ними</li>
          <li><b className="text-zt-text">Профиль</b> — нажмите на аватар слева вверху</li>
        </ul>
        <button onClick={() => setFirstLogin(false)} className="mt-3 h-10 w-full rounded-full bg-white text-[14px] font-semibold text-zt-accent">Понятно</button>
      </div>
    </Note>
  )
}
