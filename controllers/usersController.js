const prisma = require("../db")

const getAllUsers = async (req, res) => {
  const getAll = await prisma.user.findMany()

  return res.status(200).json({ user: getAll, message: "OK" })
}

// const getUserById = (req, res) => {}

const createNewUser = async (req, res) => {
  const { name } = req.body

  if (!name) {
    return res.status(400).json({ message: "Data yang dikirim tidak lengkap" })
  }

  const duplicate = await prisma.user.findMany({ where: { name } })

  if (duplicate.length > 0) {
    return res.status(400).json({ message: "Nama sudah digunakan" })
  }

  await prisma.user.create({
    data: {
      name,
    },
  })

  return res.status(201).json({ message: "User berhasil dibuat" }) // 201 -> Created
}

const updateUser = async (req, res) => {
  const { id, name } = req.body
  //   const idParam = req.params.id

  // idnya diambil dari param
  //   if (!name) {
  //     return res.status(400).json({ message: "Data yang dikirim tidak lengkap" })
  //   }

  // id termasuk dalam body
  if (!id || !name) {
    return res.status(400).json({ message: "Data yang dikirim tidak lengkap" })
  }

  const userExists = await prisma.user.findUnique({ where: { id } })

  if (!userExists) {
    return res
      .status(400)
      .json({ message: "Request tidak dapat diproses: ID Tidak ditemukan" })
  }

  const duplicate = await prisma.user.findMany({ where: { name } })

  if (duplicate.length > 0) {
    return res.status(400).json({ message: "Request nama sudah digunakan" })
  }

  await prisma.user.update({
    data: {
      name,
    },
    where: {
      id,
    },
  })

  return res.status(200).json({ message: "User berhasil diperbarui" }) // 200 -> OK
}

const deleteUser = async (req, res) => {
  const { id } = req.body

  if (!id)
    return res.status(400).json({ message: "Request body tidak lengkap" })

  // Usernya ada gak, supaya bisa dihapus
  const userExists = await prisma.user.findUnique({ where: { id } })

  if (!userExists) {
    return res
      .status(400)
      .json({ message: "Request tidak dapat diproses: ID Tidak ditemukan" })
  }

  // Proses penghapusan
  await prisma.user.delete({
    where: {
      id,
    },
  })

  // Response berhasil
  return res.status(200).json({ message: "User berhasil dihapus" })
}

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser }
