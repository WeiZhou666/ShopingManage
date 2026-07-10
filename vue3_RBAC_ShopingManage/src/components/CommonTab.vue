<template>
  <div class="common-tab">
    <el-tabs v-model="activeTab" type="card" class="tab-container" @tab-remove="handleRemove" @tab-click="handleClick">
      <el-tab-pane v-for="item in tabStore.tabs" :key="item.path" :label="item.label" :name="item.path"
        :closable="item.closable">
        <template #label>
          <span class="tab-label">
            {{ item.label }}
          </span>
        </template>
      </el-tab-pane>
    </el-tabs>

    <!-- 更多操作下拉菜单 -->
    <el-dropdown class="tab-dropdown" @command="handleCommand">
      <span class="dropdown-trigger">
        <el-icon>
          <ArrowDown />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="refresh">
            <el-icon>
              <Refresh />
            </el-icon>
            刷新当前页
          </el-dropdown-item>
          <el-dropdown-item command="closeOther">
            <el-icon>
              <Close />
            </el-icon>
            关闭其他
          </el-dropdown-item>
          <el-dropdown-item command="closeRight">
            <el-icon>
              <DArrowRight />
            </el-icon>
            关闭右侧
          </el-dropdown-item>
          <el-dropdown-item command="closeAll" divided>
            <el-icon>
              <CircleClose />
            </el-icon>
            关闭所有
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTabStore } from '@/stores/tab.js'
import { ArrowDown, Refresh, Close, DArrowRight, CircleClose } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const tabStore = useTabStore()

// 当前激活的标签
const activeTab = computed({
  get: () => tabStore.currentTab,
  set: () => tabStore.setCurrentTab(route.path)
})

// 监听路由变化，添加标签
watch(
  () => route.path,
  (path) => {
    const matched = route.matched
    if (matched.length > 0) {
      const meta = route.meta
      tabStore.addTab({
        path: route.path,
        name: route.name || path,
        label: meta.title || route.name || '未命名'
      })
    }
  },
  { immediate: true }
)

// 点击标签跳转
const handleClick = (tab) => {
  const path = tab.paneName
  if (path && path !== route.path) {
    router.push(path)
  }
}

// 关闭标签
const handleRemove = (path) => {
  const currentPath = tabStore.closeTab(path)
  if (path === route.path) {
    router.push(currentPath)
  }
}

// 下拉菜单命令
const handleCommand = (command) => {
  switch (command) {
    case 'refresh':
      router.go(0)
      break
    case 'closeOther':
      tabStore.closeOtherTabs(route.path)
      break
    case 'closeRight':
      tabStore.closeRightTabs(route.path)
      break
    case 'closeAll':
      const path = tabStore.closeAllTabs()
      router.push(path)
      break
  }
}
</script>

<style scoped lang="less">
.common-tab {
  display: flex;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 10px;

  .tab-container {
    flex: 1;

    :deep(.el-tabs__header) {
      margin: 0;
      border-bottom: none;

      .el-tabs__nav {
        border: none;

        .el-tabs__item {
          height: 32px;
          line-height: 32px;
          border: 1px solid #e4e7ed;
          border-radius: 4px 4px 0 0;
          margin-right: 5px;
          padding: 0 15px;
          background: #fff;
          color: #606266;

          &:hover {
            color: #409eff;
          }

          &.is-active {
            background: #409eff;
            color: #fff;
            border-color: #409eff;
          }

          .el-icon-close {
            margin-left: 5px;
            font-size: 12px;

            &:hover {
              color: #f56c6c;
            }
          }
        }
      }
    }
  }

  .tab-dropdown {
    margin-left: 10px;

    .dropdown-trigger {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 4px;
      cursor: pointer;
      background: #f5f7fa;

      &:hover {
        background: #e4e7ed;
      }
    }
  }
}

.tab-label {
  font-size: 13px;
}
</style>
