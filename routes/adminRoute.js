const express = require("express");
const router = express.Router();
const controller = require("../controller/adminController");
const { isadmin } = require("../middleware/isAuth");

router.get("/dashboard", isadmin, controller.dashboard);

router.get("/passout", isadmin, controller.passout);

module.exports = router;
