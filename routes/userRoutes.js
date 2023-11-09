const express = require("express");
const router = express.Router();
const tokenUserAuth = require("../middlewares/tokenUserAuth");
const { upload, createFilePath } = require("../helpers/imageUpload");
const {
  signup,
  verifyOtp,
  completeProfile,
} = require("../controllers/userController/authController");

router.post("/signup", signup);
router.post("/login");
router.post("/verifyOtp", verifyOtp);
router.post(
  "/completeProfile",
  tokenUserAuth,
  createFilePath,
  upload.any(),
  completeProfile
);
module.exports = router;
