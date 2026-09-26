import { useEffect, useState } from 'react'

// Хеш-роутинг: работает с любого статического хостинга и из файла.
// Глубина хранится в history.state — «назад» внутри прототипа никогда не
// уводит за пределы приложения и не зацикливается: без истории он ведёт
// на главную.

export type Route = { path: string; params: URLSearchParams }

function parse(): Route {
  const raw = window.location.hash.replace(/^#/, '') || '/start'
  const [path, query = ''] = raw.split('?')
  return { path: path || '/start', params: new URLSearchParams(query) }
}

function depth(): number {
  return (window.history.state && window.history.state.depth) || 0
}

export function navigate(to: string, opts: { replace?: boolean } = {}) {
  const url = '#' + to
  if (opts.replace) {
    window.history.replaceState({ depth: depth() }, '', url)
  } else {
    window.history.pushState({ depth: depth() + 1 }, '', url)
  }
  window.dispatchEvent(new HashChangeEvent('hashchange'))
  document.getElementById('screen-scroll')?.scrollTo(0, 0)
}

export function goBack(fallback = '/home') {
  if (depth() > 0) {
    window.history.back()
  } else {
    navigate(fallback, { replace: true })
  }
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(parse)
  useEffect(() => {
    const on = () => setRoute(parse())
    window.addEventListener('hashchange', on)
    window.addEventListener('popstate', on)
    // Дочерний экран мог сменить адрес раньше, чем подписались (прямая ссылка /go) — синхронизируемся
    on()
    return () => {
      window.removeEventListener('hashchange', on)
      window.removeEventListener('popstate', on)
    }
  }, [])
  return route
}
