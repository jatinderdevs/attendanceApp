const Staff = require("../models/auth");
const Course = require("../models/course");

const Attendance = require("../models/attendance");

const Student = require("../models/student");

const moment = require("moment");

exports.getStudentsByTeachers = async (req, res, next) => {
  const staff = await Staff.find({ isterminate: false }).select("name");

  const teacher = [];
  const numberOfStudent = [];
  for (let a = 0; a < staff.length; a++) {
    const staffData = await Student.find({
      teacher: staff[a]._id,
    }).countDocuments();
    teacher.push(staff[a].name);
    numberOfStudent.push(staffData);
  }
  return res.json({ teacher, numberOfStudent });
};

exports.getStudentsByCourse = async (req, res, next) => {
  const courses = await Course.find().select("name");

  const coursesName = [];
  const totalStudent = [];

  for (let a = 0; a < courses.length; a++) {
    const students = await Student.find({
      enrollIn: courses[a]._id,
    }).countDocuments();

    coursesName.push(courses[a].name);
    totalStudent.push(students);
  }
  return res.json({ coursesName, totalStudent });
};
