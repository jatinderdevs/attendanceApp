const express = require("express");

const router = express.Router();

const controller = require("../controller/attendanceController");

const { islog } = require("../middleware/isAuth");

router.get("/", islog, controller.attendance);

router.get("/mark/:id", islog, controller.markAttendance);

router.post("/mark/", islog, controller.postMarkAttendance);

router.post("/outtime/", islog, controller.outTime);

router.post("/getAttendance/", islog, controller.getRecords);

router.get("/updateAttendace/:id", islog, controller.getUpdate);

router.post("/updateAttendace/:id", islog, controller.postGetUpdate);

router.get("/attendanceSheet/:id", islog, controller.getAttendanceSheet);

module.exports = router;
