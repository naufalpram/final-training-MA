const express = require("express")
const todosController = require("../controllers/todosController")

const router = express.Router()

router
  .route("/")
  .get(todosController.getAllTodos)
  .post(todosController.createNewTodo)
  .patch(todosController.updateTodo)
  .delete(todosController.deleteTodo)

router.route("/:userId").get(todosController.getTodosByUserId)

module.exports = router
