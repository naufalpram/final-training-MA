const express = require("express")
const router = express.Router()
const verifyJWT = require("../middleware/verifyJWT")
const experiencesController = require('../controllers/experiencesController')

router.route("/")
    .post(verifyJWT, experiencesController.createExperience)
    .get(experiencesController.getAllExperiences)
    .patch(verifyJWT, experiencesController.updateExperience)
    .delete(verifyJWT, experiencesController.deleteExperience)

router.route("/:id").get(experiencesController.getExperienceById)

module.exports = router
