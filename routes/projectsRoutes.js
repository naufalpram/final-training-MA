const express = require("express")
const router = express.Router()
const verifyJWT = require("../middleware/verifyJWT")
const projectsController = require('../controllers/projectsController')

// router.use(verifyJWT)

router.route("/")
    .post(projectsController.createProject)
    .get(projectsController.getAllProjects)
    .patch(projectsController.updateProject)
    .delete(projectsController.deleteProject)

module.exports = router
