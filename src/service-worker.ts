/// <reference lib="webworker" />

declare var addEventListener: ServiceWorkerGlobalScope['addEventListener']
declare var skipWaiting: ServiceWorkerGlobalScope['skipWaiting']
declare var clients: ServiceWorkerGlobalScope['clients']

import { addOauth2Vault } from '@lazy/oauth2-service-worker-vault'

addEventListener('install', () => {
  skipWaiting()
})

addEventListener('activate', (event) => {
  event.waitUntil(clients.claim())
})

addOauth2Vault()
