<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'

  const dispatch = createEventDispatcher<{ close: never }>()

  let dialog
  onMount(() => {
    dialog.showModal()
  })

  const handleClick = (event: MouseEvent) => {
    if (event.target === dialog) {
      dispatch('close')
    }
  }

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return

    event.preventDefault()
    dispatch('close')
  }

  const handleClose = () => {
    dispatch('close')
  }
</script>

<svelte:window on:keydown={handleKeyPress} />

<div on:click={handleClick}>
  <dialog
    bind:this={dialog}
    class="container fixed inset-0 m-auto max-w-3xl overflow-hidden rounded-xl p-2 px-8 py-6 shadow-xl shadow-zinc-200"
  >
    <slot />
    <button
      class="absolute top-4 right-4 rounded"
      title="Close"
      aria-label="Close"
      on:click={handleClose}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" class="h-4 w-4">
        <path
          fill="currentColor"
          d="M13.3.71a.996.996 0 0 0-1.41 0L7 5.59 2.11.7A.997.997 0 1 0 .7 2.11L5.59 7 .7 11.89a.997.997 0 0 0 1.41 1.41L7 8.41l4.89 4.89a.997.997 0 0 0 1.41-1.41L8.41 7l4.89-4.89c.38-.38.38-1.02 0-1.4Z"
        />
      </svg>
    </button>
  </dialog>
</div>
