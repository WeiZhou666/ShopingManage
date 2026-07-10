import type { App } from 'vue'
import { permission } from './permission'
import { debounce } from './debounce'
import { throttle } from './throttle'

export function registerDirectives(app: App) {
  app.directive('permission', permission)
  app.directive('debounce', debounce)
  app.directive('throttle', throttle)
}
