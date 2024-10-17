import multer from "multer";
import path from 'path';
import fs from 'fs';
const publicDir = path.join(".", 'public');

// Check if the public directory exists, if not, create it
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, publicDir); // Save files to the public directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Save file with its original name
  },
});
export const upload = multer({storage,})