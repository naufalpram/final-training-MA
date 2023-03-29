const express = require("express")
const router = express.Router()
const verifyJWT = require('../middleware/verifyJWT')
const skillsController = require('../controllers/skillsController')

router.route("/")
    .post(verifyJWT, skillsController.createSkill)
    .get(skillsController.getAllSkills)
    .patch(verifyJWT, skillsController.updateSkill)
    .delete(verifyJWT, skillsController.deleteSkill)

router.route("/:id").get(skillsController.getSkillById)

module.exports = router
