const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getAdminData,
  forgetPassword,
  verifyOtp,
  updatePassword,
  changePassword,
  editProfile,
} = require("../controllers/adminController/authController");
const { upload, createFilePath } = require("../helpers/imageUpload");
const tokenAdminAuthorisation = require("../middlewares/tokenAdminAuth");

router.post("/signup", createFilePath, upload.any(), signup);
router.post("/login", login);
router.get("/getAdminData", tokenAdminAuthorisation, getAdminData);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyOtp", verifyOtp);
router.post("/updatePassword", updatePassword);
router.post("/changePassword", tokenAdminAuthorisation, changePassword);
router.post(
  "/editProfile",
  tokenAdminAuthorisation,
  createFilePath,
  upload.any(),
  editProfile
);

module.exports = router;
