const express = require("express")
const usersController = require("../controllers/usersController")
const router = express.Router()

router
  .route("/")
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  // .patch(usersController.updateUser) // hidupin jika IDnya dipasang di body
  .delete(usersController.deleteUser)

// hidupin jika IDnya dipasang sebagai path di URL
router.route("/:id").patch(usersController.updateUser)

module.exports = router
