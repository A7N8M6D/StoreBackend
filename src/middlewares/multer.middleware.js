import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp'); // Specify your destination folder
  },
  filename: function (req, file, cb) {
    console.log(file.fieldname,file.originalname)
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`); // Create a unique filename
  },
});

const upload = multer({ storage });