export const DISCORD_API_URL = 'https://discord.com/api/v10'
export const DISCORD_CLIENT_ID = '966872307308036148'
export const DISCORD_OAUTH2_SERVER_URL = 'https://discord.com/api/oauth2'
export const DISCORD_OAUTH2_AUTHORIZE_URL = 'https://discord.com/api/oauth2/authorize'
export const DISCORD_OAUTH2_TOKEN_URL = 'https://discord.com/api/oauth2/token'

export const SERVICE_WORKER_URL =
  new URL('./service-worker.ts', import.meta.url).href +
  '?' +
  new URLSearchParams({
    lazy_oauth2_client_id: DISCORD_CLIENT_ID,
    lazy_oauth2_token_url: DISCORD_OAUTH2_TOKEN_URL,
    lazy_oauth2_protected_hostname: 'discord.com',
    lazy_oauth2_protected_pathname: '/api/*',
  })
