// import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, 'uploads/'); // Store the files in an 'uploads' directory
//   },
//   filename(req, file, cb) {
//     cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
//   }
// });


// const checkFileType = (file, cb) => {
//   const filetypes = /jpeg|jpg|png/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (extname && mimetype) {
//     return cb(null, true);
//   } else {
//     cb('Error: Only images (jpeg, jpg, png) are allowed!');
//   }
// };

// export const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     checkFileType(file, cb);
//   },
// });



import multer from "multer";
import path from "path";

function determineUploadPath(req, fieldname) {
  return 'assets/';
}

export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, next) => {
      const fieldname = file.fieldname;
      const uploadPath = determineUploadPath(req, fieldname);
      console.log(file)
      next(null, uploadPath);
    },
    filename: (req, file, next) => {
      // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const originalname = file.originalname;
      const lastDotIndex = originalname.lastIndexOf('.');
      const ext = originalname.substring(lastDotIndex);
      //const imageFileName = file.originalname.replace(/\.[^/.]+$/, '')
      const imageFileName = file.originalname.split('.').slice(0, -1).join('.').replace(/\s/g, '_');
      const uniqueFileName = `${imageFileName}-${Date.now()}${ext}`;
      next(null, uniqueFileName);
      // const imageFileName = file.originalname.replace(/\s/g, '_');
      // next(null, imageFileName);
    },
  }),
});
