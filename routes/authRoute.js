const express = require("express");
const router = express.Router();
const controller = require("../controller/authController");
const { body } = require("express-validator/check");
const { isadmin, islog } = require("../middleware/isAuth");
const upload = require("../middleware/uploadfile");

router.get("/", controller.signIn);
router.post("/", controller.postSignIn);

router.get("/signup", isadmin, controller.signUp);

router.post(
  "/signup",
  isadmin,
  upload.single("img"),
  [
    body("username", "Please enter username").notEmpty(),
    body("name", "Please enter FullName").notEmpty(),
    body("contact", "Please enter Contact number").notEmpty(),
    body("designation", "Please enter Designation").notEmpty(),
    body("teach", "Please select Teaching Subject").notEmpty(),
    body("role", "Please select Role of a user").notEmpty(),
    body("email").isEmail().withMessage("please enter a correct email address"),
    body("password", "Password Should be minimum 5 Charcters").isLength({
      min: 5,
    }),
  ],
  controller.postSignUp
);

router.get("/profile", controller.profile);

router.get("/edit", islog, controller.edit);

router.post(
  "/edit",
  upload.single("img"),
  [
    body("name", "Please enter your name").notEmpty(),
    body("email", "Please enter the email").notEmpty(),
    body("contact", "Please enter the contact").notEmpty(),
  ],
  islog,
  controller.postEdit
);

//router.post("/signin", controller.postsignin);

// router.get('/forgot', controller.forgotpassword);

// router.post('/forgot', controller.postforgotpassword);

// router.get('/resetpassword/:token', controller.resetpassword);

// router.post('/resetpassword/:token', controller.postrestpassword);

router.get("/signout", controller.signOut);

module.exports = router;
