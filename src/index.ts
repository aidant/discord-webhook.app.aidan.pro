import { handleAuthorizationCodeCallback } from '@lazy/oauth2-authorization-code-pkce-client'

handleAuthorizationCodeCallback()

import { SERVICE_WORKER_URL } from './environment'
import Application from './index.svelte'
import './style.css'

if (document.body instanceof HTMLBodyElement) {
  new Application({
    target: document.body,
  })
} else {
  addEventListener('load', () => {
    new Application({
      target: document.body,
    })
  })
}
