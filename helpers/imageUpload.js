
const multer = require("multer");
const fs = require("fs");

function createFilePath(req, res, next) {
  fs.exists(`./public/images`, function (exists) {
    if (exists) {
      next();
    } else {
      fs.mkdir(`./public/images`, { recursive: true }, function (err) {
        if (err) {
          console.log("Error in folder creation");
          next();
        }
        next();
      });
    }
  });
}

// module.exports.createFilePath = createFilePath;

const storageDisk = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({
  storage: storageDisk,
  // fileFilter: (req, file, cb) => {
  //     if (file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
  //         cb(null, true)
  //     } else {
  //         cb(null, false);
  //         return cb(new Error("Only .jpeg .jpg and .png file allowed"));
  //     }
  // },
  // limits:{fileSize:5000}
});

module.exports = { upload, createFilePath };
