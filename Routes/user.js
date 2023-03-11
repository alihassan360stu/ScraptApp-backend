const router = require("express").Router();
const { signin, register, checkingUser, changePassword } = require("../Controller/user.js")
router.post("/register", register);
router.post("/signin", signin);
router.post("/check/user", checkingUser);
router.post("/change/password", changePassword);
module.exports = router;