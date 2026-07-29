// 登录失败次数限制工具
// 基于内存 Map 实现，按账号维度限制
// 规则：连续失败 5 次后锁定 15 分钟，锁定期间即使密码正确也拒绝登录
//       登录成功后立即清零；锁定过期后自动解锁并重新计数

// 最大失败次数
const MAX_FAIL_COUNT = 5
// 锁定时长（毫秒）：15 分钟
const LOCK_DURATION = 15 * 60 * 1000

// 内存存储：account -> { failCount, lockUntil }
const failMap = new Map()

// 检查账号是否被锁定
// 返回：{ locked: true, remainMs } 或 { locked: false }
const checkLoginLimit = (account) => {
  const record = failMap.get(account)
  if (!record) {
    return { locked: false }
  }

  // 锁定已过期，自动解锁并清零
  if (record.lockUntil && Date.now() > record.lockUntil) {
    failMap.delete(account)
    return { locked: false }
  }

  // 仍在锁定中
  if (record.lockUntil && Date.now() <= record.lockUntil) {
    const remainMs = record.lockUntil - Date.now()
    const remainMin = Math.ceil(remainMs / 60000)
    return { locked: true, remainMs, remainMin }
  }

  return { locked: false }
}

// 记录一次登录失败
// 返回当前累计失败次数
const recordLoginFailure = (account) => {
  const record = failMap.get(account) || { failCount: 0, lockUntil: null }

  // 若上次锁定已过期，重新计数
  if (record.lockUntil && Date.now() > record.lockUntil) {
    record.failCount = 0
    record.lockUntil = null
  }

  record.failCount += 1

  // 达到最大失败次数，设置锁定
  if (record.failCount >= MAX_FAIL_COUNT) {
    record.lockUntil = Date.now() + LOCK_DURATION
  }

  failMap.set(account, record)
  return record.failCount
}

// 登录成功后清零该账号的失败记录
const clearLoginLimit = (account) => {
  failMap.delete(account)
}

export {
  checkLoginLimit,
  recordLoginFailure,
  clearLoginLimit,
  MAX_FAIL_COUNT
}
