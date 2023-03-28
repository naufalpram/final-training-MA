const prisma = require("../db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const RegisterUserData = require('../dto/RegisterUserData')

const login = async (req, res) => {
  const { username, password } = req.body

  if (!username || !password)
    return res.status(400).json({ message: "username/password tidak lengkap" })

  const userExists = await prisma.user.findUnique({ where: { username } })

  if (!userExists)
    return res.status(400).json({ message: "User tidak ditemukan" })

  const validatePwd = await bcrypt.compare(password, userExists.password)

  if (!validatePwd) return res.status(401).json({ message: "Gagal otorisasi" })

  const profile = await prisma.profile.findUnique({ where: { userId: userExists.id } })

  if (!profile)
    return res.status(500).json({ message: "Terdapat kesalahan pada server"})

  const accessToken = jwt.sign(
    {
      id: userExists.id,
      username: userExists.username,
      name: profile.name,
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
  const registerData = new RegisterUserData(req.body)

  if (!registerData.username || !registerData.password || !registerData.name || !registerData.email || !registerData.gender || !registerData.birthdate) {
    return res.status(400).json({ message: "Data registrasi tidak lengkap" })
  }

  const emailUsed = await prisma.profile.findUnique({ where: { email: registerData.email } })
  const usernameUsed = await prisma.user.findUnique({ where: { username: registerData.username } })

  if (emailUsed || usernameUsed)
    return res.status(400).json({ message: "Username atau Email sudah digunakan" })

  const hashPassword = await bcrypt.hash(registerData.password, 10)

  const newUser = await prisma.user.create({
    data: {
      username: registerData.username,
      password: hashPassword,
      role: registerData.role
    },
  })

  if (!newUser)
    return res.status(400).json({ message: "Gagal melakukan registrasi" })
  
  const userProfile = await prisma.profile.create({
    data: {
      name: registerData.name,
      email: registerData.email,
      gender: registerData.gender,
      birthdate: registerData.birthdate,
      userId: newUser.id
    }
  })

  if (!userProfile){
    await prisma.user.delete({ where: { id: newUser.id }}) // mencegah user ada namun profile tidak ada
    return res.status(400).json({ message: "Gagal membuat profil"})
  }

  return res
    .status(201)
    .json({ message: `User: ${userProfile.name} berhasil registrasi` })
}

const refresh = async (req, res) => {
  const cookies = req.cookies

  if (!cookies.refreshToken)
    return res.status(401).json({ message: "Unauthorized" })

  jwt.verify(
    cookies.refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      const userExists = await prisma.user.findUnique({
        where: { id: decoded.id },
      })

      if (!userExists) return res.status(403).json({ message: "Forbidden" })

      const profile = await prisma.profile.findUnique({
        where: { userId: userExists.id }
      })

      const accessToken = jwt.sign(
        {
          id: userExists.id,
          username: userExists.username,
          name: profile.name,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      )
      return res.json({ accessToken })
    }
  )
}

const logout = async (req, res) => {
  res.clearCookie("refreshToken")
  return res.status(200).json({ message: "Logged Out"})
}

module.exports = { login, register, refresh, logout }
