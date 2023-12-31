const User = require("../../models/userModels/userSchema");
const { error, success } = require("../../service_response/apiResponse");
const validator = require("validator");

exports.signup = async (req, res) => {
  try {
    const { phoneNumber, deviceId, deviceOS, type } = req.body;
    console.log(req.body);
    if (!phoneNumber) {
      return res
        .status(201)
        .json(error("Please provide phone number!", res.statusCode));
    }
    if (!type) {
      return res
        .status(201)
        .json(error("Please provide type!", res.statusCode));
    }
    let user;
    const otp = Math.floor(1000 + Math.random() * 9000);
    const verifyUser = await User.findOne({ phoneNumber: phoneNumber });
    // if (verifyUser.isVerified) {
    //   return res
    //     .status(201)
    //     .json(error("Phone number is already registered!", res.statusCode));
    // }
    if (verifyUser) {
      if (verifyUser.isVerified) verifyUser.otp = otp;
      if (verifyUser.isVerified) verifyUser.type = type;
      if (deviceId) verifyUser.deviceId = deviceId;
      if (deviceOS) verifyUser.deviceOS = deviceOS;
      user = await verifyUser.save();
    }
    if (!verifyUser) {
      let query = { phoneNumber: phoneNumber, otp: otp, type: type };
      if (deviceId) query.deviceId = deviceId;
      if (deviceOS) query.deviceOS = deviceOS;
      user = await User.create(query);
    }
    console.log(verifyUser);
    res
      .status(201)
      .json(success("Signup successful", { user }, res.statusCode));
  } catch (err) {
    console.log(err);
    res.status(400).json(error("error", res.statusCode));
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { otp, phoneNumber } = req.body;
    if (!phoneNumber) {
      return res
        .status(201)
        .json(error("Please provide phone number!", res.statusCode));
    }
    if (!otp) {
      return res.status(201).json(error("Please provide OTP!", res.statusCode));
    }
    const user = await User.findOne({ phoneNumber: phoneNumber });
    if (user.otp !== +otp) {
      return res.status(201).json(error("Invalid OTP", res.statusCode));
    }
    const myUser = await User.findByIdAndUpdate(
      user._id,
      {
        otp: "",
        isVerified: true,
      },
      { new: true }
    );
    const token = user.generateAuthToken();
    let profileSetup = !user.isProfileCompleted;

    res
      .header("x-auth-token-user", token)
      .header("access-control-expose-headers", "x-auth-token-user")
      .status(201)
      .json(
        success(
          "OTP Verified",
          { profileSetup, user: myUser, token },
          res.statusCode
        )
      );
  } catch (err) {
    console.log(err);
    res.status(400).json(error("error", res.statusCode));
  }
};

exports.completeProfile = async (req, res) => {
  try {
    const {
      email,
      password,
      fullName,
      alternateNumber,
      gender,
      birthYear,
      emergencyContactName,
      emergencyContactRelation,
      emergencyContactNumber,
    } = req.body;
    console.log(req.body);
    console.log(req.files);
    if (!fullName) {
      return res
        .status(201)
        .json(error("Please provide full name!", res.statusCode));
    }
    if (!birthYear) {
      return res
        .status(201)
        .json(error("Please provide birth year!", res.statusCode));
    }
    if (!gender) {
      return res
        .status(201)
        .json(error("Please provide gender!", res.statusCode));
    }
    if (!email) {
      return res
        .status(201)
        .json(error("Please provide email!", res.statusCode));
    }
    if (!validator.isEmail(email)) {
      return res.status(201).json(error("Invalid email!", res.statusCode));
    }
    const verifyUser = await User.findOne({ email: email });
    if (!verifyUser) {
      return res
        .status(201)
        .json(error("Email is already registered!", res.statusCode));
    }
    if (!alternateNumber) {
      return res
        .status(201)
        .json(error("Please provide contact number!", res.statusCode));
    }
    if (!req.files.length) {
      return res
        .status(201)
        .json(error("Please provide profile image!", res.statusCode));
    }
    let query = {
      email: email,
      image: req.files[0].path.replace("public\\", "").split("\\").join("/"),
      password: password,
      fullName: fullName,
      gender: gender,
      birthYear: birthYear,
      alternateNumber: alternateNumber,
      emergencyContactName: emergencyContactName,
      emergencyContactRelation: emergencyContactRelation,
      emergencyContactNumber: emergencyContactNumber,
    };
    const user = await User.findByIdAndUpdate(req.user._id, query, {
      new: true,
    });
    res.status(201).json(success("OTP Verified", { user }, res.statusCode));
  } catch (err) {
    console.log(err);
    res.status(400).json(error("error", res.statusCode));
  }
};
