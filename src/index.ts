import { handleAuthorizationCodeCallback } from '@lazy/oauth2-authorization-code-pkce-client'

handleAuthorizationCodeCallback()

import { SERVICE_WORKER_URL } from './environment'
import Application from './index.svelte'
import './style.css'

addEventListener('load', async () => {
  // await navigator.serviceWorker.register(SERVICE_WORKER_URL, { type: 'module' })

  new Application({
    target: document.body,
  })
})
