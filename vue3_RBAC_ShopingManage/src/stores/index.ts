import { reactive } from 'vue'
import { defineStore } from 'pinia'

interface MainState {
  isCollapsed: boolean
  asideWidth: string
}

function initState(): MainState {
  return {
    isCollapsed: false,
    asideWidth: '180px'
  }
}

export const useAllDateStore = defineStore('allDate', () => {
  const state = reactive<MainState>(initState())
  const handleCollapse = () => {
  state.isCollapsed = !state.isCollapsed
  state.asideWidth = state.isCollapsed ? '64px' : '180px'
}
  return { state, handleCollapse }
})