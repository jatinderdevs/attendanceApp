const express = require("express");

const router = express.Router();

const controller = require("../controller/courseController");

const { isadmin } = require("../middleware/isAuth");

const { body } = require("express-validator/check");

router.get("/", isadmin, controller.courses);

router.get("/create", isadmin, controller.create);

router.post(
  "/create",
  isadmin,
  [
    body("name", "Please enter course name").notEmpty(),
    body("duration", "Please enter the duration of the course").notEmpty(),
  ],
  controller.postCreate
);

router.get("/edit/:id", isadmin, controller.edit);

router.post(
  "/edit/:id",
  isadmin,
  [
    body("name", "Please enter course name").notEmpty(),
    body("duration", "Please enter the duration of the course").notEmpty(),
  ],
  controller.update
);

router.post("/remove", isadmin, controller.remove);

module.exports = router;
