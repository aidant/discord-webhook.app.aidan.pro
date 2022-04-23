<script lang="ts">
  import Link from './components/link.svelte'
  import Route from './components/route.svelte'
  import ImportWebhook from './containers/import-webhook.svelte'
  import Webhooks from './pages/webhooks.svelte'

  const pages = [
    { href: '/app/editor', textContent: 'Editor' },
    { href: '/app/webhooks', textContent: 'Webhooks' },
    { href: '/app/profiles', textContent: 'Profiles' },
  ]

  const handleClose = (query: string) => {
    const url = new URL(location.href)
    url.searchParams.delete(query)
    history.pushState(null, '', url.href)
    dispatchEvent(
      new PopStateEvent('popstate', { bubbles: false, cancelable: false, composed: false })
    )
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
    <Route component={Webhooks} path="/app/webhooks" />

    <Route
      component={ImportWebhook}
      query={{ 'import-webhook': 'webhookURL' }}
      on:close={() => handleClose('import-webhook')}
    />
  </div>
</main>
