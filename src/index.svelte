<script lang="ts">
  import { writable } from 'svelte/store'

  const webhookURL = writable(new URLSearchParams(location.search).get('webhookURL') || '')
  const message = writable('')

  const handleSubmit = () => {
    fetch($webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        content: $message,
      }),
    })
  }
</script>

<form class="flex flex-col gap-2 container" on:submit|preventDefault={handleSubmit}>
  <label>
    Webhook URL:
    <br />
    <input
      class="border rounded border-black px-4 py-1 w-full"
      type="text"
      bind:value={$webhookURL}
    />
  </label>
  <label>
    Message:
    <br />
    <input class="border rounded border-black px-4 py-1 w-full" type="text" bind:value={$message} />
  </label>
  <button class="border rounded border-black px-4 py-1" type="submit">Send Message</button>
</form>
