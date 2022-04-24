<script lang="ts">
  import type { Webhook } from '../database'

  export let webhook: Webhook

  const handleChangeAvatar = () => {}
</script>

<div class="flex flex-row items-center">
  <div class="relative">
    <!-- svelte-ignore a11y-missing-attribute -->
    {#if webhook.webhookAvatar}
      <img
        class="h-16 w-16 rounded-full"
        aria-hidden="true"
        src="https://cdn.discordapp.com/avatars/{webhook.webhookId}/{webhook.webhookAvatar}.webp"
      />
    {:else}
      <img
        class="h-16 w-16 rounded-full"
        aria-hidden="true"
        src="https://cdn.discordapp.com/embed/avatars/0.png"
      />
    {/if}
    <div class="group cursor-pointer" on:click={handleChangeAvatar}>
      <div
        class="absolute inset-0 flex h-16 w-16 items-center rounded-full bg-black/50 text-center align-middle opacity-0 hover:opacity-100 group-hover:opacity-100"
      >
        <span class="text-xs font-semibold text-white">Change avatar</span>
      </div>
      <button
        title="Change avatar for {webhook.webhookName}"
        aria-label="Change avatar for {webhook.webhookName}"
        class="absolute -top-1 -right-1 rounded-full bg-zinc-200 text-zinc-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          viewBox="0 0 24 24"
          class="h-6 w-6 p-1 pb-[0.3125rem] pl-[0.3125rem]"
        >
          <path
            fill="currentColor"
            d="M18 20H4V6h9V4H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-9h-2v9zm-7.79-3.17-1.96-2.36L5.5 18h11l-3.54-4.71zM20 4V1h-2v3h-3c.01.01 0 2 0 2h3v2.99c.01.01 2 0 2 0V6h3V4h-3z"
          />
        </svg>
      </button>
    </div>
  </div>
  <span class="mx-6">{webhook.webhookName}</span>
</div>
