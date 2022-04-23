import type {
  APIMessage,
  APIWebhook,
  RESTPostAPIWebhookWithTokenJSONBody,
} from 'discord-api-types/v10'
import { DISCORD_API_URL } from './environment'

type Method = 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT'

const discord = async (
  method: Method,
  path: `/${string}`,
  body?: FormData | object,
  reason?: string
) => {
  const response = await fetch(`${DISCORD_API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': typeof body === 'object' ? 'application/json; charset=utf-8' : undefined,
      'X-Audit-Log-Reason': reason,
    },
    body: typeof body === 'object' ? JSON.stringify(body) : body,
  })

  if (!response.ok) {
    throw new Error(await response.text())
  }

  return response.json()
}

type APIWebhookWithoutUser = Omit<APIWebhook, 'user'>

export const getWebhookWithToken = async (
  webhookId: string,
  token: string
): Promise<APIWebhookWithoutUser> => {
  return discord('GET', `/webhooks/${webhookId}/${token}`)
}

export const modifyWebhookWithToken = async (
  webhookId: string,
  token: string,
  body: Pick<APIWebhook, 'name' | 'avatar'>,
  reason?: string
): Promise<APIWebhookWithoutUser> => {
  return discord('PATCH', `/webhooks/${webhookId}/${token}`, body, reason)
}

export const deleteWebhookWithToken = async (
  webhookId: string,
  token: string,
  reason?: string
): Promise<void> => {
  return discord('DELETE', `/webhooks/${webhookId}/${token}`, undefined, reason)
}

export const executeWebhook = async (
  webhookId: string,
  token: string,
  body: Exclude<RESTPostAPIWebhookWithTokenJSONBody, 'attachments' | 'components'>,
  files: File[]
) => {
  const form = new FormData()
  const attachments: RESTPostAPIWebhookWithTokenJSONBody['attachments'] = []

  for (let index = 0; index < files.length; index++) {
    const file = files[index]
    form.append(`file[${index}]`, file)
    attachments.push({
      id: String(index),
      filename: file.name,
    })
  }

  form.append('payload_json', JSON.stringify({ ...body, attachments }))

  return discord('POST', `/webhooks/${webhookId}/${token}`, body)
}

export const getWebhookMessage = async (
  webhookId: string,
  token: string,
  messageId: string,
  threadId?: string
): Promise<APIMessage> => {
  return discord(
    'GET',
    threadId
      ? `/webhooks/${webhookId}/${token}/messages/${messageId}?thread_id=${threadId}`
      : `/webhooks/${webhookId}/${token}/messages/${messageId}`
  )
}

// TODO
export const editWebhookMessage = async (
  webhookId: string,
  token: string,
  messageId: string,
  body: FormData
): Promise<APIMessage> => {
  return discord('PATCH', `/webhooks/${webhookId}/${token}/messages/${messageId}`, body)
}

export const deleteWebhookMessage = async (
  webhookId: string,
  token: string,
  messageId: string
): Promise<void> => {
  return discord('DELETE', `/webhooks/${webhookId}/${token}/messages/${messageId}`)
}
