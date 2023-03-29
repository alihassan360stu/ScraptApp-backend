const router = require("express").Router();
const { signin, register, checkingUser, changePassword, forgot, checkForgotLink, checkOTPandToken, changeByForgot } = require("../Controller/user.js")
const { AythMiddle } = require("../Middleware/index.js")
// forgot
router.post("/register", register);
router.post("/signin", signin);
router.post("/forgot", forgot);
router.post("/forgot/link", checkForgotLink);
router.post("/forgot/otp", checkOTPandToken);
router.post("/forgot/reset", changeByForgot);
router.post("/check/user", checkingUser);
router.post("/change/password", AythMiddle(), changePassword);
module.exports = router;