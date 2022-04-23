<script lang="ts">
  export let href: string
  export let external: boolean = false
  let className = ''
  export { className as class }
</script>

<!-- svelte-ignore avoid-is -->
<a
  is="lazy-router-anchor"
  {href}
  target={external ? '_blank' : undefined}
  rel={external ? 'noopener noreferrer' : undefined}
  class="{className} inline-block rounded font-medium underline decoration-rose-500 decoration-2 underline-offset-1 hover:decoration-4 hover:underline-offset-0 {external
    ? 'after:content-["_↗"]'
    : ''}"
  on:click
>
  <slot />
</a>
