const Course = require("../models/course");

const { validationResult } = require("express-validator");

exports.courses = async (req, res, next) => {
  const courses = await Course.find();
  return res.render("course/index.ejs", {
    title: "courses",
    courses: courses,
    rows: 0,
  });
};

exports.create = async (req, res, next) => {
  return res.render("course/create.ejs", {
    title: "create course",
    msg: undefined,
    name: "",
    duration: "",
    heading: "create",
  });
};

exports.postCreate = async (req, res, next) => {
  const { name, duration } = req.body;

  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(422).render("course/create.ejs", {
      title: "Create Course",
      msg: error.array()[0].msg,
      name,
      heading: "create",
      duration,
    });
  }
  const course = new Course({
    name,
    duration,
  });
  const isCreated = await course.save();
  if (isCreated) {
    return res.redirect("/course/");
  }
};

exports.edit = async (req, res, next) => {
  const { id } = req.params;
  const course = await Course.findOne({ _id: id });

  return res.render("course/create.ejs", {
    title: "edit course",
    course: course,
    msg: undefined,
    name: course.name,
    duration: course.duration,
    heading: "edit",
  });
};

exports.update = async (req, res, next) => {
  const { name, duration } = req.body;
  const { id } = req.params;
  const course = await Course.findOne({ _id: id });
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.render("course/create.ejs", {
      title: "edit course",
      course: course,
      msg: error.array()[0].msg,
      name: course.name,
      duration: course.duration,
      heading: "edit",
    });
  }
  course.name = name;
  course.duration = duration;

  const isUpdate = await course.save();
  if (isUpdate) {
    return res.redirect("/course/");
  }
};

exports.remove = async (req, res, next) => {
  const { id } = req.body;
  console.log(id);
  const removed = await Course.findByIdAndRemove(id);
  if (!removed) {
    next();
  }
  return res.redirect("/course/");
};
