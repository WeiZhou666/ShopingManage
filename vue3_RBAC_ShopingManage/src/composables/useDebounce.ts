import { ref, onUnmounted } from 'vue'

/**
 * 防抖 composable
 * @param fn 要防抖的函数
 * @param delay 延迟时间（ms），默认 300
 */
export function useDebounce<T extends (...args: any[]) => any>(fn: T, delay = 300) {
  const timer = ref<ReturnType<typeof setTimeout> | null>(null)

  const debouncedFn = (...args: Parameters<T>) => {
    if (timer.value) clearTimeout(timer.value)
    timer.value = setTimeout(() => {
      fn(...args)
      timer.value = null
    }, delay)
  }

  const cancel = () => {
    if (timer.value) {
      clearTimeout(timer.value)
      timer.value = null
    }
  }

  onUnmounted(cancel)

  return { debouncedFn, cancel }
}
