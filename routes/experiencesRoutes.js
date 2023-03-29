const express = require("express")
const router = express.Router()
const verifyJWT = require("../middleware/verifyJWT")
const experiencesController = require('../controllers/experiencesController')

// router.use(verifyJWT)

router.route("/")
    .post(experiencesController.createExperience)
    .get(experiencesController.getAllExperiences)
    .patch(experiencesController.updateExperience)
    .delete(experiencesController.deleteExperience)

router.route("/:id").get(experiencesController.getExperienceById)

module.exports = router
