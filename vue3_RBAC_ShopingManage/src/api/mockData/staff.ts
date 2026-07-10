
// 员工接口响应格式
interface StaffResponse {
  code: number
  msg: string
  data: any
}

// 员工数据接口
interface Staff {
  id: number
  employeeNo: string
  name: string
  account: string
  phone: string
  role: string
  status: string
  lastLogin: string
  createTime: string
}

//staffparams
interface StaffParams {
  pageNum: number
  pageSize: number
  keyword?: string
  role?: string
  status?: string 
}

// 角色映射
export const roleMap = {
  super_admin: { name: '超级管理员', type: 'danger' },
  operator: { name: '运营人员', type: 'primary' },
  order_staff: { name: '订单专员', type: 'success' },
  finance: { name: '财务人员', type: 'warning' },
  customer_service: { name: '普通客服', type: 'info' }
}


// 员工数据列表
export const staffList:Staff[] = [
  { id: 1, employeeNo: 'EMP001', name: '张三', account: 'admin', phone: '13800138001', role: 'super_admin', status: '1', lastLogin: '2026-05-25 10:30:00', createTime: '2022-01-15 09:00:00' },
  { id: 2, employeeNo: 'EMP002', name: '李四', account: 'operator1', phone: '13800138002', role: 'operator', status: '1', lastLogin: '2026-05-25 09:15:00', createTime: '2022-03-20 14:30:00' },
  { id: 3, employeeNo: 'EMP003', name: '王五', account: 'order1', phone: '13800138003', role: 'order_staff', status: '1', lastLogin: '2026-05-24 18:45:00', createTime: '2022-05-10 10:00:00' },
  { id: 4, employeeNo: 'EMP004', name: '赵六', account: 'finance1', phone: '13800138004', role: 'finance', status: '1', lastLogin: '2026-05-25 08:00:00', createTime: '2022-07-05 16:20:00' },
  { id: 5, employeeNo: 'EMP005', name: '钱七', account: 'service1', phone: '13800138005', role: 'customer_service', status: '1', lastLogin: '2026-05-24 17:30:00', createTime: '2022-09-18 11:45:00' },
  { id: 6, employeeNo: 'EMP006', name: '孙八', account: 'operator2', phone: '13800138006', role: 'operator', status: '0', lastLogin: '2026-05-20 14:20:00', createTime: '2022-11-22 09:30:00' },
  { id: 7, employeeNo: 'EMP007', name: '周九', account: 'order2', phone: '13800138007', role: 'order_staff', status: '1', lastLogin: '2026-05-25 11:00:00', createTime: '2023-01-10 15:00:00' },
]

// 获取员工列表
export const getStaffList = (params: StaffParams)
  : StaffResponse => {
  // 展开运算符 [...staffList] 表示将 staffList 数组中的所有元素复制到新数组result中。
  // 这样可以确保在筛选过程中不会直接修改原始数据，而是在新数组中进行操作。
   let result = [...staffList]  

  // 关键词筛选
  if (params.keyword) {
    //toLowerCase()是将输入的关键词和员工姓名/账号都转换为小写，
    // 从而实现 不区分大小写的模糊搜索。例如输入 "ADMIN" 也能匹配到 "admin"。
    const keyword = params.keyword.toLowerCase()
    result = result.filter(item =>
      // 检查员工姓名或账号是否包含关键词
      item.name.toLowerCase().includes(keyword) ||
      item.account.toLowerCase().includes(keyword)
    )
  }

  // 角色筛选
  if (params.role) {
    result = result.filter(item => item.role === params.role)
  }

  // 状态筛选
  if (params.status !== undefined && params.status !== '') {
    result = result.filter(item => item.status === params.status)
  }

  const total = result.length
  const start = (params.pageNum - 1) * params.pageSize
  const end = start + params.pageSize
  const list = result.slice(start, end)

  return {
    code: 200,
    msg: 'success',
    data: { list, total }
  }
}

// 获取员工详情
export const getStaffDetail = (id: number): StaffResponse => {
  const staff = staffList.find(item => item.id === id)
  if (staff) {
    return {
      code: 200,
      msg: 'success',
      data: staff
    }
  }
  return {
    code: 404,
    msg: '员工不存在',
    data: null
  }
}

// 添加员工
export const addStaff = (data: Omit<Staff, 'id' | 'employeeNo' | 'lastLogin' | 'createTime'>): StaffResponse => {
  const newId = Math.max(...staffList.map(s => s.id)) + 1
  const newStaff: Staff = {
    id: newId,
    employeeNo: `EMP${String(newId).padStart(3, '0')}`,
    ...data,
    lastLogin: '',
    createTime: new Date().toISOString().replace('T', ' ').slice(0, 19)
  }
  staffList.push(newStaff)

  return {
    code: 200,
    msg: '添加成功',
    data: newStaff
  }
}

// 更新员工信息
export const updateStaff = (id: number, data: Partial<Staff>): StaffResponse => {
  const index = staffList.findIndex(item => item.id === id)
  if (index !== -1) {
    staffList[index] = { ...staffList[index], ...data }
    return {
      code: 200,
      msg: '更新成功',
      data: staffList[index]
    }
  }
  return {
    code: 404,
    msg: '员工不存在',
    data: null
  }
}

// 删除员工
export const deleteStaff = (id: number): StaffResponse => {
  const index = staffList.findIndex(item => item.id === id)
  if (index !== -1) {
    staffList.splice(index, 1)
    return {
      code: 200,
      msg: '删除成功',
      data: null
    }
  }
  return {
    code: 404,
    msg: '员工不存在',
    data: null
  }
}

// 批量删除员工
export const batchDeleteStaff = (ids: number[]): StaffResponse => {
  ids.forEach(id => {
    const index = staffList.findIndex(item => item.id === id)
    // 检查员工是否存在
    if (index !== -1) {
      staffList.splice(index, 1)
    }
  })
  return {
    code: 200,
    msg: `批量删除成功，共删除 ${ids.length} 个员工`,
    data: null
  }
}

// 切换员工状态
export const toggleStaffStatus = (id: number, status: string): StaffResponse => {
  const index = staffList.findIndex(item => item.id === id)
  if (index !== -1) {
    staffList[index].status = status
    return {
      code: 200,
      msg: status === '1' ? '解禁成功' : '禁用成功',
      data: staffList[index]
    }
  }
  return {
    code: 404,
    msg: '员工不存在',
    data: null
  }
}

// 重置密码
export const resetStaffPassword = (id: number): StaffResponse => {
  const staff = staffList.find(item => item.id === id)
  if (staff) {
    // 重置密码为初始密码 123456
    return {
      code: 200,
      msg: '密码已重置为 123456',
      data: staff
    }
  }
  return {
    code: 404,
    msg: '员工不存在',
    data: null
  }
}

// 获取角色列表
export const getRoleList = (): StaffResponse => {
  const roles = Object.entries(roleMap).map(([key, value]) => ({
    value: key,
    label: value.name,
    type: value.type
  }))
  return {
    code: 200,
    msg: 'success',
    data: roles
  }
}

// 默认导出所有接口
const staffApi = {
  getStaffList,
  getStaffDetail,
  addStaff,
  updateStaff,
  deleteStaff,
  batchDeleteStaff,
  toggleStaffStatus,
  resetStaffPassword,
  getRoleList,
  staffList
}

export default staffApi
