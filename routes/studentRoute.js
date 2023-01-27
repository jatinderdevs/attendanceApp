const express = require("express");

const router = express.Router();

const { body } = require("express-validator");

const { isadmin, islog } = require("../middleware/isAuth");

const upload = require("../middleware/uploadfile");

const controller = require("../controller/studentController");

router.get("/", isadmin, controller.index);
//passout students

router.get("/create", isadmin, controller.create);

router.post(
  "/create",
  isadmin,
  upload.single("img"),
  [
    body("name", "Please enter the name").notEmpty(),
    body("fatherName", "Please enter the fatherName").notEmpty(),
    body("email", "Please enter the email").notEmpty(),
    body("dateOfBirth", "Please enter the Date of birth").notEmpty(),
    body("contact", "Please enter the contact").notEmpty(),
    body("address", "Please enter the address").notEmpty(),
    body("enroll", "Please select the course ").notEmpty(),
    body("teacher", "Please select the teacher ").notEmpty(),
  ],
  controller.postCreate
);

router.get("/view/:id", islog, controller.view);

///edit routes
router.get("/edit/:id", isadmin, controller.edit);

router.post(
  "/edit/:id",
  isadmin,
  upload.single("img"),
  [
    body("name", "Please enter the name").notEmpty(),
    body("fatherName", "Please enter the fatherName").notEmpty(),
    body("email", "Please enter the email").notEmpty(),
    body("dateOfBirth", "Please enter the Date of birth").notEmpty(),
    body("contact", "Please enter the contact").notEmpty(),
    body("address", "Please enter the address").notEmpty(),
    body("enroll", "Please select the course ").notEmpty(),
    body("teacher", "Please select the teacher ").notEmpty(),
  ],
  controller.postEdit
);

router.post("/courseComplete", islog, controller.courseComplete);

router.post("/terminate", isadmin, controller.terminate);

router.post("/search/:studentId", islog, controller.search);

module.exports = router;
