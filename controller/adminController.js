const Staff = require("../models/auth");
const Course = require("../models/course");
const Student = require("../models/student");

const PAGE_SIZE = 10;

exports.dashboard = async (req, res, next) => {
  const staffCount = await Staff.countDocuments();
  const student = await Student.countDocuments({ isCourseComplete: false });
  const courseCount = await Course.countDocuments();

  //student who completed the course
  const passOut = await Student.countDocuments({ isCourseComplete: true });

  return res.render("admin/dashboard.ejs", {
    title: "Dashboard",
    staffCount,
    student,
    courseCount,
    passOut,
  });
};

//pass out students
exports.passout = async (req, res, next) => {
  const page = req.query.page;
  const records = (page - 1) * PAGE_SIZE;

  const totalStudents = await Student.find({
    isCourseComplete: false,
  }).countDocuments();
  const totalpages = totalStudents / PAGE_SIZE;

  const students = await Student.find({ isCourseComplete: true })
    .skip(records)
    .limit(PAGE_SIZE)
    .populate({
      path: "enrollIn",
      select: "name",
    });
  return res.render("admin/passOutStudents.ejs", {
    title: "Pass Out Students",
    students,
    row: 0,
    pages: totalpages,
  });
};
