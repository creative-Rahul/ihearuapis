const { Schema, Types, model } = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = Schema(
  {
    email: {
      type: String,
      required: false,
      unique: true,
    },
    image: {
      type: String,
      required: false,
      default: "",
    },
    password: {
      type: String,
      required: false,
      select: false,
    },
    fullName: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: false,
      unique: true,
    },
    alternateNumber: {
      type: String,
      required: false,
      unique: true,
    },
    countryCode: {
      type: String,
      required: false,
    },
    otp: {
      type: Number,
    },
    expire_time: {
      type: Date,
      required: false,
    },
    gender: {
      type: String,
      required: false,
    },
    birthYear: {
      type: Number,
      required: false,
    },
    type: {
      type: String,
      required: false,
      enum: ["Caller", "Listener", "Listener+"],
      default: "Caller",
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: Boolean,
      required: false,
      default: true,
    },
    deviceId: {
      type: String,
      required: false,
      default: "",
    },
    deviceOS: {
      type: String,
      required: false,
      default: "",
    },
    emergencyContactName: {
      type: String,
      required: false,
    },
    emergencyContactRelation: {
      type: String,
      required: false,
    },
    emergencyContactNumber: {
      type: String,
      required: false,
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: {} },
  { collection: "User" }
);
userSchema.methods.correctPassword = async (
  passwordFromDatabase,
  passwordFromFrontend
) => {
  return await bcrypt.compare(passwordFromDatabase, passwordFromFrontend);
};

userSchema.methods.changedPasswordAfter = (JWTTimestamp) => {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimeStamp, JWTTimestamp);
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

userSchema.pre("save", async function (next) {
  console.log(this.isModified("password"));
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 7);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
    },
    "ultra-security",
    {
      expiresIn: "90d",
    }
  );
  return token;
};

const User = model("User", userSchema);
module.exports = User;
