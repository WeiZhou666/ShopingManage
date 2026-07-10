import { ref, onUnmounted } from 'vue'

/**
 * 节流 composable
 * @param fn 要节流的函数
 * @param interval 间隔时间（ms），默认 300
 */
export function useThrottle<T extends (...args: any[]) => any>(fn: T, interval = 300) {
  const lastTime = ref(0)
  const timer = ref<ReturnType<typeof setTimeout> | null>(null)

  const throttledFn = (...args: Parameters<T>) => {
    const now = Date.now()
    const remaining = interval - (now - lastTime.value)

    if (remaining <= 0) {
      if (timer.value) {
        clearTimeout(timer.value)
        timer.value = null
      }
      lastTime.value = now
      fn(...args)
    } else if (!timer.value) {
      timer.value = setTimeout(() => {
        lastTime.value = Date.now()
        timer.value = null
        fn(...args)
      }, remaining)
    }
  }

  const cancel = () => {
    if (timer.value) {
      clearTimeout(timer.value)
      timer.value = null
    }
    lastTime.value = 0
  }

  onUnmounted(cancel)

  return { throttledFn, cancel }
}
