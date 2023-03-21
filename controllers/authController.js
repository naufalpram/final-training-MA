const prisma = require("../db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password)
    return res.status(400).json({ message: "email/password tidak lengkap" })

  const userExists = await prisma.user.findUnique({ where: { email } })

  if (!userExists)
    return res.status(400).json({ message: "User tidak ditemukan" })

  const validatePwd = await bcrypt.compare(password, userExists.password)

  if (!validatePwd) return res.status(401).json({ message: "Gagal otorisasi" })

  const accessToken = jwt.sign(
    {
      id: userExists.id,
      email: userExists.email,
      name: userExists.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  )

  const refreshToken = jwt.sign(
    {
      id: userExists.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  )

  res.cookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  })

  res.json({ accessToken })
}

const register = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Data registrasi tidak lengkap" })
  }

  const hashPassword = await bcrypt.hash(password, 10)

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
    },
  })

  if (!newUser)
    return res.status(400).json({ message: "Gagal melakukan registrasi" })

  return res
    .status(201)
    .json({ message: `User: ${newUser.name} berhasil registrasi` })
}

const refresh = async (req, res) => {}

const logout = async (req, res) => {}

module.exports = { login, register, refresh, logout }
