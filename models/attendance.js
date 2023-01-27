const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const attendanceSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "student",
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    inTime: {
      type: Date,
      require: true,
    },
    outTime: {
      type: Date,
    },
    isPresent: {
      type: Boolean,
      require: true,
    },

    remark: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("attendance", attendanceSchema);
