import Mock from 'mockjs'
import homeApi from './mockData/home'
import userApi from './mockData/user'
import orderApi from './mockData/order'
import productApi from './mockData/product'
import logisticsApi from './mockData/logistics'
import marketingApi from './mockData/marketing'
import staffApi from './mockData/staff'
Mock.setup({
  timeout: '200-600'
})

// Home 相关接口
Mock.mock(/\/api\/home\/getTableData/, 'get', homeApi.getTableData)
Mock.mock(/\/api\/home\/getCountData/, 'get', homeApi.getCountData)
Mock.mock(/\/api\/home\/getChartData/, 'get', homeApi.getChartData)
Mock.mock(/\/api\/home\/getBarChartData/, 'get', homeApi.getBarChartData)
Mock.mock(/\/api\/home\/getPieChartData/, 'get', homeApi.getPieChartData)

// User 相关接口
// Mock.mock(/\/api\/user\/getUserList/, 'get', (options: any) => {
//   const url = options.url
//   const params: any = {}
//   if (url.includes('?')) {
//     const searchParams = new URLSearchParams(url.split('?')[1])
//     params.pageNum = parseInt(searchParams.get('pageNum') || '1')
//     params.pageSize = parseInt(searchParams.get('pageSize') || '10')
//     params.phone = searchParams.get('phone') || ''
//     params.tag = searchParams.get('tag') || ''
//     const status = searchParams.get('status')
//     params.status = (status !== null && status !== '') ? parseInt(status) : ''
//     params.startDate = searchParams.get('startDate') || ''
//     params.endDate = searchParams.get('endDate') || ''
//   }
//   return userApi.getUserList(params)
// })
// Mock.mock(/\/api\/user\/getUserDetail/, 'get', (options: any) => {
//   const url = options.url
//   const id = url.split('id=')[1]?.split('&')[0]
//   return userApi.getUserDetail(id)
// })
// Mock.mock(/\/api\/user\/addUser/, 'post', (options: any) => {
//   const data = JSON.parse(options.body)
//   return userApi.addUser(data)
// })
// Mock.mock(/\/api\/user\/updateUser/, 'put', (options: any) => {
//   const data = JSON.parse(options.body)
//   return userApi.updateUser(data)
// })
// // Mock.mock(/\/api\/user\/deleteUser/, 'delete', (options: any) => {
//   const url = options.url
//   const id = url.split('id=')[1]?.split('&')[0]
//   return userApi.deleteUser(id)
// })
// Mock.mock(/\/api\/user\/batchDeleteUsers/, 'post', (options: any) => {
//   const data = JSON.parse(options.body)
//   return userApi.batchDeleteUsers(data.ids)
// })
// // Mock.mock(/\/api\/user\/updateUserStatus/, 'put', (options: any) => {
//   const data = JSON.parse(options.body)
//   return userApi.updateUserStatus(data.id, data.status)
// })
// Mock.mock(/\/api\/user\/updateUserTags/, 'put', (options: any) => {
//   const data = JSON.parse(options.body)
//   return userApi.updateUserTags(data.id, data.tags)
// })
Mock.mock(/\/api\/user\/getRoleList/, 'get', userApi.getRoleList)
Mock.mock(/\/api\/user\/getDepartmentList/, 'get', userApi.getDepartmentList)

// Order 相关接口
Mock.mock(/\/api\/order\/getOrderList/, 'get', (options: any) => {
  const url = options.url
  const params: any = {}
  if (url.includes('?')) {
    const searchParams = new URLSearchParams(url.split('?')[1])
    params.pageNum = parseInt(searchParams.get('pageNum') || '1')
    params.pageSize = parseInt(searchParams.get('pageSize') || '10')
    const status = searchParams.get('status')
    params.status = status !== null && status !== '' ? parseInt(status) : ''
    params.orderNo = searchParams.get('orderNo') || ''
    params.startDate = searchParams.get('startDate') || ''
    params.endDate = searchParams.get('endDate') || ''
  }
  console.log('[Mock] getOrderList params:', params)
  return orderApi.getOrderList(params)
})
Mock.mock(/\/api\/order\/deliveryOrder/, 'put', (options: any) => {
  const data = JSON.parse(options.body)
  return orderApi.deliveryOrder(data.id)
})
Mock.mock(/\/api\/order\/closeOrder/, 'put', (options: any) => {
  const data = JSON.parse(options.body)
  return orderApi.closeOrder(data.id)
})
Mock.mock(/\/api\/order\/getOrderDetail/, 'get', (options: any) => {
  const url = options.url
  const params = new URLSearchParams(url.split('?')[1] || '')
  const orderNo = params.get('orderNo') || ''
  console.log('[Mock] getOrderDetail orderNo:', orderNo)
  return orderApi.getOrderDetail(orderNo)
})

// Product 相关接口
Mock.mock(/\/api\/product\/getProductList/, 'get', (options: any) => {
  const url = options.url
  const params: any = {}
  if (url.includes('?')) {
    const searchParams = new URLSearchParams(url.split('?')[1])
    params.pageNum = parseInt(searchParams.get('pageNum') || '1')
    params.pageSize = parseInt(searchParams.get('pageSize') || '10')
    params.keyword = searchParams.get('keyword') || ''
    params.category = searchParams.get('category') || ''
    const status = searchParams.get('status')
    params.status = (status !== null && status !== '') ? parseInt(status) : ''
  }
  return productApi.getProductList(params)
})
Mock.mock(/\/api\/product\/getProductEdit/, 'get', (options: any) => {
  const url = options.url
  const id = parseInt(url.split('id=')[1]?.split('&')[0] || '0')
  return productApi.getProductEdit(id)
})
Mock.mock(/\/api\/product\/addProduct/, 'post', (options: any) => {
  const data = JSON.parse(options.body)
  return productApi.addProduct(data)
})
Mock.mock(/\/api\/product\/updateProduct/, 'put', (options: any) => {
  const data = JSON.parse(options.body)
  return productApi.updateProduct(data)
})
Mock.mock(/\/api\/product\/deleteProduct/, 'delete', (options: any) => {
  const url = options.url
  const id = parseInt(url.split('id=')[1]?.split('&')[0] || '0')
  return productApi.deleteProduct(id)
})
Mock.mock(/\/api\/product\/batchDeleteProducts/, 'post', (options: any) => {
  const data = JSON.parse(options.body)
  return productApi.batchDeleteProducts(data.ids)
})
Mock.mock(/\/api\/product\/updateProductStatus/, 'put', (options: any) => {
  const data = JSON.parse(options.body)
  return productApi.updateProductStatus(data.id, data.status)
})

// Logistics 相关接口
Mock.mock(/\/api\/logistics\/getCompanyList/, 'get', (options: any) => {
  const url = options.url
  const params: any = {}
  if (url.includes('?')) {
    const searchParams = new URLSearchParams(url.split('?')[1])
    params.pageNum = parseInt(searchParams.get('pageNum') || '1')
    params.pageSize = parseInt(searchParams.get('pageSize') || '10')
    params.name = searchParams.get('name') || ''
    const status = searchParams.get('status')
    params.status = (status !== null && status !== '') ? parseInt(status) : ''
  }
  return logisticsApi.getLogisticsCompanyList(params)
})
Mock.mock(/\/api\/logistics\/addCompany/, 'post', (options: any) => {
  const data = JSON.parse(options.body)
  return logisticsApi.addLogisticsCompany(data)
})
Mock.mock(/\/api\/logistics\/updateCompany/, 'put', (options: any) => {
  const data = JSON.parse(options.body)
  return logisticsApi.updateLogisticsCompany(data)
})
Mock.mock(/\/api\/logistics\/updateCompanyStatus/, 'put', (options: any) => {
  const data = JSON.parse(options.body)
  return logisticsApi.updateLogisticsCompanyStatus(data.id, data.status)
})
Mock.mock(/\/api\/logistics\/deleteCompany/, 'delete', (options: any) => {
  const url = options.url
  const id = url.split('id=')[1]?.split('&')[0]
  return logisticsApi.deleteLogisticsCompany(id)
})
Mock.mock(/\/api\/logistics\/getShipmentRecordList/, 'get', (options: any) => {
  const url = options.url
  const params: any = {}
  if (url.includes('?')) {
    const searchParams = new URLSearchParams(url.split('?')[1])
    params.pageNum = parseInt(searchParams.get('pageNum') || '1')
    params.pageSize = parseInt(searchParams.get('pageSize') || '10')
    params.orderNo = searchParams.get('orderNo') || ''
    params.companyCode = searchParams.get('companyCode') || ''
    params.startDate = searchParams.get('startDate') || ''
    params.endDate = searchParams.get('endDate') || ''
  }
  return logisticsApi.getShipmentRecordList(params)
})

// Marketing 相关接口
Mock.mock(/\/api\/marketing\/getCouponList/, 'get', (options: any) => {
  const url = options.url
  const params: any = {}
  if (url.includes('?')) {
    const searchParams = new URLSearchParams(url.split('?')[1])
    params.pageNum = parseInt(searchParams.get('pageNum') || '1')
    params.pageSize = parseInt(searchParams.get('pageSize') || '10')
    params.name = searchParams.get('name') || ''
    params.type = searchParams.get('type') || ''
    params.status = searchParams.get('status') || ''
  }
  return marketingApi.getCouponList(params)
})
Mock.mock(/\/api\/marketing\/addCoupon/, 'post', (options: any) => {
  const data = JSON.parse(options.body)
  return marketingApi.addCoupon(data)
})
Mock.mock(/\/api\/marketing\/updateCoupon/, 'put', (options: any) => {
  const data = JSON.parse(options.body)
  return marketingApi.updateCoupon(data)
})
Mock.mock(/\/api\/marketing\/deleteCoupon/, 'delete', (options: any) => {
  const url = options.url
  const id = url.split('id=')[1]?.split('&')[0]
  return marketingApi.deleteCoupon(id)
})
Mock.mock(/\/api\/marketing\/getSeckillList/, 'get', (options: any) => {
  const url = options.url
  const params: any = {}
  if (url.includes('?')) {
    const searchParams = new URLSearchParams(url.split('?')[1])
    params.pageNum = parseInt(searchParams.get('pageNum') || '1')
    params.pageSize = parseInt(searchParams.get('pageSize') || '10')
    params.name = searchParams.get('name') || ''
    params.status = searchParams.get('status') || ''
  }
  return marketingApi.getSeckillList(params)
})
Mock.mock(/\/api\/marketing\/addSeckill/, 'post', (options: any) => {
  const data = JSON.parse(options.body)
  return marketingApi.addSeckill(data)
})
Mock.mock(/\/api\/marketing\/updateSeckill/, 'put', (options: any) => {
  const data = JSON.parse(options.body)
  return marketingApi.updateSeckill(data)
})
Mock.mock(/\/api\/marketing\/deleteSeckill/, 'delete', (options: any) => {
  const url = options.url
  const id = url.split('id=')[1]?.split('&')[0]
  return marketingApi.deleteSeckill(id)
})
Mock.mock(/\/api\/marketing\/getDiscountList/, 'get', (options: any) => {
  const url = options.url
  const params: any = {}
  if (url.includes('?')) {
    const searchParams = new URLSearchParams(url.split('?')[1])
    params.pageNum = parseInt(searchParams.get('pageNum') || '1')
    params.pageSize = parseInt(searchParams.get('pageSize') || '10')
    params.name = searchParams.get('name') || ''
    params.status = searchParams.get('status') || ''
  }
  return marketingApi.getDiscountList(params)
})
Mock.mock(/\/api\/marketing\/addDiscount/, 'post', (options: any) => {
  const data = JSON.parse(options.body)
  return marketingApi.addDiscount(data)
})
Mock.mock(/\/api\/marketing\/updateDiscount/, 'put', (options: any) => {
  const data = JSON.parse(options.body)
  return marketingApi.updateDiscount(data)
})
Mock.mock(/\/api\/marketing\/deleteDiscount/, 'delete', (options: any) => {
  const url = options.url
  const id = url.split('id=')[1]?.split('&')[0]
  return marketingApi.deleteDiscount(id)
})

// Staff 相关接口
Mock.mock(/\/api\/staff\/getStaffList/, 'get', (options: any) => {
  const url = options.url
  const params: any = {}
  if (url.includes('?')) {
    const searchParams = new URLSearchParams(url.split('?')[1])
    params.pageNum = parseInt(searchParams.get('pageNum') || '1')
    params.pageSize = parseInt(searchParams.get('pageSize') || '10')
    params.keyword = searchParams.get('keyword') || ''
    params.role = searchParams.get('role') || ''
    params.status = searchParams.get('status') || ''
  }
  return staffApi.getStaffList(params)
})
Mock.mock(/\/api\/staff\/getStaffDetail/, 'get', (options: any) => {
  const url = options.url
  const id = parseInt(url.split('id=')[1]?.split('&')[0] || '0')
  return staffApi.getStaffDetail(id)
})
Mock.mock(/\/api\/staff\/addStaff/, 'post', (options: any) => {
  const data = JSON.parse(options.body)
  return staffApi.addStaff(data)
})
Mock.mock(/\/api\/staff\/updateStaff/, 'put', (options: any) => {
  const data = JSON.parse(options.body)
  return staffApi.updateStaff(data.id, data)
})
Mock.mock(/\/api\/staff\/deleteStaff/, 'delete', (options: any) => {
  const url = options.url
  const id = parseInt(url.split('id=')[1]?.split('&')[0] || '0')
  return staffApi.deleteStaff(id)
})
Mock.mock(/\/api\/staff\/batchDeleteStaff/, 'post', (options: any) => {
  const data = JSON.parse(options.body)
  return staffApi.batchDeleteStaff(data.ids)
})
Mock.mock(/\/api\/staff\/toggleStaffStatus/, 'put', (options: any) => {
  const data = JSON.parse(options.body)
  return staffApi.toggleStaffStatus(data.id, data.status)
})
Mock.mock(/\/api\/staff\/resetStaffPassword/, 'put', (options: any) => {
  const data = JSON.parse(options.body)
  return staffApi.resetStaffPassword(data.id)
})
Mock.mock(/\/api\/staff\/getRoleList/, 'get', staffApi.getRoleList)


console.log('Mock 服务已启动')