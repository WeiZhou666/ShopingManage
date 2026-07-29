import jwt from 'jsonwebtoken'

// JWT 密钥从环境变量读取，未配置时给出警告并使用开发兜底值
const SECRET_KEY = process.env.JWT_SECRET || 'dev_fallback_secret'
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  警告：未设置 JWT_SECRET 环境变量，使用默认密钥，仅限开发环境！')
}

// 生成 JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN })
}

// 验证并解码 JWT token
const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY)
}

export { generateToken, verifyToken }
