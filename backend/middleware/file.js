const multer = require("multer");

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
  };
  
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid mime Type");
      if (isValid) {
        error = null;
      }
      //For Production
      //cb(error, "images"); //path is relative to server.js

      //For Development
      cb(error, "backend/images"); //path is relative to server.js
    },
    filename: (req, file, cb) => {
      const name = file.originalname.toLowerCase().split(" ").join("-");
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, name + "-" + Date.now() + "." + ext);
    },
  });

  module.exports = multer({ storage: storage }).single("image"); //multer will extract one SINGLE file from the request body "image" property