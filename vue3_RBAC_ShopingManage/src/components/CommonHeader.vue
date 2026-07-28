<template>
  <div class="header">
    <!-- 左侧：菜单按钮 + 面包屑导航 -->
    <div class="header-left">
      <el-button size="small" class="menu-btn" @click="allDateStore.handleCollapse">
        <el-icon>
          <Menu />
        </el-icon>
      </el-button>
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item>
          <span class="breadcrumb-link" @click="handleNavigate('/home')">
            首页
          </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item v-for="item in breadcrumbList" :key="item.path">
          <span class="breadcrumb-link" @click="handleNavigate(item.path)">
            {{ item.meta?.title || item.name }}
          </span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 右侧：用户操作区 -->
    <div class="header-right">
      <el-dropdown @command="handleCommand">
        <span class="user-avatar">
          <img :src="getImageUrl('user')" alt="用户头像" class="avatar-img" />
          <span class="user-name">{{ userStore.userInfo?.name || '用户' }}</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon>
                <User />
              </el-icon>
              个人中心
            </el-dropdown-item>
            <el-dropdown-divider />
            <el-dropdown-item command="logout" divided>
              <el-icon>
                <SwitchButton />
              </el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Menu, User, SwitchButton } from '@element-plus/icons-vue'
import { useAllDateStore } from '@/stores/index.js'
import { useUserStore } from '@/stores/user.js'

const router = useRouter()
const route = useRoute()
const allDateStore = useAllDateStore()
const userStore = useUserStore()

// 生成面包屑列表
const breadcrumbList = computed(() => {
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  return matched.filter(item => item.path !== '/home' && item.path !== '/')
})

// const handleCollapse = () => {
//   store.state.isCollapsed = !store.state.isCollapsed
// }

// 面包屑点击跳转
const handleNavigate = (path) => {
  if (path && path !== route.path) {
    router.push(path)
  }
}

// 下拉菜单命令
const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logout()
    ElMessage.success('退出成功')
    router.push('/login')
  }).catch(() => {
    // 取消退出
  })
}

const getImageUrl = (name) => {
  return new URL(`../assets/images/${name}.png`, import.meta.url)
}
</script>

<style lang="less">
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 100%;
  background: linear-gradient(90deg, #1f2937 0%, #111827 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .menu-btn {
      color: #9ca3af;
      background: rgba(255, 255, 255, 0.08);
      border: none;
      width: 36px;
      height: 36px;

      &:hover {
        background: rgba(255, 255, 255, 0.15);
        color: #f9fafb;
      }
    }

    .breadcrumb {
      :deep(.el-breadcrumb__item) {
        .el-breadcrumb__inner {
          color: #9ca3af;
        }

        .el-breadcrumb__separator {
          color: #6b7280;
          margin: 0 10px;
          font-weight: 500;
        }
      }

      .breadcrumb-link {
        color: #e5e7eb;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.2s ease;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 500;

        &:hover {
          color: #60a5fa;
          background: rgba(96, 165, 250, 0.1);
        }

        &:active {
          color: #3b82f6;
        }
      }
    }
  }

  .header-right {
    .user-avatar {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      padding: 4px 12px;
      border-radius: 20px;
      transition: background 0.2s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .avatar-img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
        object-fit: cover;
      }

      .user-name {
        color: #e5e7eb;
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
}

:deep(.el-icon) {
  width: 18px;
  height: 18px;
}
</style>
