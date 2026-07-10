import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useTabStore } from '@/stores/tab'
import { menuPermissionMap } from '@/permission/menuPermission'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      meta: { title: '登录', requiresAuth: false },
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/',
      name: 'main',
      redirect: '/home',
      component: () => import('@/views/Main.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '/home',
          name: 'home',
          meta: { title: '首页', icon: 'HomeFilled' },
          component: () => import('@/views/Home.vue')
        },
        {
          path: '/profile',
          name: 'profile',
          meta: { title: '个人中心', icon: 'User' },
          component: () => import('@/views/Profile.vue')
        },
        {
          path: '/settings',
          name: 'settings',
          meta: { title: '账号设置', icon: 'Setting' },
          component: () => import('@/views/AccountSettings.vue')
        },
        {
          path: '/user',
          name: 'user',
          redirect: '/user/userlist',
          meta: { title: '用户管理', icon: 'User' },
          component: () => import('@/views/User/User.vue'),
          children: [
            {
              path: '/user/userlist',
              name: 'userList',
              meta: { title: '用户列表', icon: 'List' },
              component: () => import('@/views/User/UserList.vue')
            },
            {
              path: '/user/userdetail',
              name: 'userDetail',
              meta: { title: '用户详情', icon: 'User' },
              component: () => import('@/views/User/UserDetail.vue')
            },
            {
              path: '/user/userdetail/:id',
              name: 'userDetailById',
              meta: { title: '用户详情', icon: 'User' },
              component: () => import('@/views/User/UserDetail.vue')
            }
          ]
        },
        {
          path: '/order',
          name: 'order',
          redirect: '/order/orderlist',
          meta: { title: '订单管理', icon: 'Order' },
          component: () => import('@/views/Order/Order.vue'),
          children: [
            {
              path: '/order/orderlist',
              name: 'orderList',
              meta: { title: '订单列表', icon: 'List' },
              component: () => import('@/views/Order/OrderList.vue')
            },
            {
              path: '/order/orderdetail',
              name: 'orderDetail',
              meta: { title: '订单详情', icon: 'Order' },
              component: () => import('@/views/Order/OrderDetail.vue')
            },
            {
              path: '/order/orderdetail/:id',
              name: 'orderDetailById',
              meta: { title: '订单详情', icon: 'Order' },
              component: () => import('@/views/Order/OrderDetail.vue')
            }
          ]
        },
        {
          path: '/product',
          name: 'product',
          redirect: '/product/productlist',
          meta: { title: '商品管理', icon: 'Product' },
          component: () => import('@/views/Product/Product.vue'),
          children: [
            {
              path: '/product/productlist',
              name: 'productList',
              meta: { title: '商品列表', icon: 'List' },
              component: () => import('@/views/Product/ProductList.vue')
            },
            {
              path: '/product/productedit/:id?',
              name: 'productEdit',
              meta: { title: '商品编辑', icon: 'Product' },
              component: () => import('@/views/Product/ProductEdit.vue')
            },
            {
              path: '/product/categorymanage',
              name: 'categoryManage',
              meta: { title: '分类管理', icon: 'Category' },
              component: () => import('@/views/Product/CategoryManage.vue')
            },
          ],
        },
        {
          path: '/logistics',
          name: 'logistics',
          redirect: '/logistics/logisticscompany',
          meta: { title: '物流管理', icon: 'Truck' },
          component: () => import('@/views/Logistics/Logistics.vue'),
          children: [
            {
              path: '/logistics/logisticscompany',
              name: 'logisticsCompany',
              meta: { title: '物流公司', icon: 'Building' },
              component: () => import('@/views/Logistics/LogisticsCompany.vue')
            },
            {
              path: '/logistics/shipmentrecord',
              name: 'shipmentRecord',
              meta: { title: '发货记录', icon: 'FileText' },
              component: () => import('@/views/Logistics/ShipmentRecord.vue')
            }
          ]
        },
        {
          path: '/marketing',
          name: 'marketing',
          redirect: '/marketing/coupon',
          meta: { title: '营销管理', icon: 'Gift' },
          component: () => import('@/views/Marketing/Marketing.vue'),
          children: [
            {
              path: '/marketing/couponmanage',
              name: 'couponManage',
              meta: { title: '优惠券管理', icon: 'Ticket' },
              component: () => import('@/views/Marketing/CouponManage.vue')
            },
            {
              path: '/marketing/seckillmanage',
              name: 'seckillManage',
              meta: { title: '秒杀活动', icon: 'Zap' },
              component: () => import('@/views/Marketing/SeckillManage.vue')
            },
            {
              path: '/marketing/discountmanage',
              name: 'discountManage',
              meta: { title: '折扣管理', icon: 'Percent' },
              component: () => import('@/views/Marketing/DiscountManage.vue')
            }
          ]
        },
        {
          path: '/staff',
          name: 'staff',
          redirect: '/staff/stafflist',
          meta: { title: '员工管理', icon: 'User' },
          component: () => import('@/views/Staff/Staff.vue'),
          children: [
            {
              path: '/staff/stafflist',
              name: 'staffList',
              meta: { title: '员工列表', icon: 'List' },
              component: () => import('@/views/Staff/StaffList.vue')
            },
            {
              path: '/staff/staffDetail',
              name: 'staffDetail',
              meta: { title: '员工详情', icon: 'User' },
              component: () => import('@/views/Staff/StaffDetail.vue')
            },
            {
              path: '/staff/staffDetail/:id',
              name: 'staffDetailById',
              meta: { title: '员工详情', icon: 'User' },
              component: () => import('@/views/Staff/StaffDetail.vue')
            },
          ]
        },
      ]
    },


  ]
})

// 白名单路由（不需要登录即可访问）
const whiteList = ['/login', '/404']

const checkPathPermission = (path: string, role: string): boolean => {
  if (menuPermissionMap[path]) {
    return menuPermissionMap[path].includes(role)
  }
  const segments = path.split('/')
  for (let i = segments.length - 1; i > 1; i--) {
    const parentPath = segments.slice(0, i).join('/')
    if (menuPermissionMap[parentPath]) {
      return menuPermissionMap[parentPath].includes(role)
    }
  }
  return true
}

// 路由守卫
router.beforeEach((to, from) => {
  const userStore = useUserStore()
  const tabStore = useTabStore()
  const token = userStore.token

  // 设置页面标题，三元运算符，根据路由路径动态设置
  document.title = to.meta.title ? `${to.meta.title} - 后台管理系统` : '后台管理系统'

  // 1. 判断是否有 token
  if (token) {
    // 已登录
    if (to.path === '/login') {
      // 已登录访问登录页，重定向到首页
      return { path: '/' }
    }
    const role = userStore.userInfo?.role
    if (role && !checkPathPermission(to.path, role)) {
      return { path: '/home' }
    }
    // 添加标签页
    if (to.meta.title) {
      tabStore.addTab({
        path: to.path,
        name: String(to.name),
        label: String(to.meta.title)
      })
    }
    return true
  }
  // 未登录
  if (whiteList.indexOf(to.path) !== -1) {
    return true
  }
  // 不在白名单中，重定向到登录页
  return `/login?redirect=${to.path}`
})

// 路由后置守卫
router.afterEach((to) => {
  // 滚动到页面顶部
  window.scrollTo(0, 0)
})

// 路由错误处理
router.onError((error) => {
  console.error('路由错误:', error)
})

export default router