<script lang="ts">
  import WebhookPreview from '../containers/webhook-preview.svelte'
  import Link from '../components/link.svelte'
  import { listWebhooks } from '../database'

  const webhooksPromise = listWebhooks()
</script>

{#await webhooksPromise then webhooks}
  <ul>
    {#each webhooks as webhook (webhook.webhookId)}
      <li>
        <WebhookPreview {webhook} />
      </li>
    {/each}
  </ul>
{/await}
