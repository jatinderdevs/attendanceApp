//staff model
const Auth = require("../models/auth");

const Student = require("../models/student");
const Attendance = require("../models/attendance");

const { validationResult } = require("express-validator");

exports.dashboard = async (req, res, next) => {
  const userId = req.user._id;
  var start = new Date();
  start.setHours(0, 0, 0, 0);

  var end = new Date();
  end.setHours(23, 59, 59, 999);

  const studentCount = await Student.find({
    teacher: userId,
    isterminate: false,
    isCourseComplete: false,
  }).countDocuments();
  const passoutCount = await Student.find({
    teacher: userId,
    isCourseComplete: true,
  }).countDocuments();

  const attendanceCount = await Attendance.find({
    teacher: userId,
    createdAt: {
      $gte: new Date(start),
      $lte: new Date(end),
    },
  }).countDocuments();
  return res.render("staff/dashboard.ejs", {
    title: "dashboard",
    studentCount,
    attendanceCount,
    passoutCount,
  });
};

//mystudents show according to the teacher login
exports.mystudent = async (req, res, next) => {
  const userId = req.user._id;
  const students = await Student.find({
    teacher: userId,
    isCourseComplete: false,
    isterminate: false,
  }).populate({
    path: "enrollIn",
    select: "name",
  });

  return res.render("staff/mystudents.ejs", {
    title: "my students",
    students,
    rows: 0,
  });
};

exports.staff = async (req, res, next) => {
  const Staff = await Auth.find().sort({ _id: -1 });
  return res.render("staff/index.ejs", {
    title: "Staff member",
    staff: Staff,
    rows: 0,
  });
};

exports.view = async (req, res, next) => {
  const id = req.params.id;
  const staff = await Auth.findOne({ _id: id });
  const totalStudents = await Student.find({
    teacher: id,
    isCourseComplete: false,
    isterminate: false,
  }).countDocuments();
  return res.render("staff/view.ejs", { title: "view", staff, totalStudents });
};

exports.edit = async (req, res, next) => {
  const id = req.params.id;
  const staff = await Auth.findOne({ _id: id });
  return res.render("staff/edit.ejs", { title: "edit", staff, msg: undefined });
};

exports.update = async (req, res, next) => {
  const { name, designation, email, role, teach, contact } = req.body;

  const id = req.params.id;
  const staff = await Auth.findOne({ _id: id });
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.render("staff/edit.ejs", {
      title: "edit",
      staff,
      msg: error.array()[0].msg,
    });
  }
  staff.name = name;
  staff.designation = designation;
  staff.email = email;
  staff.role = role;
  staff.teach = teach;
  staff.contactno = contact;

  const update = await staff.save();
  if (!update) {
    next("something went wrong!");
  }
  return res.redirect("/staff/");
};

exports.terminate = async (req, res, next) => {
  const id = req.body.id;

  const staff = await Auth.findOne({ _id: id });

  if (!staff.isterminate) {
    staff.isterminate = true;
  } else {
    staff.isterminate = false;
  }
  const update = await staff.save();
  if (!update) {
    next("something went wrong");
  }
  return res.redirect("/staff/");
};

exports.search = async (req, res, next) => {
  const studentId = req.params.studentId;
  const teacherId = req.user._id;
  const regx = new RegExp(`.*${studentId}.*`, "i");

  const students = await Student.find({
    studentId: regx,
    isterminate: false,
    teacher: teacherId,
  })
    .select("image name studentId")
    .limit(5);
  return res.json(students);
};
