import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface TabItem {
  path: string
  name: string
  label: string
  closable?: boolean
}

export const useTabStore = defineStore('tab', () => {
  // 当前选中的标签
  const currentTab = ref<string>('/home')

  // 标签列表
  const tabs = ref<TabItem[]>([
    {
      path: '/home',
      name: 'home',
      label: '首页',
      closable: false
    }
  ])

  // 添加标签
  const addTab = (tab: TabItem) => {
    const exists = tabs.value.some(item => item.path === tab.path)
    if (!exists) {
      tabs.value.push({
        ...tab,
        closable: tab.path !== '/home'
      })
    }
    currentTab.value = tab.path
  }

  // 关闭标签
  const closeTab = (path: string): string => {
    const index = tabs.value.findIndex(item => item.path === path)
    if (index > -1) {
      tabs.value.splice(index, 1)
      // 如果关闭的是当前标签，切换到前一个或后一个
      if (currentTab.value === path) {
        const newIndex = Math.min(index, tabs.value.length - 1)
        currentTab.value = tabs.value[newIndex]?.path || '/home'
      }
    }
    return currentTab.value
  }

  // 关闭其他标签
  const closeOtherTabs = (path: string) => {
    //filter = 数组过滤器 → 筛选出符合条件的元素，返回新数组
    tabs.value = tabs.value.filter(item => item.path === path || !item.closable)
    currentTab.value = path
  }

  // 关闭所有标签
  const closeAllTabs = () => {
    tabs.value = tabs.value.filter(item => !item.closable)
    currentTab.value = '/home'
    return currentTab.value
  }

  // 关闭右侧标签
  const closeRightTabs = (path: string) => {
    const index = tabs.value.findIndex(item => item.path === path)
    if (index > -1) {
      tabs.value = tabs.value.slice(0, index + 1).filter(item => !item.closable || item.path === path)
    }
  }

  // 设置当前标签
  const setCurrentTab = (path: string) => {
    currentTab.value = path
  }

  return {
    currentTab,
    tabs,
    addTab,
    closeTab,
    closeOtherTabs,
    closeAllTabs,
    closeRightTabs,
    setCurrentTab
  }
})