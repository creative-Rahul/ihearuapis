const express = require("express");
const router = express.Router();
const {
  signup,
  verifyOtp,
} = require("../controllers/userController/authController");

router.post("/signup", signup);
router.post("/login");
router.post("/verifyOtp", verifyOtp);
module.exports = router;
