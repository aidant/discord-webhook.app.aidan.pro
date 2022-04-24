export const pushState = (href: string) => {
  history.pushState(null, '', href)
  dispatchEvent(
    new PopStateEvent('popstate', { bubbles: false, cancelable: false, composed: false })
  )
}

class PushStateHTMLAnchorElement extends HTMLAnchorElement {
  #handleClick(event: MouseEvent) {
    if (!this.href) return
    if (this.target === '_blank') return
    if (event.metaKey || event.shiftKey) return

    pushState(this.href)
    event.preventDefault()
  }

  connectedCallback() {
    this.addEventListener('click', this.#handleClick.bind(this))
  }
  disconnectedCallback() {
    this.removeEventListener('click', this.#handleClick.bind(this))
  }
}

customElements.define('lazy-router-anchor', PushStateHTMLAnchorElement, { extends: 'a' })

export interface RouteOptions {
  path?: string | string[]
  query?: { [key: string]: string } | string[]
}

export const route = (
  options: RouteOptions,
  callback: (props: {} | null) => void
): (() => void) => {
  const optionsPath = Array.isArray(options.path)
    ? options.path
    : options.path
    ? [options.path]
    : []
  const optionsQuery = Array.isArray(options.query)
    ? options.query.map((query) => [query, query])
    : Object.entries(options.query || {})

  // @ts-expect-error
  const pathMatchers = optionsPath.map((path) => new URLPattern({ pathname: path }))

  const handlePopState = () => {
    let url = new URL(location.href)
    const result = Object.create(null)

    for (const pathMatcher of pathMatchers) {
      const matched = pathMatcher.exec(url.href)
      if (!matched) continue

      Object.assign(
        result,
        matched.protocol.groups,
        matched.username.groups,
        matched.password.groups,
        matched.hostname.groups,
        matched.port.groups,
        matched.pathname.groups,
        matched.search.groups,
        matched.hash.groups
      )
    }

    for (const [key, value] of optionsQuery) {
      if (url.searchParams.has(key)) {
        result[value] = url.searchParams.get(key)
      }
    }

    if (Object.keys(result).length) {
      callback(result)
    } else {
      callback(null)
    }
  }

  handlePopState()

  addEventListener('popstate', handlePopState)
  return () => removeEventListener('popstate', handlePopState)
}

export interface RouterOptions {
  [key: string]: RouteOptions
}

export const router = (routerOptions: RouterOptions, callback: Function): (() => void) => {
  const subscriptions = []
  const result = {}

  let isCallbackQueued = false
  const queueCallback = () => {
    if (isCallbackQueued) return
    isCallbackQueued = true
    queueMicrotask(() => {
      callback(result)
      isCallbackQueued = false
    })
  }

  for (const [name, routeOptions] of Object.entries(routerOptions)) {
    subscriptions.push(
      route(routeOptions, (props) => {
        result[name] = props
        queueCallback()
      })
    )
  }

  return () => {
    for (const unsubscribe of subscriptions) {
      unsubscribe()
    }
  }
}
