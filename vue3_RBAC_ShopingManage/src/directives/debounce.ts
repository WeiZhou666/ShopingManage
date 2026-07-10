import type { Directive, DirectiveBinding } from 'vue'

/**
 * v-debounce 指令
 * 用法：v-debounce:300="handleClick"        （300ms 防抖，默认 300）
 *       v-debounce="handleClick"            （默认 300ms）
 *       v-debounce:500="() => handleFn(row)" （传参用法）
 */
export const debounce: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const delay = Number(binding.arg) || 300
    if (typeof binding.value !== 'function') return

    let timer: ReturnType<typeof setTimeout> | null = null

    ;(el as any)._debounceClick = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        binding.value()
        timer = null
      }, delay)
    }

    el.addEventListener('click', (el as any)._debounceClick)
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    if (typeof binding.value !== 'function') return
    // 更新时替换为最新的 handler（支持闭包传参）
    const delay = Number(binding.arg) || 300
    let timer: ReturnType<typeof setTimeout> | null = null

    el.removeEventListener('click', (el as any)._debounceClick)
    ;(el as any)._debounceClick = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        binding.value()
        timer = null
      }, delay)
    }
    el.addEventListener('click', (el as any)._debounceClick)
  },
  unmounted(el: HTMLElement) {
    el.removeEventListener('click', (el as any)._debounceClick)
  }
}
