const prisma = require("../db")

const getAllUsers = (req, res) => {}

// const getUserById = (req, res) => {}

const createNewUser = (req, res) => {
  const { name } = req.body

  const duplicate = prisma.user.findMany({ name })

  if (duplicate) {
    return res.status(400).json({ message: "Nama sudah digunakan" })
  }

  prisma.user.create({
    data: {
      name,
    },
  })

  return res.status(201).json({ message: "User berhasil dibuat" }) // 201 -> Created
}

const updateUser = (req, res) => {
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

  const userExists = prisma.user.findUnique({ where: { id } })

  if (!userExists) {
    return res
      .status(400)
      .json({ message: "Request tidak dapat diproses: ID Tidak ditemukan" })
  }

  const duplicate = prisma.user.findMany({ name })

  if (duplicate) {
    return res.status(400).json({ message: "Request nama sudah digunakan" })
  }

  prisma.user.update({
    data: {
      id,
      name,
    },
  })

  return res.status(200).json({ message: "User berhasil diperbarui" }) // 200 -> OK
}

const deleteUser = (req, res) => {
  const { id } = req.body

  if (!id)
    return res.status(400).json({ message: "Request body tidak lengkap" })

  // Usernya ada gak, supaya bisa dihapus
  const userExists = prisma.user.findUnique({ where: { id } })

  if (!userExists) {
    return res
      .status(400)
      .json({ message: "Request tidak dapat diproses: ID Tidak ditemukan" })
  }

  // Proses penghapusan
  prisma.user.delete({
    where: {
      id,
    },
  })

  // Response berhasil
  return res.status(200).json({ message: "User berhasil dihapus" })
}

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser }
