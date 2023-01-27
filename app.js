const express = require("express");
const app = express();
require("express-async-errors");
require("dotenv").config();
const mongoose = require("mongoose");

const path = require("path");
const moment = require("moment");
const flash = require("connect-flash");
const bodyparser = require("body-parser");
const session = require("express-session");
const mongodbstore = require("connect-mongodb-session")(session);

const DATABASE_URI = process.env.DATABASELink;

//image upload service
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "mynodecloudstorage",
  api_key: process.env.Cloudinary_ApiKey,
  api_secret: process.env.Cloudinary_Secret,
  secure: true,
});

const Auth = require("./models/auth");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", "views");
const store = mongodbstore({
  uri: DATABASE_URI,
  Collection: "sessions",
});
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(flash());

//login details
app.use(async (req, res, next) => {
  res.locals.moment = moment;
  res.locals.islog = req.session.islog;
  if (req.session.userid) {
    let userdata = await Auth.findOne({ _id: req.session.userid }).select(
      "username image"
    );

    res.locals.username = userdata.username;
    res.locals.userImg = userdata.image;
  }
  next();
});
app.use((req, res, next) => {
  if (!req.session.userid) {
    return next();
  }
  Auth.findById(req.session.userid)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
      next();
    });
});
//routes
const auth = require("./routes/authRoute");
const admin = require("./routes/adminRoute");
const course = require("./routes/courseRoute");
const student = require("./routes/studentRoute");
const staff = require("./routes/staffRoute");
const attendance = require("./routes/attendanceRoute");
//reports
const reports = require("./routes/reportsRoute");

app.use("/img", express.static("public/img"));
app.use("/auth", auth);
app.use("/admin", admin);
app.use("/course", course);
app.use("/staff", staff);
app.use("/student", student);
app.use("/attendance", attendance);
app.use("/report", reports);

app.use((req, res, next) => {
  return res.render("errors/404.ejs", { title: "Page Not Found" });
});

app.use((err, req, res, next) => {
  return res.render("errors/500.ejs", { title: "Internal Error", err });
});
mongoose
  .connect(DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(3000, () => {
      console.log("server has been start");
    });
  })
  .catch((err) => {
    console.log(err);
  });
