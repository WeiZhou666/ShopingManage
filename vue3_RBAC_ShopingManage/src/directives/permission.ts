import type { Directive, DirectiveBinding } from 'vue'
import { useUserStore } from '@/stores/user'
import { actionPermissionMap } from '@/permission/actionPermission'

export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
    const action = binding.value
    if (!action) return

    const userStore = useUserStore()
    const role = userStore.userInfo?.role || ''
    const allowedRoles = actionPermissionMap[action]

    if (allowedRoles && !allowedRoles.includes(role)) {
      el.parentNode?.removeChild(el)
    }
  },
}
