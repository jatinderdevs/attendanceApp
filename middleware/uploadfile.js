const path = require("path");
const multer = require("multer");

var upload = multer({
  //storage: storage,

  fileFilter: function (req, file, cb) {
    const limitsize = 1024 * 1024 * 2;
    const filesize = parseInt(req.headers["content-length"]);

    if (filesize > limitsize) {
      return cb(new Error("only 2MB image sizes are allowed"), false);
    } else if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/jpg"
    ) {
      return cb(null, true);
    } else {
      return cb(new Error("only JPG,PNG,JPEG images are allowed"), false);
    }
  },
});

module.exports = upload;
