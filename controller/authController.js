const Auth = require("../models/auth");
const Courses = require("../models/course");
const { validationResult } = require("express-validator");
// const sgMail = require('@sendgrid/mail');
const bcrypt = require("bcryptjs");
const { cloudUpload } = require("../middleware/cloudService");

exports.signUp = async (req, res, next) => {
  let errmsg = req.flash("error");
  let success = req.flash("success");
  const courses = await Courses.find().select("name");
  let className = "";
  if (errmsg.length > 0) {
    errmsg = errmsg[0].trim();
    className = "alert-danger";
  }
  if (success.length > 0) {
    errmsg = success[0].trim();
    className = "alert-success";
  }

  return res.render("auth/signup.ejs", {
    title: "signUp",
    msg: errmsg,
    className,
    username: "",
    name: "",
    email: "",
    contactno: "",
    designation: "",
    courses,
    teach: "",
  });
};

exports.postSignUp = async (req, res, next) => {
  const { username, name, email, password, contact, designation, role, teach } =
    req.body;
  const error = validationResult(req);

  const isexist = await Auth.findOne({ username: username });
  if (isexist) {
    req.flash("error", "username already taken !");
    return res.redirect("/auth/signup");
  }
  if (!isexist && !error.isEmpty()) {
    const courses = await Courses.find().select("name");

    return res.status(422).render("auth/signup.ejs", {
      title: "Sign Up",
      msg: error.array()[0].msg,
      className: "alert-danger",
      username,
      name,
      email,
      password,
      contactno: contact,
      designation,
      courses,
      role,
      teach,
    });
  }
  const imgUrl = await cloudUpload(req);
  const hashpassword = await bcrypt.hash(password, 12);
  const user = new Auth({
    username,
    name,
    email,
    password: hashpassword,
    contactno: contact,
    designation,
    role,
    teach,
    image: imgUrl,
  });
  const isCreated = await user.save();
  if (!isCreated) {
    req.flash("error", "Something went wrong Please try again later");
    return res.redirect("/auth/signup");
  }
  req.flash("success", "created Successfully!");
  return res.redirect("/auth/signup");
};

exports.signIn = async (req, res, next) => {
  let errmsg = req.flash("error");
  if (errmsg.length > 0) {
    errmsg = errmsg[0].trim();
  } else {
    errmsg = undefined;
  }
  return res.render("auth/signIn.ejs", {
    title: "signIn",
    msg: errmsg,
  });
};
exports.postSignIn = async (req, res, next) => {
  const { username, password } = req.body;

  const user = await Auth.findOne({ username: username }).select(
    "role password isterminate"
  );

  if (!user) {
    req.flash("error", "Username Is Incorrect!");
    return res.redirect("/auth/");
  }
  const ismatch = await bcrypt.compare(password, user.password);
  if (!ismatch) {
    req.flash("error", "Password Is Incorrect!");
    return res.redirect("/auth/");
  }
  if (user.isterminate) {
    req.flash("error", "you are terminated Contact Admin");
    return res.redirect("/auth/");
  }
  req.session.userid = user._id;
  req.session.islog = true;
  return req.session.save((err) => {
    if (user.role.trim() == "admin") {
      return res.redirect("/admin/dashboard");
    }
    return res.redirect("/staff/dashboard");
  });
};

exports.profile = async (req, res, next) => {
  const user = await Auth.findOne({ _id: req.user._id });

  return res.render("auth/profile.ejs", { title: "Profile", user: user });
};

//update profile
exports.edit = async (req, res, next) => {
  const user = await Auth.findOne({ _id: req.user._id });

  return res.render("auth/editprofile.ejs", {
    title: "edit Profile",
    user: user,
    msg: "",
  });
};

exports.postEdit = async (req, res, next) => {
  const { name, email, contact } = req.body;
  const user = await Auth.findOne({ _id: req.user._id });

  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.render("auth/editprofile.ejs", {
      title: "edit Profile",
      user: user,
      msg: error.array()[0].msg,
    });
  }
  user.name = name;
  user.email = email;
  user.contactno = contact;
  if (req.file) {
    user.image = await cloudUpload(req);
  }
  const update = await user.save();
  if (!update) {
    next("something went wrong");
  }
  return res.redirect("/auth/profile");
};
exports.signOut = async (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/auth/");
  });
};
