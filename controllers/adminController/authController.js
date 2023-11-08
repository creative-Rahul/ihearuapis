const validator = require("validator");
// const sendMail = require("../../services/mail");
const mongoose = require("mongoose");
const Admin = require("../../models/adminModels/adminSchema");
const { error, success } = require("../../service_response/apiResponse");

// Register Admin to StarImporters
exports.signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    console.log(req.body);
    if (!fullName) {
      return res
        .status(201)
        .json(error("Please enter full name", res.statusCode));
    }
    if (!validator.isEmail(email)) {
      return res
        .status(201)
        .json(error("Please enter valid email", res.statusCode));
    }
    if (!password) {
      return res
        .status(201)
        .json(error("Please enter Password", res.statusCode));
    }
    if (!req.files.length) {
      return res.status(201).json(error("Please provide profile picture"));
    }
    if (req.files.length) {
      if (
        !(
          req.files[0].mimetype == "image/jpeg" ||
          req.files[0].mimetype == "image/jpg" ||
          req.files[0].mimetype == "image/webp" ||
          req.files[0].mimetype == "image/svg+xml" ||
          req.files[0].mimetype == "image/png"
        )
      ) {
        return res
          .status(201)
          .json(error("Invalid Image format", res.statusCode));
      }
    }
    const verifyEmail = await Admin.findOne({
      email: email.toLowerCase(),
    });
    if (verifyEmail) {
      return res
        .status(201)
        .json(error("Email is already Registered", res.statusCode));
    }
    const admin = await Admin.create({
      fullName: fullName,
      email: email.toLowerCase(),
      image: req.files[0].path,
      password: password,
    });
    res
      .status(201)
      .json(
        success("Admin has registered Successfully", { admin }, res.statusCode)
      );
  } catch (err) {
    console.log(err);
    res.status(401).json(error("Error while registration", res.statusCode));
  }
};

// User login to Admin
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      return res
        .status(201)
        .json(error("Please enter valid Email", res.statusCode));
    }
    if (!password) {
      return res.status(201).json(error("Please enter Password"));
    }
    const verifyAdmin = await Admin.findOne({
      email: email.toLowerCase(),
    });
    if (!verifyAdmin) {
      return res
        .status(201)
        .json(error("Email is not Registered", res.statusCode));
    }
    if (!verifyAdmin.status) {
      return res
        .status(201)
        .json(error("Your account is disabled by Admin", res.statusCode));
    }
    const token = await verifyAdmin.generateAdminAuthToken();

    if (
      !(await verifyAdmin.checkAdminPassword(password, verifyAdmin.password))
    ) {
      return res.status(201).json(error("Wrong Password", res.statusCode));
    }
    res
      .header("x-auth-token-admin", token)
      .header("access-control-expose-headers", "x-auth-token-admin")
      .status(201)
      .json(success("Logged in", { verifyAdmin, token }), res.statusCode);
  } catch (err) {
    console.log(err);
    res
      .status(201)
      .json(error("Please enter valid Credential", res.statusCode));
  }
};

// Forget password -> Admin
exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!validator.isEmail(email)) {
      return res
        .status(201)
        .json(error("Please enter a valid mail", res.statusCode));
    }
    const updateAdminPassword = await Admin.findOne({
      email: email.toLowerCase(),
    });
    if (!updateAdminPassword) {
      return res
        .status(201)
        .json(error("Admin not registered", res.statusCode));
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    await Admin.findOneAndUpdate({ email: email.toLowerCase() }, { otp: otp });
    // await sendMail(email, "Star Impoters", "", `Your otp is ${otp}`);
    res.status(201).json(success("Otp Sent", { otp }, res.statusCode));
  } catch (err) {
    console.log(err);
    res.status(401).json(error("Wrong Credentials"));
  }
};

// Verify OTP -> Admin
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(req.body);
    if (!email) {
      return res
        .status(201)
        .json(error("Please enter valid mail", res.statusCode));
    }
    if (!validator.isEmail(email)) {
      return res
        .status(201)
        .json(error("Please enter valid mail", res.statusCode));
    }
    if (!otp) {
      return res.status(201).json(error("Please enter OTP", res.statusCode));
    }
    const verifyAdminOtp = await Admin.findOne({
      email: email.toLowerCase(),
    });
    if (!verifyAdminOtp) {
      return res
        .status(201)
        .json(error("Admin not registered", res.statusCode));
    }
    if (verifyAdminOtp.otp !== otp) {
      return res.status(201).json(error("Invalid OTP", res.statusCode));
    }
    await Admin.findOneAndUpdate({ email: email.toLowerCase() }, { otp: "" });
    res.status(201).json(success("OTP Verified", {}, res.statusCode));
  } catch (err) {
    console.log(err);
    res
      .status(201)
      .json(error("Something went wrong while verification", res.statusCode));
  }
};

// Update password -> Admin
exports.updatePassword = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    if (!email) {
      return res.status(201).json(error("Email is Invalid", res.statusCode));
    }
    if (!validator.isEmail(email)) {
      return res.status(201).json(error("Email is Invalid", res.statusCode));
    }
    const admin = await Admin.findOne({
      email: email.toLowerCase(),
    });
    if (!admin) {
      return res
        .status(201)
        .json(error("Email is not registered", res.statusCode));
    }
    admin.password = password;
    // await sendMail(
    //   updateAdminPassword.email,
    //   "Password Changed Star Importers",
    //   updateAdminPassword.fullName,
    //   `Your Password has been changed`
    // );
    await admin.save();
    res
      .status(201)
      .json(success("Password Updated Sucessfully", { admin }, res.statusCode));
  } catch (err) {
    console.log(err);
    res
      .status(401)
      .json(
        error("Something went wrong in password Updation", res.statusCode, err)
      );
  }
};

// Change Password after login -> Admin
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword) {
      return res
        .status(201)
        .json(error("Please provide old password!", res.statusCode));
    }
    if (!newPassword) {
      return res
        .status(201)
        .json(error("Please provide new password!", res.statusCode));
    }
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(201).json(error("Please login!", res.statusCode));
    }
    if (!(await admin.checkAdminPassword(oldPassword, admin.password))) {
      return res
        .status(201)
        .json(error("Old Password not matched", res.statusCode));
    }
    admin.password = newPassword;
    await admin.save();
    // await sendMail(
    //   admin.email,
    //   "Password Changed Star Importers",
    //   admin.fullName,
    //   `Hello ${admin.fullName} Your Password has been changed`
    // );
    res.status(201).json(success("Password Updated Successfully", { admin }));
  } catch (err) {
    console.log(err);
    res
      .status(401)
      .json(error("Error while changing Password", res.statusCode));
  }
};

// Edit profile -> admin
exports.editProfile = async (req, res) => {
  try {
    console.log(req.files);
    const { fullName } = req.body;
    console.log(req.body);
    const admin = await Admin.findById(req.admin._id);
    if (fullName) {
      admin.fullName = fullName;
    }
    if (req.files.length) {
      if (
        !(
          req.files[0].mimetype == "image/jpeg" ||
          req.files[0].mimetype == "image/jpg" ||
          req.files[0].mimetype == "image/webp" ||
          req.files[0].mimetype == "image/svg+xml" ||
          req.files[0].mimetype == "image/png"
        )
      ) {
        return res
          .status(201)
          .json(error("Invalid Image format", res.statusCode));
      } else {
        admin.image = req.files[0].path
          .replace("public\\", "")
          .split("\\")
          .join("/");
      }
    }
    await admin.save();
    res.status(201).json(success("Profile updated Successfully", { admin }));
  } catch (err) {
    console.log(err);
    res.status(401).json(error("Error while profile updation"));
  }
};

// View admin profile
exports.getAdminData = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password");
    res.status(201).json(success("Admin Data fetched Successfully", { admin }));
  } catch (err) {
    console.log(err);
    res.status(401).json("Error while fetching admin data", res.statusCode);
  }
};
