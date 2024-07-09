
const express = require("express");
const router = express.Router();

const{ signupUser, loginUser, verifyOTP, logoutUser } = require("../controllers/userController");

router.route("/signup").post(signupUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/verifyOTP").post(verifyOTP);


module.exports = router;



