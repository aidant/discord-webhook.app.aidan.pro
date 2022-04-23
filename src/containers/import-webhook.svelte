<script lang="ts">
  import Dialog from '../components/dialog.svelte'
  import { createEventDispatcher } from 'svelte'
  import { createWebhook, type Webhook } from '../database'
  import ImportWebhookFromDiscord from './import-webhook-from-discord.svelte'
  import ImportWebhookFromLink from './import-webhook-from-link.svelte'
  import { getWebhookWithToken } from '../discord'
  import Link from '../components/link.svelte'

  export let webhookURL = ''

  let state: 'importing' | 'verifying' | 'success' | 'error' = 'importing'
  let technicalDetails: unknown = ''

  const dispatch = createEventDispatcher<{ close: never }>()

  const handleWebhook = async (event: CustomEvent<Webhook>) => {
    state = 'verifying'
    try {
      const { webhookId, webhookToken } = event.detail
      await getWebhookWithToken(webhookId, webhookToken)
      await createWebhook(webhookId, webhookToken)
      state = 'success'
    } catch (error) {
      technicalDetails = error
      state = 'error'
    }
  }

  const handleCreateNewWebhook = () => {
    technicalDetails = ''
    state = 'importing'
  }

  const handleClose = () => {
    dispatch('close')
  }

  const handleCopyError = async () => {
    await navigator.clipboard.writeText(String(technicalDetails))
  }
</script>

<Dialog on:close>
  {#if state === 'importing'}
    <div class="flex flex-col">
      <ImportWebhookFromLink {webhookURL} on:webhook={handleWebhook} />
      <div class="flex flex-row items-center gap-1">
        <div class="mx-2 mt-1 w-full border-t border-zinc-200" />
        <span>or</span>
        <div class="mx-2 mt-1 w-full border-t border-zinc-200" />
      </div>
      <ImportWebhookFromDiscord on:webhook={handleWebhook} />
    </div>
  {/if}

  {#if state === 'verifying'}
    <div class="sm:mx-12 sm:my-4 sm:flex sm:flex-row sm:items-center sm:gap-12">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        viewBox="0 0 24 24"
        class="mx-auto my-6 h-12 w-12 flex-none rounded-full bg-zinc-200 p-2 text-zinc-600"
      >
        <path
          fill="currentColor"
          d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z"
          opacity=".5"
        />
        <path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2v2a8 8 0 0 1 8 8Z">
          <animateTransform
            attributeName="transform"
            dur="1s"
            from="0 12 12"
            repeatCount="indefinite"
            to="360 12 12"
            type="rotate"
          />
        </path>
      </svg>
      <div>
        <h2 class="my-2 text-center text-xl font-medium sm:text-left">Verifying Webhook</h2>
        <p class="my-4 text-center sm:mx-0 sm:text-left">
          We are verifying your Webhook as we speak. Please wait this should only take a second...
        </p>
      </div>
    </div>
  {/if}

  {#if state === 'success'}
    <div class="sm:mx-12 sm:my-4 sm:flex sm:flex-row sm:items-center sm:gap-12">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        viewBox="0 0 24 24"
        class="mx-auto my-6 h-12 w-12 flex-none rounded-full bg-green-200 p-2 text-green-600"
      >
        <path
          fill="currentColor"
          d="M9 16.17 5.53 12.7a.996.996 0 1 0-1.41 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71a.996.996 0 1 0-1.41-1.41L9 16.17z"
        />
      </svg>
      <div>
        <h2 class="my-2 text-center text-xl font-medium sm:text-left">Import successful</h2>
        <p class="my-4 text-center sm:mx-0 sm:text-left">
          We've imported your Webhook! Head over to the
          <Link href="/app/editor">Editor</Link> to send messages. You can also create
          <Link href="/app/profiles">Profiles</Link> to send messages with multiple identities.
        </p>
      </div>
    </div>
    <div class="flex w-full flex-row gap-2">
      <button class="flex-auto rounded border-2 px-4 py-1 sm:flex-1" on:click={handleClose}>
        Close
      </button>
      <button
        class="flex-auto rounded bg-rose-500 px-4 py-1 text-white sm:flex-1"
        on:click={handleCreateNewWebhook}
      >
        Create a new Webhook
      </button>
    </div>
  {/if}

  {#if state === 'error'}
    <div class="sm:mx-12 sm:my-4 sm:flex sm:flex-row sm:items-center sm:gap-12">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        viewBox="0 0 24 24"
        class="mx-auto my-6 h-12 w-12 flex-none rounded-full bg-rose-200 p-2 text-rose-600"
      >
        <path
          fill="currentColor"
          d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"
        />
      </svg>
      <div>
        <h2 class="my-2 text-center text-xl font-medium sm:text-left">Import failure</h2>
        <p class="my-4 text-center sm:mx-0 sm:text-left">
          Sorry we were unable to import your Webhook. Please try again later, of if the problem
          persists, please
          <Link href="/support">contact support</Link>.
        </p>
        {#if technicalDetails}
          <details class="my-4 sm:mx-0">
            <summary class="my-2">Technical details</summary>
            <div class="my-2 flex flex-row justify-between">
              {technicalDetails}
              <button
                class="inline rounded"
                title="Copy technical details"
                aria-label="Copy technical details"
                on:click={handleCopyError}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  class="h-6 w-6"
                >
                  <path
                    fill="currentColor"
                    d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                  />
                </svg>
              </button>
            </div>
          </details>
        {/if}
      </div>
    </div>
    <div class="flex w-full flex-row gap-2">
      <button class="flex-auto rounded border-2 px-4 py-1 sm:flex-1" on:click={handleClose}>
        Close
      </button>
      <button
        class="flex-auto rounded bg-rose-500 px-4 py-1 text-white sm:flex-1"
        on:click={handleCreateNewWebhook}
      >
        Try again
      </button>
    </div>
  {/if}
</Dialog>
