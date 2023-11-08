const { Schema, Types, model } = require("mongoose");

const userSchema = Schema(
  {
    email: {
      type: String,
      required: false,
      unique: true,
    },
    profile_image: {
      type: String,
      required: false,
      default: "",
    },
    password: {
      type: String,
      required: false,
      select: false,
    },
    full_name: {
      type: String,
      required: false,
    },
    phone_number: {
      type: String,
      required: false,
    },
    country_code: {
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
  },
  { timestamps: {} },
  { collection: "User" }
);
