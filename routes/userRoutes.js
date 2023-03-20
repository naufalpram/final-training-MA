const express = require("express")
const usersController = require("../controllers/usersController")
const router = express.Router()

router
  .route("/")
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser)

// router.route('/:id').patch()

module.exports = router
