const Student = require("../models/student");
const Course = require("../models/course");
const Teacher = require("../models/auth");

const {
  cloudUpload,
  getImageID,
  removeImage,
} = require("../middleware/cloudService");

const { validationResult } = require("express-validator");

const PAGE_SIZE = 10;

exports.index = async (req, res, next) => {
  const page = req.query.page;
  const records = (page - 1) * PAGE_SIZE;

  const totalStudents = await Student.find({
    isCourseComplete: false,
  }).countDocuments();
  const totalpages = totalStudents / PAGE_SIZE;

  const students = await Student.find({ isCourseComplete: false })
    .skip(records)
    .limit(PAGE_SIZE)
    .populate({
      path: "enrollIn",
      select: "name",
    });
  return res.render("student/index.ejs", {
    title: "index",
    students,
    row: 0,
    pages: totalpages,
  });
};

exports.create = async (req, res, next) => {
  const courses = await Course.find();
  const teachers = await Teacher.find({ isterminate: false }).select("name");

  return res.render("student/create.ejs", {
    title: "Create student",
    courses,
    teachers,
    msg: undefined,
    data: {
      enrollIn: "",
      teacher: "",
    },
    pageTitle: "Add",
  });
};

exports.postCreate = async (req, res, next) => {
  const {
    name,
    email,
    contact,
    fatherName,
    dateOfBirth,
    alterContact,
    address,
    teacher,
    enroll,
  } = req.body;

  //validation check here
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const courses = await Course.find();
    const teachers = await Teacher.find({ isterminate: false }).select("name");

    return res.render("student/create.ejs", {
      title: "Create student",
      courses,
      teachers,
      data: req.body,

      pageTitle: "Add",
      msg: err.array()[0].msg,
    });
  }
  const imageUrl = await cloudUpload(req);
  const studentId = getStudentId();

  const student = new Student({
    name,
    email,
    contact,
    fatherName,
    dateOfBirth,
    alterContact,
    address,
    teacher,
    studentId: studentId,
    enrollIn: enroll,
    image: imageUrl,
  });

  const created = await student.save();
  if (!created) {
    next("something went wrong");
  }
  return res.redirect("/student/");
};

exports.view = async (req, res, next) => {
  const id = req.params.id;
  const student = await Student.findOne({ _id: id })
    .populate({
      path: "teacher",
      select: "name",
    })
    .populate({ path: "enrollIn", select: "name" });

  return res.render("student/view.ejs", {
    title: "View Student",
    student,
    role: req.user.role,
  });
};

exports.edit = async (req, res, next) => {
  const id = req.params.id;
  const courses = await Course.find();
  const teachers = await Teacher.find({ isterminate: false }).select("name");

  const student = await Student.findOne({ _id: id });

  return res.render("student/create.ejs", {
    title: "edit student",
    data: student,

    courses,
    teachers,
    msg: undefined,
    pageTitle: "update",
  });
};

exports.postEdit = async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  const student = await Student.findOne({ _id: id });

  const err = validationResult(req);

  if (!err.isEmpty()) {
    const courses = await Course.find();
    const teachers = await Teacher.find({ isterminate: false }).select("name");

    return res.render("student/create.ejs", {
      title: "edit student",
      data: student,

      courses,
      teachers,
      msg: err.array()[0].msg,
      pageTitle: "update",
    });
  }
  let imageUrl = student.image;
  if (req.file) {
    const imgId = getImageID(student.image);
    await removeImage(imgId);
    imageUrl = await cloudUpload(req);
  }

  const update = await Student.findByIdAndUpdate(
    { _id: id },
    {
      name: data.name,
      fatherName: data.fatherName,
      dateOfBirth: data.dateOfBirth,
      email: data.email,
      contact: data.contact,
      alterContact: data.alterContact,
      address: data.address,
      enrollIn: data.enroll,
      teacher: data.teacher,
      image: imageUrl,
    }
  );
  if (!update) {
    next("something went wrong");
  }
  return res.redirect("/student/");
};

exports.courseComplete = async (req, res, next) => {
  const { id } = req.body;

  const student = await Student.findOne({ _id: id }).select(
    "isCourseComplete teacher"
  );

  if (req.user.role != "admin") {
    const userId = req.user._id;
    if (student.teacher.toString() != userId.toString()) {
      return res.redirect("/student/");
    }
  }

  if (!student.isCourseComplete) {
    student.isCourseComplete = true;
  } else {
    student.isCourseComplete = false;
    student.courseCompleteDate = new Date();
  }
  const update = await student.save();

  if (!update) {
    next("something went wrong");
  }
  return res.redirect("/student/");
};

exports.terminate = async (req, res, next) => {
  const { id } = req.body;

  const student = await Student.findOne({ _id: id }).select("isterminate");

  if (!student.isterminate) {
    student.isterminate = true;
  } else {
    student.isterminate = false;
  }
  const update = await student.save();

  if (!update) {
    next("something went wrong");
  }
  return res.redirect("/student/");
};

//search student by Id

exports.search = async (req, res, next) => {
  const studentId = req.params.studentId;

  const regx = new RegExp(`.*${studentId}.*`, "i");

  const students = await Student.find({
    studentId: regx,
  })
    .select("image name studentId")
    .limit(5);

  return res.json(students);
};

function getStudentId() {
  const result = Math.random() * (100000 - 9999) + 99;
  const studentId = Math.floor(result);

  return studentId;
}
