<script lang="ts">
  import Link from '../components/link.svelte'
  import { listWebhooks } from '../database'

  const webhooksPromise = listWebhooks()
</script>

{#await webhooksPromise then webhooks}
  <ul>
    {#each webhooks as { webhookId } (webhookId)}
      <li>
        <Link href={`/app/webhooks/${webhookId}`}>{webhookId}</Link>
      </li>
    {/each}
  </ul>
{/await}
