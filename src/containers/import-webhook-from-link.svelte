<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import { writable } from 'svelte/store'
  import type { Webhook } from '../database'
  import { customValidationText, customValidatorFunction, type Validator } from '../utilities'

  export let webhookURL = ''
  let webhookURLValidationText = writable('')
  const dispatch = createEventDispatcher<{ webhook: Webhook }>()

  const isWebhookURLInvalid: Validator = (webhookURL: string) => {
    if (
      webhookURL &&
      !/^https:\/\/discord\.com\/api\/webhooks\/[0-9]+\/[a-zA-Z0-9-_]+\/?$/.test(webhookURL)
    ) {
      return 'Please enter a valid Webhook URL'
    }
  }

  onMount(async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (!isWebhookURLInvalid(text)) {
        webhookURL = text
      }
    } catch {}
  })

  const handlePaste = (event: ClipboardEvent) => {
    if (event.target instanceof HTMLInputElement) {
      return
    }

    const text = event.clipboardData.getData('text/plain')
    if (!isWebhookURLInvalid(text)) {
      webhookURL = text
    }
  }

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault()

    if (webhookURL && !isWebhookURLInvalid(webhookURL)) {
      const [webhookId, webhookToken] = webhookURL.substring(33).split('/')
      dispatch('webhook', { webhookId, webhookToken })
    }
  }
</script>

<svelte:window on:paste={handlePaste} />

<div class="my-4 inline-block">
  <form on:submit={handleSubmit}>
    <label for="webhook-url">Add an existing Webhook URL</label>
    <div class="flex flex-row gap-2 py-1">
      <input
        id="webhook-url"
        type="url"
        name="webhookURL"
        class="inline-block w-full rounded border-2 px-2 py-1 invalid:border-rose-500"
        placeholder="https://discord.com/api/webhooks/"
        use:customValidatorFunction={isWebhookURLInvalid}
        use:customValidationText={webhookURLValidationText}
        on:submit={handleSubmit}
        bind:value={webhookURL}
      />
      <button
        type="submit"
        class="rounded bg-rose-500 px-4 py-1 text-white"
        aria-label="Add Webhook"
      >
        Add
      </button>
    </div>
    {#if $webhookURLValidationText}
      <span class="text-sm text-rose-500">{$webhookURLValidationText}</span>
    {/if}
  </form>
</div>
