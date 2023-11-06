const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const adminRegisterSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["Admin", "SubAdmin"],
      default:"Admin"
    },
    status: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      // required: true,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
    },
  },
  { timestamps: true },
  { collection: "Admin" }
);

adminRegisterSchema.methods.checkAdminPassword = async function (
  plainPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

adminRegisterSchema.methods.generateAdminAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, "ultra-security", {
    expiresIn: "365d",
  });
  return token;
};

adminRegisterSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    return (this.password = await bcrypt.hash(this.password, 10));
  }
  next();
});

const Admin = mongoose.model("Admin", adminRegisterSchema);

module.exports = Admin;
