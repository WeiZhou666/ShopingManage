import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { actionPermissionMap } from '@/permission/actionPermission'
import { menuPermissionMap } from '@/permission/menuPermission'

export function usePermission() {
  const userStore = useUserStore()
  const role = computed(() => userStore.userInfo?.role || '')
  // 检查是否有操作权限
  // @param action 操作权限标识
  // @returns 是否有权限
  const hasActionPermission = (action: string): boolean => {
    const allowedRoles = actionPermissionMap[action]
    if (!allowedRoles) return true
    return allowedRoles.includes(role.value)
  }

  // 检查是否有菜单权限
  // @param path 菜单路径
  // @returns 是否有权限
  const hasMenuPermission = (path: string): boolean => {
    const allowedRoles = menuPermissionMap[path]
    if (!allowedRoles) return true
    return allowedRoles.includes(role.value)
  }

  const isSuperAdmin = computed(() => role.value === 'super_admin')

  return { hasActionPermission, hasMenuPermission, role, isSuperAdmin }
}
