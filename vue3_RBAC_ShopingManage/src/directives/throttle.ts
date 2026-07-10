import type { Directive, DirectiveBinding } from 'vue'

/**
 * v-throttle 指令
 * 用法：v-throttle:500="handleClick"        （500ms 节流，默认 300）
 *       v-throttle="handleClick"            （默认 300ms）
 *       v-throttle:500="() => handleFn(row)" （传参用法）
 */
export const throttle: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const interval = Number(binding.arg) || 300
    if (typeof binding.value !== 'function') return

    let lastTime = 0
    let timer: ReturnType<typeof setTimeout> | null = null

    ;(el as any)._throttleClick = () => {
      const now = Date.now()
      const remaining = interval - (now - lastTime)

      if (remaining <= 0) {
        if (timer) {
          clearTimeout(timer)
          timer = null
        }
        lastTime = now
        binding.value()
      } else if (!timer) {
        timer = setTimeout(() => {
          lastTime = Date.now()
          timer = null
          binding.value()
        }, remaining)
      }
    }

    el.addEventListener('click', (el as any)._throttleClick)
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    if (typeof binding.value !== 'function') return
    const interval = Number(binding.arg) || 300

    let lastTime = 0
    let timer: ReturnType<typeof setTimeout> | null = null

    el.removeEventListener('click', (el as any)._throttleClick)
    ;(el as any)._throttleClick = () => {
      const now = Date.now()
      const remaining = interval - (now - lastTime)

      if (remaining <= 0) {
        if (timer) {
          clearTimeout(timer)
          timer = null
        }
        lastTime = now
        binding.value()
      } else if (!timer) {
        timer = setTimeout(() => {
          lastTime = Date.now()
          timer = null
          binding.value()
        }, remaining)
      }
    }
    el.addEventListener('click', (el as any)._throttleClick)
  },
  unmounted(el: HTMLElement) {
    el.removeEventListener('click', (el as any)._throttleClick)
  }
}
