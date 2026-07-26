import jwt from 'jsonwebtoken'

// JWT 密钥（生产环境应放到环境变量中）
const SECRET_KEY = 'koa_manage_secret_2024'

// token 过期时间：7 天
const EXPIRES_IN = '7d'

// 生成 JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN })
}

// 验证并解码 JWT token
const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY)
}

export { generateToken, verifyToken }
