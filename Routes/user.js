const router = require("express").Router();
const { signin, register } = require("../Controller/user.js")
router.post("/register", register);
router.post("/signin", signin);



module.exports = router;