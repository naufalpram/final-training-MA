const express = require("express")
const router = express.Router()
const verifyJWT = require('../middleware/verifyJWT')
const skillsController = require('../controllers/skillsController')

// router.use(verifyJWT)

router.route("/")
    .post(skillsController.createSkill)
    .get(skillsController.getAllSkills)
    .patch(skillsController.updateSkill)
    .delete(skillsController.deleteSkill)

router.route("/:id").get(skillsController.getSkillById)

module.exports = router
