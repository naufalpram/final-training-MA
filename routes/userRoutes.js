const express = require("express")

const router = express.Router()

router.route("/").get().post().patch().delete()

// router.route('/:id').patch()

module.exports = router
