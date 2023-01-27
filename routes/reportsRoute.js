const { isadmin } = require("../middleware/isAuth");
const express = require("express");
const router = express.Router();

const controller = require("../controller/reportsController");

router.get("/getStudentsById", isadmin, controller.getStudentsByTeachers);
router.get("/getStudentsByCourse", isadmin, controller.getStudentsByCourse);

module.exports = router;
