const express = require("express");
const { signup, login } = require("../controllers/adminController/authController");
const { upload, createFilePath } = require("../helpers/imageUpload");
const tokenAdminAuthorisation = require("../middlewares/tokenAdminAuth");
const router = express.Router();


router.post("/signup", createFilePath, upload.any(), signup);
router.post("/login", login);

router.get("/getAdminData", tokenAdminAuthorisation, getAdminData);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyOtp", verifyOtp);
router.post("/updatePassword", updatePassword);
router.post("/changePassword", tokenAdminAuthorisation, changePassword);
router.get("/mailToLowerCase", tokenAdminAuthorisation, mailToLowerCase);
router.post(
  "/editProfile",
  tokenAdminAuthorisation,
  upload.any(),
  editProfile
);

module.exports = router