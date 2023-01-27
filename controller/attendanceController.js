const Attendance = require("../models/attendance");

const Student = require("../models/student");

const moment = require("moment");

//set date to get today records
let start = new Date();
start.setHours(0, 0, 0, 0);

let end = new Date();
end.setHours(23, 59, 59, 999);

exports.attendance = async (req, res, next) => {
  const userId = req.user.id;

  const attendance = await Attendance.find({
    teacher: userId,
    createdAt: {
      $gte: new Date(start),
      $lte: new Date(end),
    },
  }).populate({
    path: "student",
    select: "name image",
  });

  //add to today attendance show here
  return res.render("attendance/myAttendance.ejs", {
    title: "my attendance",
    attendance,
    row: 0,
  });
};

exports.markAttendance = async (req, res, next) => {
  // if (req.user.role == "admin") {
  //   return res.redirect("/admin/dashboard");
  // }

  const studentId = req.params.id;
  const TODAY = new Date();

  const formatDate = moment(TODAY).format("YYYY-MM-DD");

  const student = await Student.findOne({ _id: studentId }).populate({
    path: "enrollIn",
    select: "name",
  });

  const isExist = await Attendance.findOne({
    student: studentId,
    createdAt: {
      $gte: new Date(formatDate),
    },
  });

  return res.render("attendance/markAttendance.ejs", {
    title: "mark attendance",
    student,
    isExist,
  });
};

exports.postMarkAttendance = async (req, res, next) => {
  const { studentId, remark } = req.body;
  const teacherId = req.user._id;
  let isStudentPresent = true;

  if (remark) {
    isStudentPresent = false;
  }

  const attendance = new Attendance({
    student: studentId,
    teacher: teacherId,
    isPresent: isStudentPresent,
    remark,
    inTime: new Date(),
  });
  const isMarked = await attendance.save();
  if (!isMarked) {
    next("something went wrong");
  }
  return res.redirect("/staff/mystudents");
};

exports.outTime = async (req, res, next) => {
  const { studentId } = req.body;

  const isUpdated = await Attendance.findOneAndUpdate(
    {
      student: studentId,
      createdAt: {
        $gte: new Date(start),
        $lte: new Date(end),
      },
    },
    {
      outTime: new Date(),
    }
  );

  if (!isUpdated) {
    return next("something went wrong");
  }
  return res.redirect("/staff/mystudents");
};

// getRecords by search or select date
exports.getRecords = async (req, res, next) => {
  const { date } = req.body;

  const formatDate = moment(date).format("YYYY-MM-DD");
  const tommorw = new Date(formatDate);
  let addDate = new Date(formatDate);
  tommorw.setDate(addDate.getDate() + 1);

  const teacherId = req.user._id;

  const attendance = await Attendance.find({
    teacher: teacherId,
    createdAt: {
      $gte: new Date(formatDate),
      $lte: new Date(tommorw),
    },
  }).populate({
    path: "student",
    select: "name image",
  });

  return res.render("attendance/myAttendance.ejs", {
    title: "my attendance",
    attendance,
    row: 0,
  });
};

//update the attendance

exports.getUpdate = async (req, res, next) => {
  const studentId = req.params.id;

  const student = await Student.findOne({ _id: studentId }).populate({
    path: "enrollIn",
    select: "name",
  });

  const attendance = await Attendance.findOne({
    student: studentId,
    createdAt: {
      $gte: new Date(start),
      $lte: new Date(end),
    },
  }).select("isPresent remark");

  return res.render("attendance/updateAttendance.ejs", {
    title: "update attendance",
    student,
    attendance,
  });
};

exports.postGetUpdate = async (req, res, next) => {
  const { isPresent, inTime, outTime, remark, aId } = req.body;
  const date = new Date();
  const InTime = new Date(date + " " + inTime);
  console.log(InTime);
  return false;
  let status;
  if (isPresent == "0") {
    status = "true";
  } else {
    status = "false";
  }
  const updateAttendace = await Attendance.findOneAndUpdate(
    { _id: aId },
    {
      inTime,
      outTime,
      remark,
      isPresent: status,
    }
  );
  if (!updateAttendace) {
    return next("something went wrong");
  }
  return res.redirect("/attendance/");
};

//get Attendance Sheet

exports.getAttendanceSheet = async (req, res, next) => {
  const studentId = req.params.id;
  const attendance = await Attendance.find({ student: studentId }).populate({
    path: "student",
    select: "name",
  });

  return res.render("attendance/attendanceSheet.ejs", {
    title: "Attendance Sheet",
    attendance,
    row: 0,
  });
};
