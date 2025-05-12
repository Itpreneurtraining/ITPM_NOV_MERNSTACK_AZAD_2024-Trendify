// import multer from "multer";

// const storage = multer.diskStorage({
//   filename: function (req, file, callback) {
//     callback(null, file.originalname);
//   },
// });

// const upload = multer({ storage })
// // const upload = multer({ dest: "uploads/" }); // Temporary file storage


// export default upload;
// // 
// backend/middleware/multerConfig.js
import multer from "multer";

const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

export default upload;
