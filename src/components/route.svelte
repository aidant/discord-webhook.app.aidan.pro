<script lang="ts">
  import { onMount } from 'svelte'
  import { route, type RouteOptions } from '../router'

  export let path: RouteOptions['path'] = []
  export let query: RouteOptions['query'] = {}
  export let component: unknown

  let props

  onMount(() => route({ path, query }, (newProps) => (props = newProps)))
</script>

{#if props}
  <svelte:component this={component} {...$$restProps} {...props} on:close />
{/if}
