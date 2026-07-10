<template>
  <el-aside class="aside" :class="{ 'is-collapsed': allDateStore.state.isCollapsed }"
    :width="allDateStore.state.asideWidth">
    <!-- 侧边栏头部 -->
    <div class="aside-header">
      <h3 v-if="!allDateStore.state.isCollapsed">销售后台管理系统</h3>
      <h3 v-else>后台</h3>
    </div>

    <!-- 菜单区域 -->
    <el-menu :default-active="activeMenu" class="aside-menu" mode="vertical" :collapse="allDateStore.state.isCollapsed"
      router @select="handleSelect">
      <!-- 无子菜单的菜单项 -->
      <el-menu-item v-for="item in noChildren" :key="item.path" :index="item.path">
        <el-icon class="menu-icon">
          <component :is="item.icon" />
        </el-icon>
        <span>{{ item.label }}</span>
      </el-menu-item>

      <!-- 有子菜单的菜单项 -->
      <el-sub-menu v-for="item in hasChildren" :key="item.path" :index="item.path"
        :class="{ 'sub-menu-active': isSubMenuActive(item) }">
        <template #title @click.stop="handleSubMenuClick(item)">
          <div class="sub-menu-title">
            <el-icon class="menu-icon">
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.label }}</span>
          </div>
        </template>
        <el-menu-item-group>
          <el-menu-item v-for="subItem in item.children" :key="subItem.path" :index="subItem.path">
            <el-icon class="menu-icon">
              <component :is="subItem.icon" />
            </el-icon>
            <span>{{ subItem.label }}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  HomeFilled,
  User,
  UserFilled,
  ShoppingCart,
  Box,
  Edit,
  Folder,
  Clock,
  Discount,
  Money,
  List,
  Calendar,
  Ticket,
  Van,
  Document,
  OfficeBuilding,
  Avatar
} from '@element-plus/icons-vue'
import { useAllDateStore } from '@/stores/index.js'
import { useTabStore } from '@/stores/tab.js'
import { menuPermissionMap } from '@/permission/menuPermission'
import { useUserStore } from '@/stores/user'
const router = useRouter()
const route = useRoute()
const allDateStore = useAllDateStore()
const tabStore = useTabStore()
const userStore = useUserStore()
const currentRole = computed(() => userStore.userInfo?.role || '')

const activeMenu = computed(() => route.path)

const list = ref([
  { path: '/home', name: 'home', icon: HomeFilled, label: '首页' },
  {
    path: '/user',
    name: 'user',
    icon: User,
    label: '用户管理',
    children: [{
      path: '/user/userlist', name: 'userList', icon: List, label: '用户列表'
    },
    {
      path: '/user/userDetail', name: 'userDetail', icon: UserFilled, label: '用户详情'
    },
    ],
  },
  {
    path: '/order',
    name: 'order',
    icon: ShoppingCart,
    label: '订单管理',
    children: [{
      path: '/order/orderlist', name: 'orderList', icon: List, label: '订单列表'
    },
    {
      path: '/order/orderdetail', name: 'orderDetail', icon: Document, label: '订单详情'
    },
    ],
  },
  {
    path: '/product',
    name: 'product',
    icon: Box,
    label: '商品管理',
    children: [{
      path: '/product/productlist', name: 'productList', icon: Box, label: '商品列表'
    },
    {
      path: '/product/productedit', name: 'productEdit', icon: Edit, label: '商品编辑'
    },
    {
      path: '/product/categorymanage', name: 'categoryManage', icon: Folder, label: '分类管理'
    },
    ],
  },
  {
    path: '/logistics',
    name: 'logistics',
    icon: Van,
    label: '物流管理',
    children: [
      {
        path: '/logistics/shipmentrecord', name: 'logisticsShipmentRecord', icon: List, label: '发货记录'
      },
      {
        path: '/logistics/logisticscompany', name: 'logisticsCompany', icon: OfficeBuilding, label: '物流公司'
      },
    ],
  },
  {
    path: '/marketing',
    name: 'marketing',
    icon: Money,
    label: '营销管理',
    children: [{
      path: '/marketing/couponmanage', name: 'couponManage', icon: Ticket, label: '优惠券管理'
    },
    {
      path: '/marketing/seckillmanage', name: 'seckillManage', icon: Clock, label: '秒杀活动管理'
    },
    {
      path: '/marketing/discountmanage', name: 'discountManage', icon: Discount, label: '折扣管理'
    }
    ],
  },
  {
    path: '/staff',
    name: 'staff',
    icon: User,
    label: '员工管理',
    children: [{
      path: '/staff/stafflist', name: 'staffList', icon: List, label: '员工列表'
    },
    {
      path: '/staff/staffDetail', name: 'staffDetail', icon: Avatar, label: '员工详情'
    },
    ],
  }
])
/**
 * 根据用户角色过滤菜单树
 * @param {Array} menuList - 原始菜单树
 * @returns {Array} 过滤后的菜单树（移除了无权限项，并丢弃子项全部被过滤的父菜单）
 */
const filterMenuByRole = (menuList) => {
  // 第一步：过滤掉当前层级中用户无权访问的菜单项
  const filteredByPermission = menuList.filter(menuItem => {
    // menuPermissionMap[menuItem.path] 返回当前菜单项的允许角色数组例如：['admin']】
    const allowedRoles = menuPermissionMap[menuItem.path]
    // 如果没有定义权限限制，则所有角色都可访问
    if (!allowedRoles) return true
    // 检查当前用户角色是否在允许列表中
    return allowedRoles.includes(currentRole.value)
  })

  // 第二步：递归处理每个菜单项的子菜单
  const withFilteredChildren = filteredByPermission.map(menuItem => {
    if (menuItem.children && menuItem.children.length > 0) {
      // 对子菜单递归调用相同的过滤函数
      return {
        ...menuItem,
        children: filterMenuByRole(menuItem.children)
      }
    }
    // 无子菜单则直接返回
    return menuItem

  })

  // 第三步：移除那些子菜单被过滤干净（变空数组）的父菜单
  const cleanedMenu = withFilteredChildren.filter(menuItem => {
    // 如果存在 children 属性且长度为 0，则丢弃该菜单项
    if (menuItem.children && menuItem.children.length === 0) return false
    return true
  })

  return cleanedMenu
}

const filteredList = computed(() => filterMenuByRole(list.value))

const noChildren = computed(() => filteredList.value.filter(item => !item.children))
const hasChildren = computed(() => filteredList.value.filter(item => item.children))

// 判断子菜单是否被选中
const isSubMenuActive = (item) => {
  if (!item.children) return false
  // 递归判断子菜单是否被选中.
  // some只要有一个满足条件，就返回 true
  return item.children.some(child => route.path === child.path)
}

// 菜单选择事件
const handleSelect = (path) => {
  let menuItem = filteredList.value.find(item => item.path === path)
  if (!menuItem) {
    for (const item of filteredList.value) {
      if (item.children) {
        menuItem = item.children.find(child => child.path === path)
        if (menuItem) break
      }
    }
  }

  if (menuItem) {
    tabStore.addTab({
      path: menuItem.path,
      name: menuItem.name,
      label: menuItem.label
    })
  }
}

// 子菜单标题点击事件
const handleSubMenuClick = (item) => {
  router.push(item.path)
  tabStore.addTab({
    path: item.path,
    name: item.name,
    label: item.label
  })
}
</script>

<style scoped lang="less">
.aside {
  height: 100%;
  background: linear-gradient(180deg, #1f2937 0%, #111827 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  transition: width 0.3s ease;
  overflow: hidden;

  .aside-header {
    padding: 16px;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;

    h3 {
      margin: 0;
      color: #f9fafb;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 1px;
    }
  }

  .aside-menu {
    flex: 1;
    border-right: none;
    background: transparent;
    padding: 12px 0;
    width: 100%;

    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      color: #9ca3af;
      height: 44px;
      line-height: 44px;
      margin: 4px 8px;
      border-radius: 8px;
      transition: all 0.2s ease;

      &:hover {
        color: #f9fafb;
        background: rgba(59, 130, 246, 0.15);
      }
    }

    :deep(.el-menu-item.is-active),
    :deep(.el-sub-menu__title.is-active) {
      color: #f9fafb;
      background: rgba(59, 130, 246, 0.25);

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 20px;
        background: #3b82f6;
        border-radius: 0 3px 3px 0;
      }
    }

    :deep(.el-sub-menu .el-menu-item) {
      padding-left: 56px !important;

      &.is-active::before {
        display: none;
      }
    }

    :deep(.el-menu-item-group__title) {
      display: none;
    }

    :deep(.el-menu--popup) {
      background: rgba(17, 24, 39, 0.95) !important;
      border: none !important;
      box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.3) !important;
    }

    :deep(.el-popper.is-dark) {
      background: rgba(17, 24, 39, 0.95) !important;
      border: none !important;
    }

    :deep(.el-popper.is-dark .el-popper__arrow::before) {
      background: rgba(17, 24, 39, 0.95) !important;
      border-color: rgba(17, 24, 39, 0.95) !important;
    }

    :deep(.el-sub-menu .el-menu) {
      background: transparent !important;
    }

    :deep(.el-sub-menu.sub-menu-active > .el-sub-menu__title) {
      color: #f9fafb !important;
      background: rgba(59, 130, 246, 0.25) !important;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 20px;
        background: #3b82f6;
        border-radius: 0 3px 3px 0;
      }
    }
  }

  .sub-menu-title {

    display: flex;
    align-items: center;
    width: 100%;
    cursor: pointer;
  }
}

.menu-icon {

  width: 18px;
  height: 18px;
  margin-right: 10px;
  flex-shrink: 0;
}

:deep(.el-menu--collapse .el-menu-item),
:deep(.el-menu--collapse .el-sub-menu__title) {
  justify-content: center !important;
  text-align: center !important;
}

:deep(.el-menu--collapse .el-menu-item span),
:deep(.el-menu--collapse .el-sub-menu__title span) {
  display: none !important;
}

:deep(.el-menu--collapse .el-menu-item .el-icon),
:deep(.el-menu--collapse .el-sub-menu__title .el-icon) {
  margin: 0 auto !important;
}

:deep(.el-menu--collapse .el-menu-item:hover),
:deep(.el-menu--collapse .el-sub-menu__title:hover) {
  justify-content: center !important;
}

:deep(.el-menu--collapse .el-menu-item:hover .el-icon),
:deep(.el-menu--collapse .el-sub-menu__title:hover .el-icon) {
  margin: 0 auto !important;
}

:deep(.el-menu--collapse .el-sub-menu__title .sub-menu-title) {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  width: 100% !important;
}

:deep(.el-menu--collapse .el-sub-menu__title .sub-menu-title .menu-icon) {
  margin: 0 !important;
  padding: 0 !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}
</style>
