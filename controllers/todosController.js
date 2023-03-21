const prisma = require("../db")

const getAllTodos = async (req, res) => {
  const getAll = await prisma.todos.findMany()

  if (getAll.length < 1)
    return res.status(200).json({ message: "Belum ada todos" })

  return res.status(200).json({ todos: getAll, message: "OK" })
}

const getTodosByUserId = async (req, res) => {
  const { userId } = req.params

  if (!userId) return res.status(400).json({ message: "Data tidak lengkap" })

  const getByUId = await prisma.todos.findMany({ where: { userId } })

  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (getByUId.length < 1)
    return res
      .status(200)
      .json({ message: `Belum ada todos oleh user: ${user.name}` })

  return res.status(200).json({ todos: getByUId, message: "OK" })
}

const createNewTodo = async (req, res) => {
  const { title, body, userId } = req.body

  if (!title || !userId) {
    return res.status(400).json({ message: "Data tidak lengkap" })
  }

  const userExists = await prisma.user.findUnique({ where: { id: userId } })

  if (userExists.length < 1)
    return res.status(400).json({ message: "UserId tidak valid" })

  const newTodos = await prisma.todos.create({ data: { title, body, userId } })

  if (!newTodos) {
    return res.status(400).json({ message: "Todos tidak berhasil dibuat" })
  }

  return res
    .status(201)
    .json({ message: `Todos: ${newTodos.title} berhasil dibuat` })
}

const updateTodo = async (req, res) => {
  const { id, title, body, userId } = req.body

  if (!id || !title || !userId) {
    return res.status(400).json({ message: "Data tidak lengkap" })
  }

  const userExists = await prisma.user.findUnique({ where: { id: userId } })

  if (userExists.length < 1)
    return res.status(400).json({ message: "UserId tidak valid" })

  const updateTodos = await prisma.todos.update({
    data: { title, body, userId, updatedAt: new Date(Date.now()) },
    where: { id },
  })

  if (!updateTodos) {
    return res.status(400).json({ message: "Todos tidak berhasil diperbarui" })
  }

  return res
    .status(201)
    .json({ message: `Todos: ${updateTodos.title} berhasil diperbarui` })
}

const deleteTodo = async (req, res) => {
  const { id } = req.body

  if (!id) return res.status(400).json({ message: "Data tidak lengkap" })

  const todoExists = await prisma.todos.findUnique({ where: { id } })

  if (!todoExists)
    return res.status(400).json({ message: "Todo tidak ditemukan" })

  await prisma.todos.delete({ where: { id } })

  return res
    .status(200)
    .json({ message: `Todo: ${todoExists.title} berhasil dihapus` })
}

module.exports = {
  getAllTodos,
  getTodosByUserId,
  createNewTodo,
  updateTodo,
  deleteTodo,
}
