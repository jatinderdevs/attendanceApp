const express = require("express");

const router = express.Router();

const controller = require("../controller/staffController");

const { islog, isadmin } = require("../middleware/isAuth");

const { body } = require("express-validator/check");

router.get("/", isadmin, controller.staff);

router.get("/dashboard", islog, controller.dashboard);

router.get("/mystudents", islog, controller.mystudent);

router.get("/view/:id", isadmin, controller.view);

router.get("/edit/:id", isadmin, controller.edit);

router.post(
  "/edit/:id",
  [
    [
      body("name", "Please enter your name").notEmpty(),
      body("email", "Please enter the email").notEmpty(),
      body("contact", "Please enter the contact").notEmpty(),
      body("designation", "Please enter the designation").notEmpty(),
      body("role", "Please enter the role").notEmpty(),
      body("teach", "Please enter the teach subjects").notEmpty(),
    ],
  ],
  isadmin,
  controller.update
);

router.post("/search/:studentId", islog, controller.search);

router.post("/terminate", isadmin, controller.terminate);

module.exports = router;
