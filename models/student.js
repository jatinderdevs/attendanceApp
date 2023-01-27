const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema(
  {
    name: {
      type: "String",
      required: true,
    },
    fatherName: {
      type: "String",
      required: true,
    },
    studentId: {
      type: "String",
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    email: {
      type: "String",
    },
    contact: {
      type: "String",
      required: true,
    },
    alterContact: {
      type: "String",
    },
    address: {
      type: "String",
      required: true,
    },
    enrollIn: {
      type: Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },

    teacher: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    image: {
      type: "String",
      default:
        "https://res.cloudinary.com/mynodecloudstorage/image/upload/v1656137435/dga2gnusrih8dbyade6q.png",
    },
    isterminate: {
      type: Boolean,
      default: false,
    },
    isCourseComplete: {
      type: Boolean,
      default: false,
    },
    courseCompleteDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("student", studentSchema);
