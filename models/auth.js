const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: "String",
      required: true,
    },
    email: {
      type: "String",
    },
    username: {
      type: "String",
      required: true,
    },
    password: {
      type: "String",
      required: true,
    },
    contactno: {
      type: "String",
      required: true,
    },
    image: {
      type: "String",
      default:
        "http://res.cloudinary.com/mynodecloudstorage/image/upload/v1664266494/fldkry8pbvgapmi2ukzy.png",
    },
    designation: {
      type: "String",
      required: true,
    },
    teach: {
      type: "String",
    },
    role: {
      type: "String",
      required: true,
    },
    isterminate: {
      type: Boolean,
      default: false,
    },
    token: {
      type: "String",
    },
    tokenexpire: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
