const express = require("express")
const router = express.Router()
const verifyJWT = require("../middleware/verifyJWT")
const projectsController = require('../controllers/projectsController')

router.route("/")
    .post(verifyJWT, projectsController.createProject)
    .get(projectsController.getAllProjects)
    .patch(verifyJWT, projectsController.updateProject)
    .delete(verifyJWT, projectsController.deleteProject)

router.route("/:id").get(projectsController.getProjectById)

module.exports = router
