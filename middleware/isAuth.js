exports.islog = (req, res, next) => {
  if (!req.session.islog) {
    req.flash("error", "you are not authorized!");
    return res.redirect("/signin");
  }
  next();
};

exports.isadmin = (req, res, next) => {
  if (!req.session.islog) {
    req.flash("error", "you are not authorized!");
    return res.redirect("/signin");
  }
  if (req.user.role == "admin") {
    return next();
  }
  return res.redirect("/staff/dashboard");
};

//check the student relate to teacher
// exports.isMyStudent = (req, res, next) => {
//   if (req.user.role != "admin") {
//     const userId = req.user._id;
//     if (student.teacher.toString() != userId.toString()) {
//       throw new Error(
//         "you are not authorized to process this request Contact Admin"
//       );
//     }
//   }
// };
