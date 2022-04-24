<script lang="ts">
  import { onMount } from 'svelte'
  import Link from './components/link.svelte'
  import Route from './components/route.svelte'
  import ImportWebhook from './containers/import-webhook.svelte'
  import Webhooks from './pages/webhooks.svelte'
  import { pushState, router } from './router'

  let routes: Record<string, object> = {}
  onMount(() =>
    router(
      {
        importWebhook: {
          query: { 'import-webhook': 'webhookURL' },
        },
        listWebhooks: {
          path: '/app/webhooks',
        },
      },
      (result) => (routes = result)
    )
  )

  const pages = [
    { href: '/app/editor', textContent: 'Editor' },
    { href: '/app/webhooks', textContent: 'Webhooks' },
    { href: '/app/profiles', textContent: 'Profiles' },
  ]

  const handleClose = (query: string) => {
    const url = new URL(location.href)
    url.searchParams.delete(query)
    pushState(url.href)
  }
</script>

<nav>
  <ul class="flex flex-row justify-center gap-4 py-4">
    {#each pages as { href, textContent }}
      <li>
        <Link {href}>{textContent}</Link>
      </li>
    {/each}
  </ul>
</nav>

<main>
  <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
    {#if routes.importWebhook}
      <ImportWebhook {...routes.importWebhook} on:close={() => handleClose('import-webhook')} />
    {/if}
    {#if routes.listWebhooks}
      <Webhooks {...routes.listWebhooks} />
    {/if}
  </div>
</main>
