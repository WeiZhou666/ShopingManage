/**
 * 整个项目api的统一管理
 **/

import request from './request'

// Home 相关接口
export const getTableData = () => {
  return request({
    url: '/api/home/getTableData',
    method: 'get'
  })
}

export const gettCountData = () => {
  return request({
    url: '/api/home/getCountData',
    method: 'get'
  })
}

export const getChartData = () => {
  return request({
    url: '/api/home/getChartData',
    method: 'get'
  })
}

export const getBarChartData = () => {
  return request({
    url: '/api/home/getBarChartData',
    method: 'get'
  })
}

export const getPieChartData = () => {
  return request({
    url: '/api/home/getPieChartData',
    method: 'get'
  })
}

// User 相关接口
export const getUserList = (data = {}) => {
  return request({
    url: '/api/user/getUserList',
    method: 'get',
    data,
   
  })
}

export const getUserDetail = (id: string | number) => {
  return request({
    url: '/api/user/getUserDetail',
    method: 'get',
    data: { id }
  })
}

export const addUser = (data: any) => {
  return request({
    url: '/api/user/addUser',
    method: 'post',
    data
  })
}

export const updateUser = (data: any) => {
  return request({
    url: '/api/user/updateUser',
    method: 'put',
    data
  })
}

export const deleteUser = (id: string | number) => {
  return request({
    url: '/api/user/deleteUser',
    method: 'delete',
    params: { id }
  })
}

export const batchDeleteUsers = (ids: any[]) => {
  return request({
    url: '/api/user/batchDeleteUsers',
    method: 'post',
    data: { ids }
  })
}

export const updateUserStatus = (id: string | number, status: number) => {
  return request({
    url: '/api/user/updateUserStatus',
    method: 'put',
    data: { id, status }
  })
}

export const updateUserTags = (id: string | number, tags: string[]) => {
  return request({
    url: '/api/user/updateUserTags',
    method: 'put',
    data: { id, tags }
  })
}

export const getRoleList = () => {
  return request({
    url: '/api/user/getRoleList',
    method: 'get'
  })
}

export const getDepartmentList = () => {
  return request({
    url: '/api/user/getDepartmentList',
    method: 'get'
  })
}

// Order 相关接口
export const getOrderList = (data = {}) => {
  return request({
    url: '/api/order/getOrderList',
    method: 'get',
    data
  })
}

export const deliveryOrder = (id: string | number) => {
  return request({
    url: '/api/order/deliveryOrder',
    method: 'put',
    data: { id }
  })
}

export const closeOrder = (id: string | number) => {
  return request({
    url: '/api/order/closeOrder',
    method: 'put',
    data: { id }
  })
}

export const getOrderDetail = (orderNo: string) => {
  return request({
    url: '/api/order/getOrderDetail',
    method: 'get',
    data: { orderNo }
  })
}

// Product 相关接口
export const getProductList = (data = {}) => {
  return request({
    url: '/api/product/getProductList',
    method: 'get',
    data
  })
}

export const getProductDetail = (id: string | number) => {
  return request({
    url: '/api/product/getProductDetail',
    method: 'get',
    params: { id }
  })
}

export const getProductEdit = (id: string | number) => {
  return request({
    url: '/api/product/getProductEdit',
    method: 'get',
    params: { id }
  })
}

export const addProduct = (data: any) => {
  return request({
    url: '/api/product/addProduct',
    method: 'post',
    data
  })
}

export const updateProduct = (data: any) => {
  return request({
    url: '/api/product/updateProduct',
    method: 'put',
    data
  })
}

export const deleteProduct = (id: string | number) => {
  return request({
    url: '/api/product/deleteProduct',
    method: 'delete',
    params: { id }
  })
}

export const batchDeleteProducts = (ids: any[]) => {
  return request({
    url: '/api/product/batchDeleteProducts',
    method: 'post',
    data: { ids }
  })
}

export const updateProductStatus = (id: string | number, status: number) => {
  return request({
    url: '/api/product/updateProductStatus',
    method: 'put',
    data: { id, status }
  })
}

// Logistics 相关接口
export const getLogisticsCompanyList = (data = {}) => {
  return request({
    url: '/api/logistics/getCompanyList',
    method: 'get',
    data
  })
}

export const addLogisticsCompany = (data: any) => {
  return request({
    url: '/api/logistics/addCompany',
    method: 'post',
    data
  })
}

export const updateLogisticsCompany = (data: any) => {
  return request({
    url: '/api/logistics/updateCompany',
    method: 'put',
    data
  })
}

export const updateLogisticsCompanyStatus = (id: string | number, status: number) => {
  return request({
    url: '/api/logistics/updateCompanyStatus',
    method: 'put',
    data: { id, status }
  })
}

export const deleteLogisticsCompany = (id: string | number) => {
  return request({
    url: '/api/logistics/deleteCompany',
    method: 'delete',
    params: { id }
  })
}

export const getShipmentRecordList = (data = {}) => {
  return request({
    url: '/api/logistics/getShipmentRecordList',
    method: 'get',
    data
  })
}

// Marketing 相关接口
export const getCouponList = (data = {}) => {
  return request({
    url: '/api/marketing/getCouponList',
    method: 'get',
    data
  })
}

export const addCoupon = (data: any) => {
  return request({
    url: '/api/marketing/addCoupon',
    method: 'post',
    data
  })
}

export const updateCoupon = (data: any) => {
  return request({
    url: '/api/marketing/updateCoupon',
    method: 'put',
    data
  })
}

export const deleteCoupon = (id: string | number) => {
  return request({
    url: '/api/marketing/deleteCoupon',
    method: 'delete',
    params: { id }
  })
}

export const getSeckillList = (data = {}) => {
  return request({
    url: '/api/marketing/getSeckillList',
    method: 'get',
    data
  })
}

export const addSeckill = (data: any) => {
  return request({
    url: '/api/marketing/addSeckill',
    method: 'post',
    data
  })
}

export const updateSeckill = (data: any) => {
  return request({
    url: '/api/marketing/updateSeckill',
    method: 'put',
    data
  })
}

export const deleteSeckill = (id: string | number) => {
  return request({
    url: '/api/marketing/deleteSeckill',
    method: 'delete',
    params: { id }
  })
}

export const getDiscountList = (data = {}) => {
  return request({
    url: '/api/marketing/getDiscountList',
    method: 'get',
    data
  })
}

export const addDiscount = (data: any) => {
  return request({
    url: '/api/marketing/addDiscount',
    method: 'post',
    data
  })
}

export const updateDiscount = (data: any) => {
  return request({
    url: '/api/marketing/updateDiscount',
    method: 'put',
    data
  })
}

export const deleteDiscount = (id: string | number) => {
  return request({
    url: '/api/marketing/deleteDiscount',
    method: 'delete',
    params: { id }
  })
}

// Staff 相关接口
export const getStaffList = (data = {}) => {
  return request({
    url: '/api/staff/getStaffList',
    method: 'get',
    data
  })
}

export const getStaffDetail = (id: string | number) => {
  return request({
    url: '/api/staff/getStaffDetail',
    method: 'get',
    params: { id }
  })
}

export const addStaff = (data: any) => {
  return request({
    url: '/api/staff/addStaff',
    method: 'post',
    data
  })
}

export const updateStaff = (data: any) => {
  return request({
    url: '/api/staff/updateStaff',
    method: 'put',
    data
  })
}

export const deleteStaff = (id: string | number) => {
  return request({
    url: '/api/staff/deleteStaff',
    method: 'delete',
    params: { id }
  })
}

export const batchDeleteStaff = (ids: any[]) => {
  return request({
    url: '/api/staff/batchDeleteStaff',
    method: 'post',
    data: { ids }
  })
}

export const toggleStaffStatus = (id: string | number, status: string) => {
  return request({
    url: '/api/staff/toggleStaffStatus',
    method: 'put',
    data: { id, status }
  })
}

export const resetStaffPassword = (id: string | number) => {
  return request({
    url: '/api/staff/resetStaffPassword',
    method: 'put',
    data: { id }
  })
}

export const getStaffRoleList = () => {
  return request({
    url: '/api/staff/getRoleList',
    method: 'get'
  })
}

// 向后兼容：保留默认导出
export default {
  getTableData,
  gettCountData,
  getChartData,
  getBarChartData,
  getPieChartData,
  getUserList,
  getUserDetail,
  addUser,
  updateUser,
  deleteUser,
  batchDeleteUsers,
  updateUserStatus,
  updateUserTags,
  getRoleList,
  getDepartmentList,
  getOrderList,
  deliveryOrder,
  closeOrder,
  getOrderDetail,
  getProductList,
  getProductDetail,
  getProductEdit,
  addProduct,
  updateProduct,
  deleteProduct,
  batchDeleteProducts,
  updateProductStatus,
  getLogisticsCompanyList,
  addLogisticsCompany,
  updateLogisticsCompany,
  updateLogisticsCompanyStatus,
  deleteLogisticsCompany,
  getShipmentRecordList,
  getCouponList,
  addCoupon,
  updateCoupon,
  deleteCoupon,
  getSeckillList,
  addSeckill,
  updateSeckill,
  deleteSeckill,
  getDiscountList,
  addDiscount,
  updateDiscount,
  deleteDiscount,
  getStaffList,
  getStaffDetail,
  addStaff,
  updateStaff,
  deleteStaff,
  batchDeleteStaff,
  toggleStaffStatus,
  resetStaffPassword,
  getStaffRoleList
}
