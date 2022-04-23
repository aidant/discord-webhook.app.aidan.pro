import type { Writable } from 'svelte/store'

export type Validator = (value: string) => string | undefined

export const customValidatorFunction = (
  el: HTMLInputElement,
  validator: Validator
): SvelteActionReturnType => {
  const handleInput = (event: Event) => {
    const errorMessage = validator(el.value)
    el.setCustomValidity(errorMessage || '')
  }

  el.addEventListener('input', handleInput)

  return {
    update: (newValidator) => {
      validator = newValidator
    },
    destroy: () => {
      el.removeEventListener('input', handleInput)
    },
  }
}

export const customValidationText = (
  el: HTMLInputElement,
  writable: Writable<string>
): SvelteActionReturnType => {
  const handleInput = () => {
    writable.set(el.validationMessage)
  }

  const handleInvalid = (event: Event) => {
    event.preventDefault()
  }

  el.addEventListener('input', handleInput)
  el.addEventListener('invalid', handleInvalid)

  return {
    update: (newWritable) => {
      writable = newWritable
    },
    destroy: () => {
      el.removeEventListener('input', handleInput)
      el.removeEventListener('invalid', handleInvalid)
    },
  }
}
